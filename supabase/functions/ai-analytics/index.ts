import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, data, type, modelType } = await req.json()
    console.log('AI Analytics request:', { query, type, modelType, dataLength: data?.length })
    
    // Check for OpenRouter API key
    const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY')
    if (!openrouterApiKey) {
      console.error('OPENROUTER_API_KEY not found in environment')
      
      // Generate a fallback response when API key is missing
      return new Response(
        JSON.stringify({ 
          response: generateFallbackResponse(query, modelType),
          confidence: 0.5
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let systemPrompt = `You are QueryHive AI, an expert data analyst. Help users analyze their data and generate insights.`
    
    // Customize prompt based on model type
    if (modelType === 'linear_regression') {
      systemPrompt += ` You are performing linear regression analysis. Identify relationships between variables, predict trends, and explain correlations in the data.`
    } else if (modelType === 'clustering') {
      systemPrompt += ` You are performing K-means clustering analysis. Identify natural groupings in the data, explain cluster characteristics, and provide insights about data segments.`
    } else if (modelType === 'anomaly_detection') {
      systemPrompt += ` You are performing anomaly detection analysis. Identify outliers, unusual patterns, and data points that deviate from normal behavior.`
    } else if (modelType === 'time_series') {
      systemPrompt += ` You are performing time series analysis. Identify trends, seasonality, patterns over time, and make forecasts based on historical data.`
    }

    systemPrompt += `
    
    When analyzing data:
    1. Provide clear, actionable insights
    2. Identify patterns, trends, and anomalies
    3. Suggest data visualizations when appropriate
    4. Be concise but thorough
    5. Use business-friendly language
    6. Provide specific recommendations based on the analysis
    
    Data sample (first 3 rows): ${JSON.stringify(data?.slice(0, 3) || [])}`

    try {
      const openaiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openrouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://queryhive.ai',
          'X-Title': 'QueryHive AI',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: query
            }
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      })

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text()
        console.error('OpenRouter API error:', openaiResponse.status, errorText)
        throw new Error(`OpenRouter API error: ${openaiResponse.statusText}`)
      }

      const result = await openaiResponse.json()
      const aiResponse = result.choices[0]?.message?.content

      if (!aiResponse) {
        throw new Error('No response from AI model')
      }

      // Store the query and response
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const authHeader = req.headers.get('Authorization')!
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabaseClient.auth.getUser(token)

      if (user) {
        const { error: insertError } = await supabaseClient
          .from('analytics_queries')
          .insert({
            user_id: user.id,
            query_text: query,
            query_type: type || 'natural_language',
            results: { response: aiResponse, modelType },
            execution_time_ms: Date.now(),
          })
        
        if (insertError) {
          console.error('Error storing query:', insertError)
        }
      }

      console.log('AI Analytics response generated successfully')
      return new Response(
        JSON.stringify({ response: aiResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      console.error('OpenRouter API or processing error:', error)
      
      // Generate a fallback response when API call fails
      return new Response(
        JSON.stringify({ 
          response: generateFallbackResponse(query, modelType),
          confidence: 0.5
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Error in ai-analytics function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Generate a fallback response when the AI service is unavailable
function generateFallbackResponse(query: string, modelType?: string): string {
  const baseResponse = `## AI Assistant Response

I apologize, but I'm currently unable to process your query through our AI service. This could be due to:

- A temporary service disruption
- Configuration issues with the AI service
- Network connectivity problems

### Your Query
> ${query}

### Next Steps
- Try again in a few moments
- Check if you have data uploaded
- Try a simpler query
- Contact support if the issue persists

Our team has been notified of this issue and is working to resolve it as quickly as possible.`;

  if (modelType) {
    return `${baseResponse}

### Model Information
You were attempting to use the **${modelType.replace('_', ' ')}** model, which would typically:
${getModelDescription(modelType)}`;
  }

  return baseResponse;
}

function getModelDescription(modelType: string): string {
  switch (modelType) {
    case 'linear_regression':
      return `
- Find relationships between variables
- Predict values based on historical data
- Identify key drivers of outcomes
- Quantify the strength of relationships`;
    case 'clustering':
      return `
- Group similar data points together
- Identify natural segments in your data
- Discover hidden patterns
- Find common characteristics within groups`;
    case 'anomaly_detection':
      return `
- Identify outliers and unusual patterns
- Detect potential errors or special cases
- Find data points that deviate from norms
- Highlight areas that need investigation`;
    case 'time_series':
      return `
- Analyze trends over time
- Identify seasonal patterns
- Forecast future values
- Detect changes in patterns over time`;
    default:
      return `
- Analyze your data intelligently
- Provide insights and recommendations
- Answer questions about your data
- Help you make data-driven decisions`;
  }
}