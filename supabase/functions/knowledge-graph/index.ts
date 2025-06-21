
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

    const { datasetId, action } = await req.json()

    if (action === 'build') {
      // Get dataset data
      const { data: records, error: recordsError } = await supabase
        .from('data_records')
        .select('data')
        .eq('dataset_id', datasetId)
        .limit(1000)

      if (recordsError) throw recordsError

      // Extract entities and relationships from data
      const entities = new Map()
      const relationships = []

      records.forEach((record, index) => {
        const data = record.data
        
        // Extract entities from each field
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === 'string' && value.length > 0) {
            const entityId = `${key}_${value}`
            if (!entities.has(entityId)) {
              entities.set(entityId, {
                entity_type: inferEntityType(key, value),
                entity_name: value,
                properties: { field: key, occurrences: 1 }
              })
            } else {
              entities.get(entityId).properties.occurrences++
            }
          }
        })

        // Create relationships between entities in the same record
        const recordEntities = Object.entries(data)
          .filter(([_, value]) => typeof value === 'string' && value.length > 0)
          .map(([key, value]) => `${key}_${value}`)

        for (let i = 0; i < recordEntities.length; i++) {
          for (let j = i + 1; j < recordEntities.length; j++) {
            relationships.push({
              source: recordEntities[i],
              target: recordEntities[j],
              type: 'co_occurs_in_record',
              weight: 1
            })
          }
        }
      })

      // Get user from auth
      const authHeader = req.headers.get('Authorization')!
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error: userError } = await supabase.auth.getUser(token)
      if (userError) throw userError

      // Save nodes to database
      const nodeInserts = Array.from(entities.entries()).map(([entityId, entity]) => ({
        user_id: user.id,
        dataset_id: datasetId,
        entity_type: entity.entity_type,
        entity_name: entity.entity_name,
        properties: entity.properties
      }))

      const { data: insertedNodes, error: nodesError } = await supabase
        .from('knowledge_nodes')
        .insert(nodeInserts)
        .select()

      if (nodesError) throw nodesError

      // Create mapping from entity names to node IDs
      const entityToNodeId = new Map()
      insertedNodes.forEach(node => {
        const entityKey = `${node.properties.field}_${node.entity_name}`
        entityToNodeId.set(entityKey, node.id)
      })

      // Aggregate relationships
      const relationshipCounts = new Map()
      relationships.forEach(rel => {
        const key = `${rel.source}:${rel.target}:${rel.type}`
        relationshipCounts.set(key, (relationshipCounts.get(key) || 0) + 1)
      })

      // Save edges to database
      const edgeInserts = Array.from(relationshipCounts.entries())
        .map(([key, count]) => {
          const [source, target, type] = key.split(':')
          const sourceNodeId = entityToNodeId.get(source)
          const targetNodeId = entityToNodeId.get(target)
          
          if (sourceNodeId && targetNodeId) {
            return {
              user_id: user.id,
              source_node_id: sourceNodeId,
              target_node_id: targetNodeId,
              relationship_type: type,
              weight: count / relationships.length, // Normalize weight
              properties: { occurrence_count: count }
            }
          }
          return null
        })
        .filter(edge => edge !== null)

      const { error: edgesError } = await supabase
        .from('knowledge_edges')
        .insert(edgeInserts)

      if (edgesError) throw edgesError

      return new Response(
        JSON.stringify({
          success: true,
          nodes_created: insertedNodes.length,
          edges_created: edgeInserts.length,
          message: 'Knowledge graph built successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    console.error('Knowledge graph error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function inferEntityType(fieldName: string, value: string): string {
  const field = fieldName.toLowerCase()
  
  if (field.includes('name') || field.includes('person') || field.includes('user')) {
    return 'person'
  }
  if (field.includes('company') || field.includes('organization') || field.includes('org')) {
    return 'organization'
  }
  if (field.includes('location') || field.includes('city') || field.includes('country')) {
    return 'location'
  }
  if (field.includes('event') || field.includes('activity')) {
    return 'event'
  }
  
  // Basic pattern matching
  if (value.match(/^[A-Z][a-z]+ [A-Z][a-z]+$/)) {
    return 'person' // Looks like a name
  }
  if (value.includes('@') && value.includes('.')) {
    return 'contact' // Email-like
  }
  
  return 'concept'
}
