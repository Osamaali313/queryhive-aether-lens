
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
    
    const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY')
    if (!openrouterApiKey) {
      console.error('OPENROUTER_API_KEY not found in environment')
      throw new Error('OpenRouter API key not configured')
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
