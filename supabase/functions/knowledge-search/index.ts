
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { query } = await req.json()

    // Get user from auth
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError) throw userError

    // Simple text search in knowledge base
    const searchTerms = query.toLowerCase().split(' ').filter((term: string) => term.length > 2)
    
    let searchResults = []

    // Search in knowledge base entries
    for (const term of searchTerms) {
      const { data: entries, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('user_id', user.id)
        .or(`title.ilike.%${term}%,content.ilike.%${term}%,tags.cs.{${term}}`)
        .order('relevance_score', { ascending: false })
        .limit(10)

      if (!error && entries) {
        searchResults.push(...entries)
      }
    }

    // Remove duplicates and rank by relevance
    const uniqueResults = Array.from(
      new Map(searchResults.map(item => [item.id, item])).values()
    )

    // Calculate relevance scores based on query
    const scoredResults = uniqueResults.map(entry => {
      let score = entry.relevance_score || 0
      
      // Boost score for exact matches in title
      if (entry.title.toLowerCase().includes(query.toLowerCase())) {
        score += 0.5
      }
      
      // Boost score for tag matches
      const queryWords = query.toLowerCase().split(' ')
      const matchingTags = entry.tags?.filter((tag: string) => 
        queryWords.some(word => tag.toLowerCase().includes(word))
      ).length || 0
      score += matchingTags * 0.2

      // Boost score for content relevance
      const contentMatches = searchTerms.filter(term => 
        entry.content.toLowerCase().includes(term)
      ).length
      score += (contentMatches / searchTerms.length) * 0.3

      return { ...entry, calculated_relevance: score }
    })

    // Sort by calculated relevance
    scoredResults.sort((a, b) => b.calculated_relevance - a.calculated_relevance)

    // Also search in AI insights for additional context
    const { data: insights, error: insightsError } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', user.id)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('confidence_score', { ascending: false })
      .limit(5)

    return new Response(
      JSON.stringify({
        success: true,
        knowledge_results: scoredResults.slice(0, 10),
        insight_results: insights || [],
        total_found: scoredResults.length,
        search_terms: searchTerms
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Knowledge search error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
