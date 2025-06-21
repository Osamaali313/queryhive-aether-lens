
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

    const { pipelineId, datasetId, action } = await req.json()

    // Get user from auth
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError) throw userError

    if (action === 'run') {
      // Get pipeline configuration
      const { data: pipeline, error: pipelineError } = await supabase
        .from('processing_pipelines')
        .select('*')
        .eq('id', pipelineId)
        .eq('user_id', user.id)
        .single()

      if (pipelineError) throw pipelineError

      // Update pipeline status to running
      await supabase
        .from('processing_pipelines')
        .update({ status: 'running' })
        .eq('id', pipelineId)

      // Get dataset data
      const { data: records, error: recordsError } = await supabase
        .from('data_records')
        .select('data')
        .eq('dataset_id', datasetId)
        .limit(10000)

      if (recordsError) throw recordsError

      // Process data according to pipeline configuration
      const processedData = await processDataWithPipeline(records, pipeline.pipeline_config)

      // Save processed results back to dataset or create new dataset
      const results = {
        original_count: records.length,
        processed_count: processedData.length,
        transformations_applied: pipeline.pipeline_config.steps?.length || 0,
        processing_time: Date.now(),
        data_quality_score: calculateDataQuality(processedData)
      }

      // Update pipeline status and last run
      await supabase
        .from('processing_pipelines')
        .update({ 
          status: 'active', 
          last_run: new Date().toISOString()
        })
        .eq('id', pipelineId)

      // Create insight about the processing
      await supabase
        .from('ai_insights')
        .insert({
          user_id: user.id,
          dataset_id: datasetId,
          insight_type: 'data_processing',
          title: `Data Pipeline: ${pipeline.name}`,
          description: `Processed ${results.original_count} records with ${results.transformations_applied} transformations. Data quality score: ${results.data_quality_score.toFixed(2)}`,
          confidence_score: 0.9,
          metadata: {
            pipeline_id: pipelineId,
            processing_results: results
          }
        })

      return new Response(
        JSON.stringify({
          success: true,
          results,
          message: 'Pipeline executed successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    console.error('Pipeline orchestrator error:', error)
    
    // Update pipeline status to error if possible
    if (req.body) {
      try {
        const { pipelineId } = await req.json()
        await supabase
          .from('processing_pipelines')
          .update({ status: 'error' })
          .eq('id', pipelineId)
      } catch (e) {
        console.error('Failed to update pipeline status:', e)
      }
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function processDataWithPipeline(records: any[], config: any) {
  let processedData = records.map(r => r.data)

  // Apply each step in the pipeline
  for (const step of config.steps || []) {
    switch (step.type) {
      case 'clean':
        processedData = cleanData(processedData, step.params)
        break
      case 'validate':
        processedData = validateData(processedData, step.params)
        break
      case 'transform':
        processedData = transformData(processedData, step.params)
        break
      case 'filter':
        processedData = filterData(processedData, step.params)
        break
      case 'enrich':
        processedData = await enrichData(processedData, step.params)
        break
    }
  }

  return processedData
}

function cleanData(data: any[], params: any) {
  return data.map(record => {
    const cleaned = { ...record }
    
    // Remove null/undefined values if specified
    if (params.remove_nulls) {
      Object.keys(cleaned).forEach(key => {
        if (cleaned[key] === null || cleaned[key] === undefined || cleaned[key] === '') {
          delete cleaned[key]
        }
      })
    }
    
    // Trim string values
    if (params.trim_strings) {
      Object.keys(cleaned).forEach(key => {
        if (typeof cleaned[key] === 'string') {
          cleaned[key] = cleaned[key].trim()
        }
      })
    }
    
    // Standardize formats
    if (params.standardize_formats) {
      Object.keys(cleaned).forEach(key => {
        if (typeof cleaned[key] === 'string') {
          // Email standardization
          if (cleaned[key].includes('@')) {
            cleaned[key] = cleaned[key].toLowerCase()
          }
          // Phone number standardization
          if (/^\+?[\d\s\-\(\)]+$/.test(cleaned[key])) {
            cleaned[key] = cleaned[key].replace(/\D/g, '')
          }
        }
      })
    }
    
    return cleaned
  })
}

function validateData(data: any[], params: any) {
  return data.filter(record => {
    // Check required fields
    if (params.required_fields) {
      for (const field of params.required_fields) {
        if (!record[field] || record[field] === '') {
          return false
        }
      }
    }
    
    // Validate data types
    if (params.type_validations) {
      for (const [field, expectedType] of Object.entries(params.type_validations)) {
        const value = record[field]
        if (value !== undefined) {
          switch (expectedType) {
            case 'number':
              if (isNaN(Number(value))) return false
              break
            case 'email':
              if (!value.includes('@')) return false
              break
            case 'date':
              if (isNaN(Date.parse(value))) return false
              break
          }
        }
      }
    }
    
    return true
  })
}

function transformData(data: any[], params: any) {
  return data.map(record => {
    const transformed = { ...record }
    
    // Apply field transformations
    if (params.field_transformations) {
      for (const [field, transformation] of Object.entries(params.field_transformations)) {
        if (transformed[field] !== undefined) {
          switch (transformation.type) {
            case 'uppercase':
              transformed[field] = String(transformed[field]).toUpperCase()
              break
            case 'lowercase':
              transformed[field] = String(transformed[field]).toLowerCase()
              break
            case 'number':
              transformed[field] = Number(transformed[field])
              break
            case 'date':
              transformed[field] = new Date(transformed[field]).toISOString()
              break
          }
        }
      }
    }
    
    // Create computed fields
    if (params.computed_fields) {
      for (const [newField, computation] of Object.entries(params.computed_fields)) {
        switch (computation.type) {
          case 'concat':
            transformed[newField] = computation.fields
              .map(f => transformed[f] || '')
              .join(computation.separator || ' ')
            break
          case 'math':
            const values = computation.fields.map(f => Number(transformed[f]) || 0)
            switch (computation.operation) {
              case 'sum':
                transformed[newField] = values.reduce((a, b) => a + b, 0)
                break
              case 'average':
                transformed[newField] = values.reduce((a, b) => a + b, 0) / values.length
                break
            }
            break
        }
      }
    }
    
    return transformed
  })
}

function filterData(data: any[], params: any) {
  return data.filter(record => {
    // Apply filters
    if (params.filters) {
      for (const filter of params.filters) {
        const value = record[filter.field]
        switch (filter.operator) {
          case 'equals':
            if (value !== filter.value) return false
            break
          case 'contains':
            if (!String(value).includes(filter.value)) return false
            break
          case 'greater_than':
            if (Number(value) <= Number(filter.value)) return false
            break
          case 'less_than':
            if (Number(value) >= Number(filter.value)) return false
            break
        }
      }
    }
    
    return true
  })
}

async function enrichData(data: any[], params: any) {
  // Simulate data enrichment (would integrate with external APIs)
  return data.map(record => {
    const enriched = { ...record }
    
    if (params.enrich_location && record.city) {
      enriched.enriched_location = {
        city: record.city,
        region: 'Unknown', // Would fetch from geo API
        country: 'Unknown'
      }
    }
    
    if (params.add_metadata) {
      enriched._metadata = {
        processed_at: new Date().toISOString(),
        enrichment_version: '1.0'
      }
    }
    
    return enriched
  })
}

function calculateDataQuality(data: any[]): number {
  if (data.length === 0) return 0
  
  let qualityScore = 0
  const factors = []
  
  // Completeness (no missing values)
  const totalFields = data.reduce((sum, record) => sum + Object.keys(record).length, 0)
  const filledFields = data.reduce((sum, record) => 
    sum + Object.values(record).filter(v => v !== null && v !== undefined && v !== '').length, 0
  )
  const completeness = filledFields / totalFields
  factors.push(completeness)
  
  // Consistency (similar field types across records)
  const fieldTypes = new Map()
  data.forEach(record => {
    Object.entries(record).forEach(([key, value]) => {
      if (!fieldTypes.has(key)) fieldTypes.set(key, new Set())
      fieldTypes.get(key).add(typeof value)
    })
  })
  
  const consistency = Array.from(fieldTypes.values())
    .reduce((sum, types) => sum + (types.size === 1 ? 1 : 0), 0) / fieldTypes.size
  factors.push(consistency)
  
  // Uniqueness (assuming records should be unique)
  const uniqueRecords = new Set(data.map(r => JSON.stringify(r))).size
  const uniqueness = uniqueRecords / data.length
  factors.push(uniqueness)
  
  // Average quality score
  qualityScore = factors.reduce((sum, factor) => sum + factor, 0) / factors.length
  
  return qualityScore
}
