
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
    const { query, data, type } = await req.json()
    
    const openaiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://queryhive.ai',
        'X-Title': 'QueryHive AI',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'system',
            content: `You are QueryHive AI, an expert data analyst. Help users analyze their data and generate insights. 
            
            When analyzing data:
            1. Provide clear, actionable insights
            2. Identify patterns, trends, and anomalies
            3. Suggest data visualizations when appropriate
            4. Be concise but thorough
            5. Use business-friendly language
            
            Data format: ${JSON.stringify(data?.slice(0, 3) || [])}`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenRouter API error: ${openaiResponse.statusText}`)
    }

    const result = await openaiResponse.json()
    const aiResponse = result.choices[0]?.message?.content

    // Store the query and response
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (user) {
      await supabaseClient
        .from('analytics_queries')
        .insert({
          user_id: user.id,
          query_text: query,
          query_type: type || 'natural_language',
          results: { response: aiResponse },
          execution_time_ms: Date.now(),
        })
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
