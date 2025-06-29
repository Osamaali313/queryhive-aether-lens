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

      // Get user's datasets for context
      const { data: datasets, error: datasetsError } = await supabase
        .from('datasets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (datasetsError) throw datasetsError

      // Get user's insights for context
      const { data: insights, error: insightsError } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (insightsError) throw insightsError

      // Generate personalized recommendations with enhanced context
      const recommendations = generateRecommendations(
        patterns, 
        feedbackHistory, 
        context,
        datasets,
        insights
      )

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

  // Pattern 4: Topic interest
  if (feedback.context?.messageContent) {
    const topics = extractTopics(feedback.context.messageContent)
    if (topics.length > 0) {
      const patternData = {
        topics,
        rating: feedback.rating,
        interested: feedback.rating >= 4
      }

      const { error } = await supabase
        .from('learning_patterns')
        .upsert({
          user_id: userId,
          pattern_type: 'topic_interests',
          pattern_data: patternData,
          confidence_score: feedback.rating / 5.0,
          usage_count: 1,
        }, {
          onConflict: 'user_id,pattern_type',
          ignoreDuplicates: false
        })

      if (!error) patterns.push('topic_interests')
    }
  }

  return patterns
}

function analyzeQueryComplexity(query: string): string {
  const words = query.split(' ').length
  const technicalTerms = ['correlation', 'regression', 'clustering', 'anomaly', 'prediction', 'analysis', 'segment', 'forecast', 'trend', 'outlier']
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

function extractTopics(content: string): string[] {
  const topics = []
  const topicKeywords = {
    'sales': ['sales', 'revenue', 'profit', 'customer', 'market'],
    'finance': ['finance', 'budget', 'cost', 'expense', 'investment'],
    'marketing': ['marketing', 'campaign', 'advertisement', 'promotion', 'brand'],
    'operations': ['operations', 'logistics', 'supply chain', 'inventory', 'production'],
    'hr': ['hr', 'employee', 'hiring', 'talent', 'workforce'],
    'product': ['product', 'feature', 'development', 'roadmap', 'release']
  }

  const contentLower = content.toLowerCase()
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => contentLower.includes(keyword))) {
      topics.push(topic)
    }
  }

  return topics
}

function generateRecommendations(
  patterns: any[], 
  feedbackHistory: any[], 
  context: any,
  datasets: any[] = [],
  insights: any[] = []
) {
  const recommendations = []

  // 1. Goal-oriented suggestions based on dataset characteristics
  if (datasets.length > 0) {
    const latestDataset = datasets[0]
    const columnsInfo = latestDataset.columns_info || []
    
    // Check for date columns to suggest time series analysis
    const hasDateColumns = columnsInfo.some((col: any) => col.type === 'date')
    if (hasDateColumns) {
      recommendations.push({
        type: 'dataset_based',
        title: `Analyze trends over time in "${latestDataset.name}"`,
        description: `I noticed your dataset contains date fields. Would you like me to perform a time series analysis to identify trends and patterns over time?`,
        confidence: 0.9
      })
    }
    
    // Check for numeric columns to suggest correlations
    const numericColumns = columnsInfo.filter((col: any) => col.type === 'number')
    if (numericColumns.length >= 2) {
      recommendations.push({
        type: 'dataset_based',
        title: `Find correlations between numeric variables in "${latestDataset.name}"`,
        description: `Your dataset has ${numericColumns.length} numeric columns. I can help you discover relationships between these variables using regression analysis.`,
        confidence: 0.85
      })
    }
    
    // Check for categorical columns to suggest clustering
    const categoricalColumns = columnsInfo.filter((col: any) => col.type === 'text')
    if (categoricalColumns.length > 0 && numericColumns.length > 0) {
      recommendations.push({
        type: 'dataset_based',
        title: `Segment your data in "${latestDataset.name}"`,
        description: `With your combination of categorical and numeric data, clustering analysis could reveal natural groupings and segments.`,
        confidence: 0.8
      })
    }
  }

  // 2. Workflow chaining suggestions based on recent insights
  if (insights.length > 0) {
    const latestInsight = insights[0]
    
    if (latestInsight.insight_type === 'linear_regression') {
      recommendations.push({
        type: 'workflow_chain',
        title: `Follow up on your regression analysis with predictions`,
        description: `Based on your recent regression analysis, would you like to make predictions using the model we've built?`,
        confidence: 0.85
      })
    }
    
    if (latestInsight.insight_type === 'clustering') {
      recommendations.push({
        type: 'workflow_chain',
        title: `Analyze characteristics of each cluster`,
        description: `Now that we've identified clusters in your data, let's examine what makes each group unique.`,
        confidence: 0.85
      })
    }
    
    if (latestInsight.insight_type === 'anomaly_detection') {
      recommendations.push({
        type: 'workflow_chain',
        title: `Investigate the root causes of detected anomalies`,
        description: `Let's dive deeper into the anomalies we found to understand what might be causing them.`,
        confidence: 0.85
      })
    }
  }

  // 3. Analyze patterns to generate personalized recommendations
  patterns.forEach(pattern => {
    switch (pattern.pattern_type) {
      case 'preferred_models':
        if (pattern.confidence_score > 0.7) {
          const modelType = pattern.pattern_data.model_type
          recommendations.push({
            type: 'model_suggestion',
            title: `Run a ${modelType.replace('_', ' ')} analysis on your latest data`,
            description: `Based on your preferences, you might find valuable insights using ${modelType.replace('_', ' ')} analysis.`,
            confidence: pattern.confidence_score
          })
        }
        break
      
      case 'query_complexity':
        if (pattern.pattern_data.preferred) {
          const complexityLevel = pattern.pattern_data.complexity_level
          let suggestionQuery = ""
          
          if (complexityLevel === 'complex') {
            suggestionQuery = "Perform a comprehensive analysis of the relationships between key variables and identify any statistically significant patterns or anomalies"
          } else if (complexityLevel === 'medium') {
            suggestionQuery = "What are the main trends and patterns in my data?"
          } else {
            suggestionQuery = "Summarize my data"
          }
          
          recommendations.push({
            type: 'query_style',
            title: suggestionQuery,
            description: `This ${complexityLevel} query matches your preferred interaction style.`,
            confidence: pattern.confidence_score
          })
        }
        break
      
      case 'response_format':
        if (pattern.pattern_data.liked) {
          const formatType = pattern.pattern_data.format_type
          recommendations.push({
            type: 'format_preference',
            title: `Show me a ${formatType} analysis of my latest data`,
            description: `I'll present the results in a ${formatType} format, which you seem to prefer.`,
            confidence: pattern.confidence_score
          })
        }
        break
        
      case 'topic_interests':
        if (pattern.pattern_data.interested && pattern.pattern_data.topics.length > 0) {
          const topic = pattern.pattern_data.topics[0]
          recommendations.push({
            type: 'topic_suggestion',
            title: `Analyze ${topic}-related metrics in your data`,
            description: `Based on your interests, I can help you explore ${topic} analytics in more depth.`,
            confidence: pattern.confidence_score
          })
        }
        break
    }
  })

  // 4. Context-aware suggestions based on current user activity
  if (context?.recentActivity === 'viewing_dashboard') {
    recommendations.push({
      type: 'contextual',
      title: "What insights would you like to add to your dashboard?",
      description: "I can help you create visualizations or metrics for your dashboard.",
      confidence: 0.75
    })
  }
  
  if (context?.recentActivity === 'viewing_ai_chat') {
    recommendations.push({
      type: 'contextual',
      title: "How can I help analyze your data today?",
      description: "I'm ready to assist with any data questions or analysis needs.",
      confidence: 0.75
    })
  }

  // 5. Proactive anomaly detection suggestion
  if (datasets.length > 0 && !recommendations.some(r => r.type === 'anomaly')) {
    recommendations.push({
      type: 'anomaly',
      title: `Check for unusual patterns in your data`,
      description: `I can automatically scan your data for anomalies and outliers that might require attention.`,
      confidence: 0.7
    })
  }

  // Sort by confidence and return top recommendations
  return recommendations
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)
}

function calculatePersonalizationScore(patterns: any[]): number {
  if (patterns.length === 0) return 0
  
  const avgConfidence = patterns.reduce((sum, p) => sum + p.confidence_score, 0) / patterns.length
  const patternDiversity = Math.min(patterns.length / 5, 1) // Max score when 5+ patterns
  
  return (avgConfidence * 0.7 + patternDiversity * 0.3)
}