
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DataProcessingRequest {
  datasetId: string
  operations: {
    clean?: boolean
    validate?: boolean
    transform?: boolean
    analyze?: boolean
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { datasetId, operations }: DataProcessingRequest = await req.json()
    console.log('Data processing request:', { datasetId, operations })

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
      .select('*')
      .eq('dataset_id', datasetId)

    if (recordsError) {
      throw new Error('Failed to fetch data records')
    }

    const data = records?.map(r => r.data) || []
    console.log(`Processing ${data.length} records`)

    let processedData = [...data]
    const processingResults: any = {
      originalCount: data.length,
      processedCount: 0,
      operations: [],
      qualityMetrics: {},
      issues: []
    }

    // Data Cleaning
    if (operations.clean) {
      const cleaningResult = cleanData(processedData)
      processedData = cleaningResult.data
      processingResults.operations.push({
        type: 'cleaning',
        removedRows: cleaningResult.removedRows,
        cleanedFields: cleaningResult.cleanedFields
      })
    }

    // Data Validation
    if (operations.validate) {
      const validationResult = validateData(processedData)
      processingResults.qualityMetrics = validationResult.metrics
      processingResults.issues = validationResult.issues
      processingResults.operations.push({
        type: 'validation',
        issuesFound: validationResult.issues.length
      })
    }

    // Data Transformation
    if (operations.transform) {
      const transformResult = transformData(processedData)
      processedData = transformResult.data
      processingResults.operations.push({
        type: 'transformation',
        transformations: transformResult.transformations
      })
    }

    // Data Analysis
    if (operations.analyze) {
      const analysisResult = analyzeData(processedData)
      processingResults.analysis = analysisResult
      processingResults.operations.push({
        type: 'analysis',
        insights: analysisResult.insights.length
      })
    }

    processingResults.processedCount = processedData.length

    return new Response(
      JSON.stringify(processingResults),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in data-processing function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function cleanData(data: any[]) {
  if (data.length === 0) return { data: [], removedRows: 0, cleanedFields: [] }

  let removedRows = 0
  const cleanedFields: string[] = []
  const fieldsCleaned = new Set<string>()

  const cleanedData = data.filter(row => {
    // Remove rows that are completely empty
    const hasData = Object.values(row).some(value => 
      value !== null && value !== undefined && value !== ''
    )
    
    if (!hasData) {
      removedRows++
      return false
    }

    // Clean individual fields
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === 'string') {
        // Trim whitespace
        const trimmed = value.trim()
        if (trimmed !== value) {
          row[key] = trimmed
          if (!fieldsCleaned.has(key)) {
            cleanedFields.push(key)
            fieldsCleaned.add(key)
          }
        }

        // Convert common null representations
        if (['null', 'NULL', 'n/a', 'N/A', 'undefined', ''].includes(trimmed)) {
          row[key] = null
        }

        // Try to convert numeric strings
        if (trimmed && !isNaN(parseFloat(trimmed)) && isFinite(parseFloat(trimmed))) {
          row[key] = parseFloat(trimmed)
        }
      }
    }

    return true
  })

  return {
    data: cleanedData,
    removedRows,
    cleanedFields: [...cleanedFields]
  }
}

function validateData(data: any[]) {
  if (data.length === 0) {
    return {
      metrics: { completeness: 0, accuracy: 0, consistency: 0 },
      issues: ['No data to validate']
    }
  }

  const issues: string[] = []
  const columns = Object.keys(data[0])
  const metrics: any = {}

  // Calculate completeness
  let totalFields = 0
  let completeFields = 0
  
  data.forEach(row => {
    columns.forEach(col => {
      totalFields++
      if (row[col] !== null && row[col] !== undefined && row[col] !== '') {
        completeFields++
      }
    })
  })

  metrics.completeness = totalFields > 0 ? (completeFields / totalFields) * 100 : 0

  // Check for duplicates (basic check on first column)
  if (columns.length > 0) {
    const firstColValues = data.map(row => row[columns[0]])
    const uniqueValues = new Set(firstColValues)
    if (uniqueValues.size !== firstColValues.length) {
      issues.push(`Potential duplicates detected in ${columns[0]}`)
    }
  }

  // Check data type consistency
  columns.forEach(col => {
    const types = new Set()
    data.forEach(row => {
      if (row[col] !== null && row[col] !== undefined) {
        types.add(typeof row[col])
      }
    })
    
    if (types.size > 2) { // Allow null + one other type
      issues.push(`Inconsistent data types in column ${col}`)
    }
  })

  // Calculate accuracy (basic outlier detection)
  let accuracyScore = 100
  columns.forEach(col => {
    const numericValues = data
      .map(row => parseFloat(row[col]))
      .filter(val => !isNaN(val))
    
    if (numericValues.length > 3) {
      const mean = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length
      const variance = numericValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericValues.length
      const stdDev = Math.sqrt(variance)
      
      const outliers = numericValues.filter(val => Math.abs(val - mean) > 3 * stdDev)
      if (outliers.length > 0) {
        issues.push(`${outliers.length} potential outliers in ${col}`)
        accuracyScore -= 5
      }
    }
  })

  metrics.accuracy = Math.max(accuracyScore, 0)
  metrics.consistency = Math.max(100 - (issues.length * 10), 0)

  return { metrics, issues }
}

function transformData(data: any[]) {
  if (data.length === 0) return { data: [], transformations: [] }

  const transformations: string[] = []
  const transformedData = data.map(row => ({ ...row }))

  // Normalize numeric columns (simple min-max normalization for first numeric column found)
  const columns = Object.keys(data[0])
  const numericColumns = columns.filter(col => {
    return data.some(row => typeof row[col] === 'number' && !isNaN(row[col]))
  })

  if (numericColumns.length > 0) {
    const col = numericColumns[0]
    const values = data.map(row => row[col]).filter(val => typeof val === 'number' && !isNaN(val))
    
    if (values.length > 1) {
      const min = Math.min(...values)
      const max = Math.max(...values)
      const range = max - min
      
      if (range > 0) {
        transformedData.forEach(row => {
          if (typeof row[col] === 'number' && !isNaN(row[col])) {
            row[`${col}_normalized`] = (row[col] - min) / range
          }
        })
        transformations.push(`Normalized ${col}`)
      }
    }
  }

  // Create categorical encodings for string columns
  const stringColumns = columns.filter(col => {
    return data.some(row => typeof row[col] === 'string')
  })

  if (stringColumns.length > 0) {
    const col = stringColumns[0]
    const uniqueValues = [...new Set(data.map(row => row[col]).filter(val => typeof val === 'string'))]
    
    if (uniqueValues.length <= 10 && uniqueValues.length > 1) {
      const encoding = Object.fromEntries(uniqueValues.map((val, idx) => [val, idx]))
      
      transformedData.forEach(row => {
        if (typeof row[col] === 'string' && encoding[row[col]] !== undefined) {
          row[`${col}_encoded`] = encoding[row[col]]
        }
      })
      transformations.push(`Encoded ${col}`)
    }
  }

  return {
    data: transformedData,
    transformations
  }
}

function analyzeData(data: any[]) {
  if (data.length === 0) return { insights: [], summary: {} }

  const insights: string[] = []
  const columns = Object.keys(data[0])
  
  // Basic statistical summary
  const summary: any = {
    rowCount: data.length,
    columnCount: columns.length,
    numericColumns: [],
    categoricalColumns: []
  }

  columns.forEach(col => {
    const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined)
    const numericValues = values.filter(val => typeof val === 'number' || !isNaN(parseFloat(val)))
    
    if (numericValues.length > values.length * 0.7) {
      // Numeric column
      const nums = numericValues.map(val => parseFloat(val))
      summary.numericColumns.push({
        name: col,
        min: Math.min(...nums),
        max: Math.max(...nums),
        mean: nums.reduce((sum, val) => sum + val, 0) / nums.length,
        count: nums.length
      })
    } else {
      // Categorical column
      const uniqueValues = new Set(values)
      summary.categoricalColumns.push({
        name: col,
        uniqueCount: uniqueValues.size,
        topValues: [...uniqueValues].slice(0, 5),
        count: values.length
      })
    }
  })

  // Generate insights
  if (summary.numericColumns.length > 0) {
    insights.push(`Found ${summary.numericColumns.length} numeric columns ready for analysis`)
  }
  
  if (summary.categoricalColumns.length > 0) {
    insights.push(`Identified ${summary.categoricalColumns.length} categorical variables`)
  }

  const completeness = (data.length - data.filter(row => 
    Object.values(row).every(val => val === null || val === undefined || val === '')
  ).length) / data.length * 100

  insights.push(`Data completeness: ${completeness.toFixed(1)}%`)

  return { insights, summary }
}
