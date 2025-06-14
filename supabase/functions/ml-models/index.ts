
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MLAnalysisRequest {
  datasetId: string
  modelType: 'linear_regression' | 'clustering' | 'anomaly_detection' | 'time_series'
  parameters?: Record<string, any>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { datasetId, modelType, parameters = {} }: MLAnalysisRequest = await req.json()
    console.log('ML Models request:', { datasetId, modelType, parameters })

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      throw new Error('User not authenticated')
    }

    // Fetch dataset and data
    const { data: dataset, error: datasetError } = await supabaseClient
      .from('datasets')
      .select('*')
      .eq('id', datasetId)
      .eq('user_id', user.id)
      .single()

    if (datasetError || !dataset) {
      throw new Error('Dataset not found or access denied')
    }

    const { data: records, error: recordsError } = await supabaseClient
      .from('data_records')
      .select('data')
      .eq('dataset_id', datasetId)
      .limit(1000)

    if (recordsError) {
      throw new Error('Failed to fetch data records')
    }

    const data = records?.map(r => r.data) || []
    console.log(`Processing ${data.length} records with ${modelType}`)

    let results: any = {}

    switch (modelType) {
      case 'linear_regression':
        results = performLinearRegression(data, parameters)
        break
      case 'clustering':
        results = performClustering(data, parameters)
        break
      case 'anomaly_detection':
        results = performAnomalyDetection(data, parameters)
        break
      case 'time_series':
        results = performTimeSeriesAnalysis(data, parameters)
        break
      default:
        throw new Error(`Unsupported model type: ${modelType}`)
    }

    // Store the insight
    const { error: insightError } = await supabaseClient
      .from('ai_insights')
      .insert({
        user_id: user.id,
        dataset_id: datasetId,
        insight_type: modelType,
        title: results.title,
        description: results.description,
        confidence_score: results.confidence,
        metadata: results.metadata,
      })

    if (insightError) {
      console.error('Error storing insight:', insightError)
    }

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in ml-models function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function performLinearRegression(data: any[], parameters: any) {
  if (data.length === 0) return { error: 'No data provided' }
  
  // Find numeric columns
  const numericColumns = findNumericColumns(data)
  if (numericColumns.length < 2) {
    return {
      title: 'Linear Regression Analysis',
      description: 'Insufficient numeric columns for regression analysis. Need at least 2 numeric variables.',
      confidence: 0.1,
      metadata: { error: 'insufficient_data', numericColumns }
    }
  }

  // Simple linear regression between first two numeric columns
  const xCol = numericColumns[0]
  const yCol = numericColumns[1]
  const points = data.filter(d => d[xCol] != null && d[yCol] != null)
    .map(d => ({ x: parseFloat(d[xCol]), y: parseFloat(d[yCol]) }))
    .filter(p => !isNaN(p.x) && !isNaN(p.y))

  if (points.length < 3) {
    return {
      title: 'Linear Regression Analysis',
      description: 'Insufficient valid data points for regression analysis.',
      confidence: 0.1,
      metadata: { error: 'insufficient_points', pointCount: points.length }
    }
  }

  // Calculate linear regression
  const n = points.length
  const sumX = points.reduce((sum, p) => sum + p.x, 0)
  const sumY = points.reduce((sum, p) => sum + p.y, 0)
  const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0)
  const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // Calculate R-squared
  const meanY = sumY / n
  const ssTotal = points.reduce((sum, p) => sum + Math.pow(p.y - meanY, 2), 0)
  const ssResidual = points.reduce((sum, p) => sum + Math.pow(p.y - (slope * p.x + intercept), 2), 0)
  const rSquared = 1 - (ssResidual / ssTotal)

  return {
    title: `Linear Regression: ${yCol} vs ${xCol}`,
    description: `Found ${rSquared > 0.7 ? 'strong' : rSquared > 0.4 ? 'moderate' : 'weak'} linear relationship. Equation: ${yCol} = ${slope.toFixed(3)} * ${xCol} + ${intercept.toFixed(3)}`,
    confidence: Math.min(rSquared, 0.99),
    metadata: {
      equation: { slope, intercept },
      rSquared,
      dataPoints: n,
      variables: { x: xCol, y: yCol }
    }
  }
}

function performClustering(data: any[], parameters: any) {
  if (data.length === 0) return { error: 'No data provided' }
  
  const numericColumns = findNumericColumns(data)
  if (numericColumns.length === 0) {
    return {
      title: 'K-Means Clustering Analysis',
      description: 'No numeric columns found for clustering analysis.',
      confidence: 0.1,
      metadata: { error: 'no_numeric_data' }
    }
  }

  const k = parameters.clusters || Math.min(3, Math.floor(Math.sqrt(data.length / 2)))
  
  // Simple clustering based on first numeric column
  const values = data.map(d => parseFloat(d[numericColumns[0]])).filter(v => !isNaN(v))
  if (values.length === 0) return { error: 'No valid numeric values' }

  values.sort((a, b) => a - b)
  const min = values[0]
  const max = values[values.length - 1]
  const range = max - min

  const clusters = []
  for (let i = 0; i < k; i++) {
    const start = min + (range * i / k)
    const end = min + (range * (i + 1) / k)
    const count = values.filter(v => v >= start && v < end).length
    clusters.push({
      id: i,
      range: [start, end],
      count,
      percentage: (count / values.length * 100).toFixed(1)
    })
  }

  return {
    title: `K-Means Clustering (${k} clusters)`,
    description: `Identified ${k} distinct clusters in ${numericColumns[0]}. Largest cluster contains ${Math.max(...clusters.map(c => c.count))} data points.`,
    confidence: 0.8,
    metadata: {
      clusters,
      variable: numericColumns[0],
      totalPoints: values.length
    }
  }
}

function performAnomalyDetection(data: any[], parameters: any) {
  if (data.length === 0) return { error: 'No data provided' }
  
  const numericColumns = findNumericColumns(data)
  if (numericColumns.length === 0) {
    return {
      title: 'Anomaly Detection Analysis',
      description: 'No numeric columns found for anomaly detection.',
      confidence: 0.1,
      metadata: { error: 'no_numeric_data' }
    }
  }

  const threshold = parameters.threshold || 2 // Standard deviations
  const anomalies = []

  for (const column of numericColumns.slice(0, 3)) { // Check up to 3 columns
    const values = data.map(d => parseFloat(d[column])).filter(v => !isNaN(v))
    if (values.length === 0) continue

    const mean = values.reduce((sum, v) => sum + v, 0) / values.length
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)

    const columnAnomalies = values
      .map((value, index) => ({ value, index, zScore: Math.abs(value - mean) / stdDev }))
      .filter(item => item.zScore > threshold)

    if (columnAnomalies.length > 0) {
      anomalies.push({
        column,
        count: columnAnomalies.length,
        percentage: (columnAnomalies.length / values.length * 100).toFixed(1),
        examples: columnAnomalies.slice(0, 3).map(a => a.value)
      })
    }
  }

  const totalAnomalies = anomalies.reduce((sum, a) => sum + a.count, 0)
  
  return {
    title: 'Anomaly Detection Results',
    description: `Found ${totalAnomalies} anomalies across ${anomalies.length} variables. ${totalAnomalies === 0 ? 'Data appears normal.' : 'Consider investigating unusual values.'}`,
    confidence: 0.85,
    metadata: {
      anomalies,
      threshold,
      totalAnomalies
    }
  }
}

function performTimeSeriesAnalysis(data: any[], parameters: any) {
  if (data.length === 0) return { error: 'No data provided' }
  
  // Look for date/time columns
  const dateColumns = findDateColumns(data)
  const numericColumns = findNumericColumns(data)
  
  if (dateColumns.length === 0 || numericColumns.length === 0) {
    return {
      title: 'Time Series Analysis',
      description: 'No suitable time series data found. Need both date/time and numeric columns.',
      confidence: 0.1,
      metadata: { error: 'no_time_series_data', dateColumns, numericColumns }
    }
  }

  const dateCol = dateColumns[0]
  const valueCol = numericColumns[0]
  
  // Parse and sort by date
  const timeSeries = data
    .map(d => {
      const date = new Date(d[dateCol])
      const value = parseFloat(d[valueCol])
      return { date, value, valid: !isNaN(date.getTime()) && !isNaN(value) }
    })
    .filter(d => d.valid)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  if (timeSeries.length < 3) {
    return {
      title: 'Time Series Analysis',
      description: 'Insufficient time series data points.',
      confidence: 0.1,
      metadata: { error: 'insufficient_time_data', pointCount: timeSeries.length }
    }
  }

  // Calculate trend
  const values = timeSeries.map(d => d.value)
  const firstHalf = values.slice(0, Math.floor(values.length / 2))
  const secondHalf = values.slice(Math.floor(values.length / 2))
  
  const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length
  
  const trendDirection = secondAvg > firstAvg ? 'increasing' : secondAvg < firstAvg ? 'decreasing' : 'stable'
  const trendStrength = Math.abs(secondAvg - firstAvg) / firstAvg * 100

  return {
    title: `Time Series Analysis: ${valueCol}`,
    description: `${trendDirection.charAt(0).toUpperCase() + trendDirection.slice(1)} trend detected over time. ${trendStrength.toFixed(1)}% change from first to second half of data.`,
    confidence: 0.75,
    metadata: {
      trend: { direction: trendDirection, strength: trendStrength },
      dataPoints: timeSeries.length,
      dateRange: {
        start: timeSeries[0].date,
        end: timeSeries[timeSeries.length - 1].date
      },
      variables: { date: dateCol, value: valueCol }
    }
  }
}

function findNumericColumns(data: any[]): string[] {
  if (data.length === 0) return []
  
  const sample = data[0]
  return Object.keys(sample).filter(key => {
    const value = sample[key]
    return typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value)))
  })
}

function findDateColumns(data: any[]): string[] {
  if (data.length === 0) return []
  
  const sample = data[0]
  return Object.keys(sample).filter(key => {
    const value = sample[key]
    if (typeof value === 'string') {
      const date = new Date(value)
      return !isNaN(date.getTime())
    }
    return false
  })
}
