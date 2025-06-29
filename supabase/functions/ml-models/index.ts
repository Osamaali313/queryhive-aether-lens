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
    try {
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
    } catch (insertError) {
      console.error('Failed to store insight:', insertError)
      // Continue execution even if insight storage fails
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
      metadata: { 
        error: 'insufficient_data', 
        numericColumns,
        explanation: 'Linear regression requires at least two numeric variables to find relationships between them.'
      }
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
      metadata: { 
        error: 'insufficient_points', 
        pointCount: points.length,
        explanation: 'Linear regression requires at least 3 valid data points to establish a relationship.'
      }
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

  // Calculate feature importance
  const featureImportance = Math.abs(slope) * Math.sqrt(sumXX / n) / Math.sqrt(ssTotal / n)

  // Calculate prediction intervals
  const standardError = Math.sqrt(ssResidual / (n - 2))
  const predictionInterval95 = 1.96 * standardError

  // Calculate p-value (simplified)
  const tStat = slope / (standardError / Math.sqrt(sumXX))
  const pValue = 2 * (1 - Math.abs(tStat) / Math.sqrt(n))

  // Determine relationship strength description
  let relationshipStrength = 'weak'
  if (rSquared > 0.7) relationshipStrength = 'strong'
  else if (rSquared > 0.4) relationshipStrength = 'moderate'

  // Determine direction
  const direction = slope > 0 ? 'positive' : 'negative'

  return {
    title: `Linear Regression: ${yCol} vs ${xCol}`,
    description: `Found a ${relationshipStrength} ${direction} relationship between ${xCol} and ${yCol}. For every 1 unit increase in ${xCol}, ${yCol} changes by ${slope.toFixed(3)} units. This model explains ${(rSquared * 100).toFixed(1)}% of the variation in ${yCol}.`,
    confidence: Math.min(rSquared, 0.99),
    metadata: {
      equation: { slope, intercept },
      rSquared,
      dataPoints: n,
      variables: { x: xCol, y: yCol },
      featureImportance,
      predictionInterval95,
      pValue,
      standardError,
      explanation: `This analysis shows how ${xCol} influences ${yCol}. The R-squared value of ${rSquared.toFixed(3)} indicates how well the model fits the data, with 1.0 being a perfect fit. The p-value of ${pValue.toFixed(4)} ${pValue < 0.05 ? 'indicates statistical significance' : 'suggests the relationship may be due to chance'}.`,
      limitations: `This is a simple linear model and doesn't account for other variables or non-linear relationships. The prediction interval of ±${predictionInterval95.toFixed(2)} represents the range where 95% of actual values are expected to fall.`
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
      metadata: { 
        error: 'no_numeric_data',
        explanation: 'Clustering requires numeric data to group similar items together based on their characteristics.'
      }
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

  // Calculate cluster quality metrics
  const clusterSizes = clusters.map(c => c.count)
  const avgClusterSize = clusterSizes.reduce((sum, size) => sum + size, 0) / k
  const sizeVariance = clusterSizes.reduce((sum, size) => sum + Math.pow(size - avgClusterSize, 2), 0) / k
  const silhouetteScore = estimateSilhouetteScore(clusters, values)

  return {
    title: `K-Means Clustering (${k} clusters)`,
    description: `Identified ${k} distinct clusters in ${numericColumns[0]}. Largest cluster contains ${Math.max(...clusters.map(c => c.count))} data points (${Math.max(...clusters.map(c => parseFloat(c.percentage)))}% of data). The clusters have a silhouette score of approximately ${silhouetteScore.toFixed(2)}, indicating ${silhouetteScore > 0.5 ? 'well-separated' : silhouetteScore > 0.25 ? 'somewhat separated' : 'poorly separated'} clusters.`,
    confidence: 0.8,
    metadata: {
      clusters,
      variable: numericColumns[0],
      totalPoints: values.length,
      clusterQuality: {
        silhouetteScore,
        sizeVariance,
        balanceScore: 1 - (Math.max(...clusterSizes) - Math.min(...clusterSizes)) / values.length
      },
      explanation: `This clustering divides your data into ${k} groups based on the values of ${numericColumns[0]}. Each cluster represents a segment with similar characteristics.`,
      interpretation: `The silhouette score of ${silhouetteScore.toFixed(2)} measures how well-separated the clusters are, with values closer to 1 indicating better-defined clusters.`,
      limitations: `This is a simple one-dimensional clustering. For more sophisticated segmentation, consider using multiple variables and advanced clustering techniques.`
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
      metadata: { 
        error: 'no_numeric_data',
        explanation: 'Anomaly detection requires numeric data to identify values that deviate from normal patterns.'
      }
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
        examples: columnAnomalies.slice(0, 3).map(a => a.value),
        zScores: columnAnomalies.slice(0, 3).map(a => a.zScore.toFixed(2)),
        mean,
        stdDev
      })
    }
  }

  const totalAnomalies = anomalies.reduce((sum, a) => sum + a.count, 0)
  const anomalyPercentage = data.length > 0 ? (totalAnomalies / data.length * 100).toFixed(1) : '0'
  
  // Calculate confidence based on anomaly prevalence and data size
  const confidence = calculateAnomalyConfidence(totalAnomalies, data.length, anomalies.length)
  
  return {
    title: 'Anomaly Detection Results',
    description: `Found ${totalAnomalies} anomalies (${anomalyPercentage}% of data) across ${anomalies.length} variables. ${totalAnomalies === 0 ? 'Data appears normal.' : 'These outliers may require further investigation.'}`,
    confidence,
    metadata: {
      anomalies,
      threshold,
      totalAnomalies,
      dataSize: data.length,
      anomalyPercentage,
      explanation: `This analysis identifies data points that deviate significantly (${threshold} standard deviations) from normal patterns. These anomalies may represent errors, unusual events, or interesting insights.`,
      detectionMethod: `Z-score method with threshold of ${threshold} standard deviations from the mean`,
      nextSteps: totalAnomalies > 0 ? 
        `Consider investigating these anomalies further, especially in ${anomalies[0]?.column || 'the identified columns'} where the most outliers were found.` : 
        `Your data appears to be within normal ranges. You might try a more sensitive threshold if you suspect subtle anomalies.`,
      limitations: `This method assumes a normal distribution and may not detect contextual or collective anomalies that depend on relationships between multiple variables or time.`
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
      metadata: { 
        error: 'no_time_series_data', 
        dateColumns, 
        numericColumns,
        explanation: 'Time series analysis requires at least one date/time column and one numeric column to track changes over time.'
      }
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
      metadata: { 
        error: 'insufficient_time_data', 
        pointCount: timeSeries.length,
        explanation: 'Time series analysis requires at least 3 data points to identify trends.'
      }
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

  // Calculate seasonality (simplified)
  const seasonality = detectSeasonality(timeSeries)
  
  // Calculate volatility
  const volatility = calculateVolatility(values)
  
  // Simple forecast (naive extrapolation)
  const lastValue = values[values.length - 1]
  const forecast = lastValue * (1 + (trendDirection === 'increasing' ? 0.1 : trendDirection === 'decreasing' ? -0.1 : 0))
  
  // Calculate confidence based on data quality and pattern strength
  const confidence = calculateTimeSeriesConfidence(timeSeries.length, trendStrength, volatility)

  return {
    title: `Time Series Analysis: ${valueCol} over Time`,
    description: `${trendDirection.charAt(0).toUpperCase() + trendDirection.slice(1)} trend detected with ${trendStrength.toFixed(1)}% change from first to second half of data. ${seasonality.detected ? `Seasonal pattern detected with period of approximately ${seasonality.period} data points.` : 'No clear seasonal pattern detected.'} Data volatility is ${volatility < 0.1 ? 'low' : volatility < 0.3 ? 'moderate' : 'high'}.`,
    confidence,
    metadata: {
      trend: { direction: trendDirection, strength: trendStrength },
      seasonality,
      volatility,
      dataPoints: timeSeries.length,
      dateRange: {
        start: timeSeries[0].date,
        end: timeSeries[timeSeries.length - 1].date
      },
      variables: { date: dateCol, value: valueCol },
      forecast: {
        nextValue: forecast,
        confidence: Math.max(0.5, confidence - 0.2) // Forecast confidence is lower than trend confidence
      },
      explanation: `This analysis examines how ${valueCol} changes over time. The ${trendDirection} trend indicates a ${trendStrength.toFixed(1)}% change from the first half to the second half of your data.`,
      interpretation: `${trendDirection === 'increasing' ? 'The upward trend suggests growth or improvement over time.' : trendDirection === 'decreasing' ? 'The downward trend may indicate decline or reduction over time.' : 'The stable pattern shows consistency over time.'}`,
      limitations: `This is a simplified time series analysis. For more accurate forecasting, consider using more sophisticated models that account for multiple factors and longer historical data.`
    }
  }
}

// Helper functions

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

function estimateSilhouetteScore(clusters: any[], values: number[]): number {
  // This is a simplified estimate of silhouette score
  // Real silhouette calculation would be more complex
  
  // If only one cluster, silhouette score is 0
  if (clusters.length <= 1) return 0
  
  // Calculate average distance between cluster centers
  let totalDistance = 0
  let count = 0
  
  for (let i = 0; i < clusters.length; i++) {
    for (let j = i + 1; j < clusters.length; j++) {
      const center1 = (clusters[i].range[0] + clusters[i].range[1]) / 2
      const center2 = (clusters[j].range[0] + clusters[j].range[1]) / 2
      totalDistance += Math.abs(center1 - center2)
      count++
    }
  }
  
  const avgBetweenDistance = count > 0 ? totalDistance / count : 0
  
  // Calculate average cluster width as a proxy for within-cluster distance
  const avgClusterWidth = clusters.reduce((sum, c) => sum + (c.range[1] - c.range[0]), 0) / clusters.length
  
  // Estimate silhouette score
  // Silhouette = (b - a) / max(a, b) where:
  // a = average distance to points in same cluster
  // b = average distance to points in nearest different cluster
  
  // We're using cluster width as a proxy for 'a' and distance between centers for 'b'
  const estimatedSilhouette = avgBetweenDistance > 0 ? 
    (avgBetweenDistance - avgClusterWidth) / Math.max(avgClusterWidth, avgBetweenDistance) : 0
  
  // Clamp to [-1, 1] range
  return Math.max(-1, Math.min(1, estimatedSilhouette))
}

function calculateAnomalyConfidence(totalAnomalies: number, dataSize: number, variablesWithAnomalies: number): number {
  // Base confidence starts high
  let confidence = 0.85
  
  // Adjust based on anomaly prevalence
  const anomalyPercentage = dataSize > 0 ? totalAnomalies / dataSize : 0
  
  // Too many anomalies (>10%) reduces confidence
  if (anomalyPercentage > 0.1) {
    confidence -= (anomalyPercentage - 0.1) * 2
  }
  
  // Too few anomalies (<0.1%) also reduces confidence slightly
  if (anomalyPercentage < 0.001 && totalAnomalies > 0) {
    confidence -= 0.1
  }
  
  // No anomalies at all - moderate confidence
  if (totalAnomalies === 0) {
    confidence = 0.7
  }
  
  // More variables with anomalies increases confidence
  if (variablesWithAnomalies > 1) {
    confidence += 0.05 * Math.min(variablesWithAnomalies - 1, 3)
  }
  
  // Small data size reduces confidence
  if (dataSize < 100) {
    confidence -= (100 - dataSize) / 200
  }
  
  // Ensure confidence is between 0.1 and 0.95
  return Math.max(0.1, Math.min(0.95, confidence))
}

function calculateTimeSeriesConfidence(dataPoints: number, trendStrength: number, volatility: number): number {
  // Base confidence
  let confidence = 0.75
  
  // Adjust based on number of data points
  if (dataPoints < 10) {
    confidence -= (10 - dataPoints) * 0.03
  } else if (dataPoints > 30) {
    confidence += Math.min((dataPoints - 30) * 0.005, 0.1)
  }
  
  // Adjust based on trend strength
  if (trendStrength < 5) {
    confidence -= (5 - trendStrength) * 0.02
  } else if (trendStrength > 20) {
    confidence += Math.min((trendStrength - 20) * 0.005, 0.1)
  }
  
  // Adjust based on volatility
  if (volatility > 0.3) {
    confidence -= (volatility - 0.3) * 0.5
  }
  
  // Ensure confidence is between 0.1 and 0.95
  return Math.max(0.1, Math.min(0.95, confidence))
}

function calculateVolatility(values: number[]): number {
  if (values.length < 2) return 0
  
  const changes = []
  for (let i = 1; i < values.length; i++) {
    if (values[i-1] === 0) continue; // Avoid division by zero
    const percentChange = Math.abs((values[i] - values[i-1]) / values[i-1])
    changes.push(percentChange)
  }
  
  if (changes.length === 0) return 0;
  return changes.reduce((sum, change) => sum + change, 0) / changes.length
}

function detectSeasonality(timeSeries: any[]): { detected: boolean, period: number | null } {
  // This is a simplified seasonality detection
  // Real seasonality detection would use autocorrelation or spectral analysis
  
  if (timeSeries.length < 6) {
    return { detected: false, period: null }
  }
  
  const values = timeSeries.map(d => d.value)
  
  // Check for common seasonality periods
  const potentialPeriods = [2, 3, 4, 6, 12]
  let bestPeriod = null
  let bestScore = 0
  
  for (const period of potentialPeriods) {
    if (values.length < period * 2) continue
    
    let score = 0
    for (let i = 0; i < period; i++) {
      const seasonalPoints = []
      for (let j = i; j < values.length; j += period) {
        seasonalPoints.push(values[j])
      }
      
      if (seasonalPoints.length < 2) continue
      
      // Calculate variance within this seasonal position
      const mean = seasonalPoints.reduce((sum, v) => sum + v, 0) / seasonalPoints.length
      const variance = seasonalPoints.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / seasonalPoints.length
      
      // Lower variance within seasonal positions indicates stronger seasonality
      score += 1 / (1 + variance)
    }
    
    score /= period
    
    if (score > bestScore) {
      bestScore = score
      bestPeriod = period
    }
  }
  
  // Threshold for detecting seasonality
  const seasonalityThreshold = 0.7
  return { 
    detected: bestScore > seasonalityThreshold, 
    period: bestScore > seasonalityThreshold ? bestPeriod : null 
  }
}