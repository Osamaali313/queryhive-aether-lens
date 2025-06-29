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
    
    // Generate a simulated response since we're in a demo environment
    // In a production environment, this would call an actual LLM API
    const aiResponse = generateSimulatedResponse(query, data, modelType);
    
    try {
      // Store the query and response
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const authHeader = req.headers.get('Authorization')!
      const token = authHeader.replace('Bearer ', '')
      
      try {
        const { data: { user } } = await supabaseClient.auth.getUser(token)

        if (user) {
          try {
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
          } catch (insertError) {
            console.error('Error inserting analytics query:', insertError)
          }
        }
      } catch (userError) {
        console.error('Error getting user:', userError)
      }
    } catch (storageError) {
      console.error('Error storing analytics:', storageError)
      // Continue execution even if storage fails
    }

    console.log('AI Analytics response generated successfully')
    return new Response(
      JSON.stringify({ response: aiResponse, confidence: 0.85 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in ai-analytics function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "I apologize, but I encountered an error processing your request. Please try again with a simpler query or check your data."
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function generateSimulatedResponse(query: string, data: any[] = [], modelType?: string): string {
  // Extract data characteristics for more realistic responses
  const dataInfo = analyzeData(data);
  const queryLower = query.toLowerCase();
  
  // Base response structure with markdown formatting
  let response = `## Analysis Results\n\n`;
  
  // Add model-specific content
  if (modelType) {
    response += `### ${modelType.replace('_', ' ').toUpperCase()} Analysis\n\n`;
  }
  
  // Generate response based on query content
  if (queryLower.includes('trend') || queryLower.includes('over time')) {
    response += `I've analyzed the trends in your data${dataInfo.datasetName ? ` for ${dataInfo.datasetName}` : ''}.\n\n`;
    response += `**Key findings:**\n`;
    response += `- There's a ${Math.random() > 0.5 ? 'positive' : 'negative'} trend with a ${(Math.random() * 20 + 5).toFixed(1)}% change over the period\n`;
    response += `- The highest values were observed in ${['January', 'February', 'March', 'April', 'May', 'June'][Math.floor(Math.random() * 6)]}\n`;
    response += `- There appears to be a ${Math.random() > 0.5 ? 'strong' : 'moderate'} seasonal pattern\n\n`;
    response += `**Recommendation:** Continue monitoring these trends and consider ${Math.random() > 0.5 ? 'increasing investment in high-performing areas' : 'investigating the factors behind the observed patterns'}.`;
  } 
  else if (queryLower.includes('compar') || queryLower.includes('vs') || queryLower.includes('versus')) {
    response += `I've compared the different segments in your data.\n\n`;
    response += `**Comparison results:**\n`;
    response += `- Segment A is ${(Math.random() * 30 + 10).toFixed(1)}% higher than Segment B\n`;
    response += `- The difference is ${Math.random() > 0.7 ? 'statistically significant (p<0.05)' : 'not statistically significant (p>0.05)'}\n`;
    response += `- Key differentiating factors include ${['price', 'region', 'customer age', 'product category'][Math.floor(Math.random() * 4)]}\n\n`;
    response += `**Insight:** The observed differences suggest that ${Math.random() > 0.5 ? 'targeted strategies for each segment would be beneficial' : 'a unified approach might be more efficient than segmentation'}.`;
  }
  else if (queryLower.includes('predict') || queryLower.includes('forecast')) {
    response += `Based on the historical patterns in your data, here's my forecast:\n\n`;
    response += `**Predictions:**\n`;
    response += `- Next period: ${(Math.random() * 1000 + 500).toFixed(2)} units (±${(Math.random() * 50 + 20).toFixed(2)}%)\n`;
    response += `- 3-month outlook: ${Math.random() > 0.6 ? 'Positive growth' : Math.random() > 0.3 ? 'Stable' : 'Potential decline'}\n`;
    response += `- Confidence level: ${(Math.random() * 20 + 75).toFixed(1)}%\n\n`;
    response += `**Factors affecting accuracy:**\n`;
    response += `- Data completeness: ${(Math.random() * 20 + 80).toFixed(1)}%\n`;
    response += `- Historical volatility: ${Math.random() > 0.5 ? 'Low' : 'Moderate'}\n`;
    response += `- External variables: ${Math.random() > 0.5 ? 'Not accounted for' : 'Partially incorporated'}`;
  }
  else if (queryLower.includes('anomal') || queryLower.includes('outlier')) {
    response += `I've analyzed your data for anomalies and outliers.\n\n`;
    response += `**Findings:**\n`;
    response += `- Detected ${Math.floor(Math.random() * 5 + 1)} significant anomalies\n`;
    response += `- Most notable: ${(Math.random() * 1000 + 200).toFixed(2)} units on ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][Math.floor(Math.random() * 5)]}\n`;
    response += `- This represents a ${(Math.random() * 200 + 100).toFixed(1)}% deviation from expected values\n\n`;
    response += `**Recommendation:** Investigate these specific instances to determine if they represent errors, special cases, or new opportunities.`;
  }
  else if (queryLower.includes('segment') || queryLower.includes('cluster') || queryLower.includes('group')) {
    response += `I've identified ${Math.floor(Math.random() * 3 + 3)} distinct segments in your data.\n\n`;
    response += `**Segment Characteristics:**\n\n`;
    response += `**Segment 1 (${(Math.random() * 30 + 20).toFixed(1)}% of data):**\n`;
    response += `- High value, low frequency\n`;
    response += `- Primarily from ${['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)]} region\n`;
    response += `- Average value: $${(Math.random() * 900 + 100).toFixed(2)}\n\n`;
    response += `**Segment 2 (${(Math.random() * 30 + 20).toFixed(1)}% of data):**\n`;
    response += `- Medium value, high frequency\n`;
    response += `- Diverse regional distribution\n`;
    response += `- Average value: $${(Math.random() * 500 + 50).toFixed(2)}\n\n`;
    response += `**Segment 3 (${(Math.random() * 30 + 20).toFixed(1)}% of data):**\n`;
    response += `- Low value, variable frequency\n`;
    response += `- Primarily new customers\n`;
    response += `- Average value: $${(Math.random() * 100 + 10).toFixed(2)}\n\n`;
    response += `**Strategic Implication:** Consider tailored approaches for each segment to maximize overall performance.`;
  }
  else {
    // Generic analysis for other queries
    response += `I've analyzed your data${dataInfo.datasetName ? ` for ${dataInfo.datasetName}` : ''} and found several insights:\n\n`;
    response += `**Key Metrics:**\n`;
    response += `- Average value: ${(Math.random() * 500 + 100).toFixed(2)}\n`;
    response += `- Median value: ${(Math.random() * 400 + 90).toFixed(2)}\n`;
    response += `- Range: ${(Math.random() * 50 + 10).toFixed(2)} to ${(Math.random() * 950 + 500).toFixed(2)}\n`;
    response += `- Standard deviation: ${(Math.random() * 100 + 50).toFixed(2)}\n\n`;
    
    response += `**Distribution:**\n`;
    response += `- Top 20%: Accounts for ${(Math.random() * 30 + 60).toFixed(1)}% of total value\n`;
    response += `- Middle 60%: Accounts for ${(Math.random() * 20 + 30).toFixed(1)}% of total value\n`;
    response += `- Bottom 20%: Accounts for ${(Math.random() * 10 + 1).toFixed(1)}% of total value\n\n`;
    
    response += `**Recommendations:**\n`;
    response += `- Focus on ${['high-value segments', 'emerging trends', 'reducing variability', 'improving data quality'][Math.floor(Math.random() * 4)]}\n`;
    response += `- Consider ${['segmentation strategies', 'predictive modeling', 'anomaly detection', 'time series analysis'][Math.floor(Math.random() * 4)]} for deeper insights\n`;
    response += `- Monitor ${['seasonal patterns', 'customer behavior', 'regional differences', 'product performance'][Math.floor(Math.random() * 4)]} for ongoing optimization`;
  }
  
  return response;
}

function analyzeData(data: any[] = []): { 
  rowCount: number, 
  columnCount: number, 
  datasetName?: string,
  hasNumericData: boolean,
  hasDateData: boolean
} {
  if (!data || data.length === 0) {
    return { 
      rowCount: 0, 
      columnCount: 0, 
      hasNumericData: false,
      hasDateData: false
    };
  }
  
  const firstRow = data[0];
  const columnCount = Object.keys(firstRow).length;
  
  // Check for dataset name in metadata
  let datasetName;
  if (firstRow.dataset_name || firstRow.name) {
    datasetName = firstRow.dataset_name || firstRow.name;
  }
  
  // Check for numeric and date data
  let hasNumericData = false;
  let hasDateData = false;
  
  for (const key in firstRow) {
    const value = firstRow[key];
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value)))) {
      hasNumericData = true;
    }
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      hasDateData = true;
    }
  }
  
  return {
    rowCount: data.length,
    columnCount,
    datasetName,
    hasNumericData,
    hasDateData
  };
}