// File path: supabase/functions/compliance-proxy/index.ts
// Replace the entire contents of this file with the code below

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Load configuration from environment
const getConfig = () => {
  try {
    const configJson = Deno.env.get('COMPLIANCE_CONFIG')
    return configJson ? JSON.parse(configJson) : {}
  } catch (error) {
    console.warn('Failed to parse COMPLIANCE_CONFIG:', error)
    return {}
  }
}

// Initialize Supabase client for database operations
const getSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Missing Supabase credentials for database operations')
    return null
  }
  
  return createClient(supabaseUrl, supabaseServiceKey)
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname
    
    // Handle different endpoints
    if (path.endsWith('/save-test')) {
      return await handleSaveTest(req)
    } else if (path.endsWith('/get-tests')) {
      return await handleGetTests(req)
    } else {
      return await handleAIChat(req)
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Handle AI chat requests (existing functionality + parameter support)
async function handleAIChat(req: Request) {
  const { 
    provider, 
    messages, 
    systemPrompt, 
    parameters = {}, // NEW: Extract parameters with default empty object
    saveTest = false, 
    testName, 
    category 
  } = await req.json()
  
  if (!provider || !messages) {
    return new Response(
      JSON.stringify({ error: 'Missing provider or messages' }), 
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Log parameters for debugging
  console.log(`${provider} request with parameters:`, parameters)

  const startTime = Date.now()
  let response

  if (provider === 'openai') {
    response = await callOpenAI(messages, systemPrompt, parameters) // NEW: Pass parameters
  } else if (provider === 'claude') {
    response = await callClaude(messages, systemPrompt, parameters) // NEW: Pass parameters
  } else {
    return new Response(
      JSON.stringify({ error: 'Invalid provider. Use "openai" or "claude"' }), 
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Add response time
  response.responseTime = Date.now() - startTime

  // Optionally save to database
  if (saveTest && messages.length > 0) {
    const userQuestion = messages[messages.length - 1].content
    try {
      await saveTestToDatabase({
        testName,
        category,
        userQuestion,
        systemPrompt,
        [provider === 'claude' ? 'claudeResponse' : 'openaiResponse']: response.content,
        [provider === 'claude' ? 'claudeResponseTime' : 'openaiResponseTime']: response.responseTime,
        [provider === 'claude' ? 'claudeModel' : 'openaiModel']: response.model
      })
    } catch (dbError) {
      console.error('Failed to save test:', dbError)
    }
  }

  return new Response(
    JSON.stringify(response), 
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Handle saving test results
async function handleSaveTest(req: Request) {
  try {
    const testData = await req.json()
    const result = await saveTestToDatabase(testData)
    
    return new Response(
      JSON.stringify({ success: true, test: result }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error saving test:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to save test' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Handle retrieving saved tests
async function handleGetTests(req: Request) {
  try {
    const url = new URL(req.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const category = url.searchParams.get('category')
    
    const supabase = getSupabaseClient()
    if (!supabase) {
      return new Response(
        JSON.stringify({ error: 'Database not configured' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let query = supabase
      .from('compliance_tests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ tests: data }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error retrieving tests:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve tests' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Save test data to database
async function saveTestToDatabase(testData: any) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Database not configured')
  }

  const { data, error } = await supabase
    .from('compliance_tests')
    .insert({
      test_name: testData.testName,
      category: testData.category || 'general',
      tags: testData.tags || [],
      user_question: testData.userQuestion,
      system_prompt: testData.systemPrompt,
      claude_response: testData.claudeResponse,
      claude_model: testData.claudeModel,
      claude_response_time_ms: testData.claudeResponseTime,
      claude_error: testData.claudeError,
      claude_error_type: testData.claudeErrorType,
      openai_response: testData.openaiResponse,
      openai_model: testData.openaiModel,
      openai_response_time_ms: testData.openaiResponseTime,
      openai_error: testData.openaiError,
      openai_error_type: testData.openaiErrorType,
      notes: testData.notes,
      rating: testData.rating,
      preferred_response: testData.preferredResponse
    })
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    throw error
  }

  return data
}

// UPDATED: OpenAI API call with parameter support
async function callOpenAI(messages: any[], systemPrompt?: string, parameters: any = {}) {
  const config = getConfig()
  const openaiKey = Deno.env.get('OPENAI_API_KEY')
  
  console.log('OpenAI Key exists:', !!openaiKey)
  console.log('OpenAI parameters received:', parameters)
  
  if (!openaiKey) {
    throw new Error('OpenAI API key not configured')
  }

  // Build messages array with system prompt
  const requestMessages = []
  if (systemPrompt) {
    requestMessages.push({ role: 'system', content: systemPrompt })
  }
  requestMessages.push(...messages)

  // Apply parameters with fallbacks to defaults
  const requestBody = {
    model: config.models?.openai || 'gpt-4o',
    messages: requestMessages,
    temperature: parameters.temperature !== undefined ? parameters.temperature : 0.7,
    max_tokens: parameters.max_tokens !== undefined ? parameters.max_tokens : 1024,
    top_p: parameters.top_p !== undefined ? parameters.top_p : 1.0,
    frequency_penalty: parameters.frequency_penalty !== undefined ? parameters.frequency_penalty : 0.0,
    presence_penalty: parameters.presence_penalty !== undefined ? parameters.presence_penalty : 0.0
  }

  console.log('OpenAI request body parameters:', {
    temperature: requestBody.temperature,
    max_tokens: requestBody.max_tokens,
    top_p: requestBody.top_p
  })

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('OpenAI API error:', response.status, errorText)
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  
  return {
    content: data.choices[0]?.message?.content || 'No response',
    model: data.model,
    usage: data.usage
  }
}

// UPDATED: Claude API call with parameter support  
async function callClaude(messages: any[], systemPrompt?: string, parameters: any = {}) {
  const config = getConfig()
  const claudeKey = Deno.env.get('ANTHROPIC_API_KEY')
  
  console.log('Claude Key exists:', !!claudeKey)
  console.log('Claude parameters received:', parameters)
  
  if (!claudeKey) {
    throw new Error('Anthropic API key not configured')
  }

  // Claude expects messages without system message in array
  const requestMessages = messages.filter((msg: any) => msg.role !== 'system')

  // Apply parameters with fallbacks to defaults
  const requestBody = {
    model: config.models?.claude || 'claude-3-5-sonnet-20241022',
    max_tokens: parameters.max_tokens !== undefined ? parameters.max_tokens : 1024,
    temperature: parameters.temperature !== undefined ? parameters.temperature : 0.7,
    top_p: parameters.top_p !== undefined ? parameters.top_p : 1.0,
    top_k: parameters.top_k !== undefined ? parameters.top_k : undefined, // Only include if specified
    messages: requestMessages
  }

  // Add system prompt if provided
  if (systemPrompt) {
    requestBody.system = systemPrompt
  }

  // Remove undefined values
  Object.keys(requestBody).forEach(key => {
    if (requestBody[key] === undefined) {
      delete requestBody[key]
    }
  })

  console.log('Claude request body parameters:', {
    temperature: requestBody.temperature,
    max_tokens: requestBody.max_tokens,
    top_p: requestBody.top_p,
    top_k: requestBody.top_k
  })

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': claudeKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Claude API error:', response.status, errorText)
    throw new Error(`Claude API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  
  return {
    content: data.content?.[0]?.text || 'No response',
    model: data.model,
    usage: data.usage
  }
}