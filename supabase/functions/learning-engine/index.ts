
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

    const { action, feedback, context } = await req.json()

    // Get user from auth
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError) throw userError

    if (action === 'process_feedback') {
      // Analyze feedback to extract learning patterns
      const patterns = await extractLearningPatterns(feedback, user.id, supabase)
      
      return new Response(
        JSON.stringify({
          success: true,
          patterns_updated: patterns.length,
          message: 'Learning patterns updated successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'get_recommendations') {
      // Get user's learning patterns
      const { data: patterns, error: patternsError } = await supabase
        .from('learning_patterns')
        .select('*')
        .eq('user_id', user.id)
        .order('confidence_score', { ascending: false })
        .limit(10)

      if (patternsError) throw patternsError

      // Get user's feedback history
      const { data: feedbackHistory, error: feedbackError } = await supabase
        .from('user_feedback')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (feedbackError) throw feedbackError

      // Generate personalized recommendations
      const recommendations = generateRecommendations(patterns, feedbackHistory, context)

      return new Response(
        JSON.stringify({
          success: true,
          recommendations,
          personalization_score: calculatePersonalizationScore(patterns)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    console.error('Learning engine error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function extractLearningPatterns(feedback: any, userId: string, supabase: any) {
  const patterns = []

  // Pattern 1: Preferred analysis types
  if (feedback.context?.modelType) {
    const patternData = {
      model_type: feedback.context.modelType,
      rating: feedback.rating,
      feedback_type: feedback.feedback_type
    }

    // Update or create pattern
    const { error } = await supabase
      .from('learning_patterns')
      .upsert({
        user_id: userId,
        pattern_type: 'preferred_models',
        pattern_data: patternData,
        confidence_score: feedback.rating / 5.0,
        usage_count: 1,
      }, {
        onConflict: 'user_id,pattern_type',
        ignoreDuplicates: false
      })

    if (!error) patterns.push('preferred_models')
  }

  // Pattern 2: Query complexity preference
  if (feedback.context?.messageContent) {
    const complexity = analyzeQueryComplexity(feedback.context.messageContent)
    const patternData = {
      complexity_level: complexity,
      rating: feedback.rating,
      preferred: feedback.rating >= 4
    }

    const { error } = await supabase
      .from('learning_patterns')
      .upsert({
        user_id: userId,
        pattern_type: 'query_complexity',
        pattern_data: patternData,
        confidence_score: Math.abs(feedback.rating - 3) / 2.0, // Distance from neutral
        usage_count: 1,
      }, {
        onConflict: 'user_id,pattern_type',
        ignoreDuplicates: false
      })

    if (!error) patterns.push('query_complexity')
  }

  // Pattern 3: Response format preference
  const responseFormat = analyzeResponseFormat(feedback.context)
  if (responseFormat) {
    const patternData = {
      format_type: responseFormat,
      rating: feedback.rating,
      liked: feedback.feedback_type === 'positive'
    }

    const { error } = await supabase
      .from('learning_patterns')
      .upsert({
        user_id: userId,
        pattern_type: 'response_format',
        pattern_data: patternData,
        confidence_score: feedback.rating / 5.0,
        usage_count: 1,
      }, {
        onConflict: 'user_id,pattern_type',
        ignoreDuplicates: false
      })

    if (!error) patterns.push('response_format')
  }

  return patterns
}

function analyzeQueryComplexity(query: string): string {
  const words = query.split(' ').length
  const technicalTerms = ['correlation', 'regression', 'clustering', 'anomaly', 'prediction', 'analysis']
  const technicalCount = technicalTerms.filter(term => query.toLowerCase().includes(term)).length

  if (words > 20 || technicalCount > 2) return 'complex'
  if (words > 10 || technicalCount > 0) return 'medium'
  return 'simple'
}

function analyzeResponseFormat(context: any): string | null {
  if (!context?.messageContent) return null
  
  const content = context.messageContent.toLowerCase()
  if (content.includes('table') || content.includes('|')) return 'tabular'
  if (content.includes('chart') || content.includes('graph')) return 'visual'
  if (content.includes('step') || content.includes('1.') || content.includes('•')) return 'structured'
  if (content.length > 500) return 'detailed'
  return 'concise'
}

function generateRecommendations(patterns: any[], feedbackHistory: any[], context: any) {
  const recommendations = []

  // Analyze patterns to generate recommendations
  patterns.forEach(pattern => {
    switch (pattern.pattern_type) {
      case 'preferred_models':
        if (pattern.confidence_score > 0.7) {
          recommendations.push({
            type: 'model_suggestion',
            title: `Consider using ${pattern.pattern_data.model_type}`,
            description: `Based on your feedback, you tend to prefer ${pattern.pattern_data.model_type} analysis`,
            confidence: pattern.confidence_score
          })
        }
        break
      
      case 'query_complexity':
        if (pattern.pattern_data.preferred) {
          recommendations.push({
            type: 'query_style',
            title: `${pattern.pattern_data.complexity_level} queries work well for you`,
            description: `You seem to prefer ${pattern.pattern_data.complexity_level} complexity questions`,
            confidence: pattern.confidence_score
          })
        }
        break
      
      case 'response_format':
        if (pattern.pattern_data.liked) {
          recommendations.push({
            type: 'format_preference',
            title: `${pattern.pattern_data.format_type} format recommended`,
            description: `You've shown preference for ${pattern.pattern_data.format_type} response formats`,
            confidence: pattern.confidence_score
          })
        }
        break
    }
  })

  // Analyze feedback trends
  const recentPositiveFeedback = feedbackHistory
    .filter(f => f.feedback_type === 'positive')
    .slice(0, 10)

  if (recentPositiveFeedback.length > 5) {
    recommendations.push({
      type: 'engagement',
      title: 'High engagement detected',
      description: 'You seem very engaged with AI analytics. Consider exploring advanced features like knowledge graphs.',
      confidence: 0.8
    })
  }

  return recommendations.sort((a, b) => b.confidence - a.confidence)
}

function calculatePersonalizationScore(patterns: any[]): number {
  if (patterns.length === 0) return 0
  
  const avgConfidence = patterns.reduce((sum, p) => sum + p.confidence_score, 0) / patterns.length
  const patternDiversity = Math.min(patterns.length / 5, 1) // Max score when 5+ patterns
  
  return (avgConfidence * 0.7 + patternDiversity * 0.3)
}
