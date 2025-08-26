// File path: testing/llm-comparison/extracted-functions.js
// Extracted JavaScript functions from index.html
// All onclick handlers in HTML will call these functions

console.log('🔧 Extracted functions loaded');

// Model definitions - can be expanded easily
const MODEL_CATALOG = {
  anthropic: {
    name: "Anthropic",
    models: [
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", description: "Latest and most capable" },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", description: "Fast and efficient" },
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus", description: "Most powerful reasoning" },
      { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet", description: "Balanced performance" },
      { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku", description: "Speed optimized" }
    ]
  },
  openai: {
    name: "OpenAI", 
    models: [
      { id: "gpt-4o", name: "GPT-4o", description: "Latest multimodal model" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Fast and cost-effective" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo", description: "Enhanced GPT-4" },
      { id: "gpt-4", name: "GPT-4", description: "Original GPT-4" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Fast and efficient" }
    ]
  }
};

// Current model selection state
let currentModels = {
  left: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' },
  right: { provider: 'openai', model: 'gpt-4o' }
};

// Update model options when provider changes
function updateModelOptions(side) {
  const providerSelect = document.getElementById(`${side}-provider`);
  const modelSelect = document.getElementById(`${side}-model`);
  const provider = providerSelect.value;
  
  // Clear existing options
  modelSelect.innerHTML = '';
  
  // Add new options
  MODEL_CATALOG[provider].models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.id;
    option.textContent = `${model.name} - ${model.description}`;
    modelSelect.appendChild(option);
  });
  
  // Update current selection
  currentModels[side].provider = provider;
  currentModels[side].model = modelSelect.value;
  
  console.log(`Updated ${side} panel:`, currentModels[side]);
}

// Set predefined model combinations
function setModelPreset(preset) {
  switch(preset) {
    case 'claude-vs-gpt':
      document.getElementById('left-provider').value = 'anthropic';
      document.getElementById('right-provider').value = 'openai';
      updateModelOptions('left');
      updateModelOptions('right');
      document.getElementById('left-model').value = 'claude-3-5-sonnet-20241022';
      document.getElementById('right-model').value = 'gpt-4o';
      break;
      
    case 'claude-vs-claude':
      document.getElementById('left-provider').value = 'anthropic';
      document.getElementById('right-provider').value = 'anthropic';
      updateModelOptions('left');
      updateModelOptions('right');
      document.getElementById('left-model').value = 'claude-3-5-sonnet-20241022';
      document.getElementById('right-model').value = 'claude-3-opus-20240229';
      break;
      
    case 'gpt-vs-gpt':
      document.getElementById('left-provider').value = 'openai';
      document.getElementById('right-provider').value = 'openai';
      updateModelOptions('left');
      updateModelOptions('right');
      document.getElementById('left-model').value = 'gpt-4o';
      document.getElementById('right-model').value = 'gpt-4-turbo';
      break;
  }
  
  // Apply the selection
  updateInterfaceFromSelection();
}

// Update the interface based on current selection
function updateInterfaceFromSelection() {
  // Get current selections
  const leftProvider = document.getElementById('left-provider').value;
  const leftModel = document.getElementById('left-model').value;
  const rightProvider = document.getElementById('right-provider').value;
  const rightModel = document.getElementById('right-model').value;
  
  // Update current models state
  currentModels.left = { provider: leftProvider, model: leftModel };
  currentModels.right = { provider: rightProvider, model: rightModel };
  
  // Update response panel headers
  updateResponsePanelHeaders();
  
  // Update parameter controls
  updateParameterControls();
  
  console.log('✅ Interface updated with selected models:', currentModels);
}

// Update response panel headers with selected models
function updateResponsePanelHeaders() {
  const panels = document.querySelectorAll('#results .panel h2');
  
  if (panels.length >= 2) {
    // Left panel
    const leftModelInfo = getModelInfo(currentModels.left.provider, currentModels.left.model);
    panels[0].innerHTML = `${leftModelInfo.name} Response <div style="font-size: 0.8em; color: #666; font-weight: normal;">${leftModelInfo.description}</div>`;
    panels[0].setAttribute('data-provider', currentModels.left.provider);
    panels[0].setAttribute('data-model', currentModels.left.model);
    
    // Right panel
    const rightModelInfo = getModelInfo(currentModels.right.provider, currentModels.right.model);
    panels[1].innerHTML = `${rightModelInfo.name} Response <div style="font-size: 0.8em; color: #666; font-weight: normal;">${rightModelInfo.description}</div>`;
    panels[1].setAttribute('data-provider', currentModels.right.provider);
    panels[1].setAttribute('data-model', currentModels.right.model);
  }
}

// Update parameter controls for selected models
function updateParameterControls() {
  const paramControls = document.getElementById('param-controls');
  if (!paramControls) return;
  
  const leftModelInfo = getModelInfo(currentModels.left.provider, currentModels.left.model);
  const rightModelInfo = getModelInfo(currentModels.right.provider, currentModels.right.model);
  
  paramControls.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2em; margin: 0.5em 0; align-items: start;">
      <!-- Left Model Parameters -->
      <div style="border: 1px solid #ddd; padding: 1em; border-radius: 4px; background: #f9f9f9;">
        <h4 style="margin: 0 0 0.5em 0; color: #333;">${leftModelInfo.name} Parameters</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5em;">
          <div>
            <label style="font-weight: bold; margin-bottom: 0.25em; display: block;">Temperature:</label>
            <input type="number" id="left-temp" min="0" max="1" step="0.1" value="0.7" 
                   style="width: 100%; padding: 0.3em; border: 1px solid #ccc; border-radius: 3px;">
          </div>
          <div>
            <label style="font-weight: bold; margin-bottom: 0.25em; display: block;">Max Tokens:</label>
            <input type="number" id="left-tokens" min="100" max="4000" value="1024" 
                   style="width: 100%; padding: 0.3em; border: 1px solid #ccc; border-radius: 3px;">
          </div>
        </div>
      </div>
      
      <!-- Right Model Parameters -->
      <div style="border: 1px solid #ddd; padding: 1em; border-radius: 4px; background: #f9f9f9;">
        <h4 style="margin: 0 0 0.5em 0; color: #333;">${rightModelInfo.name} Parameters</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5em;">
          <div>
            <label style="font-weight: bold; margin-bottom: 0.25em; display: block;">Temperature:</label>
            <input type="number" id="right-temp" min="0" max="1" step="0.1" value="0.7" 
                   style="width: 100%; padding: 0.3em; border: 1px solid #ccc; border-radius: 3px;">
          </div>
          <div>
            <label style="font-weight: bold; margin-bottom: 0.25em; display: block;">Max Tokens:</label>
            <input type="number" id="right-tokens" min="100" max="4000" value="1024" 
                   style="width: 100%; padding: 0.3em; border: 1px solid #ccc; border-radius: 3px;">
          </div>
        </div>
      </div>
    </div>
    
    <!-- Global Controls -->
    <div style="text-align: center; margin-top: 1em; padding-top: 1em; border-top: 1px solid #ddd;">
      <button type="button" onclick="resetAllParams()" style="margin-right: 1em;">Reset All</button>
      <button type="button" onclick="copyParamsLeftToRight()">Copy Left → Right</button>
      <button type="button" onclick="copyParamsRightToLeft()">Copy Right → Left</button>
    </div>
  `;
}

// Get model information from catalog
function getModelInfo(provider, modelId) {
  const catalog = MODEL_CATALOG[provider];
  if (!catalog) return { name: modelId, description: 'Unknown model' };
  
  const model = catalog.models.find(m => m.id === modelId);
  return model || { name: modelId, description: 'Unknown model' };
}

// Updated parameter functions
function resetAllParams() {
  const inputs = document.querySelectorAll('#param-controls input[type="number"]');
  inputs.forEach(input => {
    if (input.id.includes('temp')) {
      input.value = '0.7';
    } else if (input.id.includes('tokens')) {
      input.value = '1024';
    }
  });
  console.log('All parameters reset to defaults');
}

function copyParamsLeftToRight() {
  const leftTemp = document.getElementById('left-temp');
  const leftTokens = document.getElementById('left-tokens');
  const rightTemp = document.getElementById('right-temp');
  const rightTokens = document.getElementById('right-tokens');
  
  if (leftTemp && rightTemp) rightTemp.value = leftTemp.value;
  if (leftTokens && rightTokens) rightTokens.value = leftTokens.value;
  console.log('Parameters copied from left to right');
}

function copyParamsRightToLeft() {
  const leftTemp = document.getElementById('left-temp');
  const leftTokens = document.getElementById('left-tokens');
  const rightTemp = document.getElementById('right-temp');
  const rightTokens = document.getElementById('right-tokens');
  
  if (leftTemp && rightTemp) leftTemp.value = rightTemp.value;
  if (leftTokens && rightTokens) leftTokens.value = rightTokens.value;
  console.log('Parameters copied from right to left');
}

// Updated getTestParams function to work with GUI selection
function getTestParams() {
  const leftTemp = document.getElementById('left-temp');
  const leftTokens = document.getElementById('left-tokens');
  const rightTemp = document.getElementById('right-temp');
  const rightTokens = document.getElementById('right-tokens');
  
  return {
    left_model: currentModels.left.model,
    left_provider: currentModels.left.provider,
    left_temperature: leftTemp ? parseFloat(leftTemp.value) : 0.7,
    left_max_tokens: leftTokens ? parseInt(leftTokens.value) : 1024,
    
    right_model: currentModels.right.model,
    right_provider: currentModels.right.provider,
    right_temperature: rightTemp ? parseFloat(rightTemp.value) : 0.7,
    right_max_tokens: rightTokens ? parseInt(rightTokens.value) : 1024,
    
    // Backwards compatibility
    claude_temperature: currentModels.left.provider === 'anthropic' ? 
      (leftTemp ? parseFloat(leftTemp.value) : 0.7) : 
      (rightTemp ? parseFloat(rightTemp.value) : 0.7),
    openai_temperature: currentModels.left.provider === 'openai' ? 
      (leftTemp ? parseFloat(leftTemp.value) : 0.7) : 
      (rightTemp ? parseFloat(rightTemp.value) : 0.7),
    max_tokens: leftTokens ? parseInt(leftTokens.value) : 1024
  };
}

// Initialize GUI on page load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize model options
  updateModelOptions('left');
  updateModelOptions('right');
  
  // Set default selection
  updateInterfaceFromSelection();
  
  console.log('✅ Model selection GUI initialized');
});
    let supabaseUrl = localStorage.getItem('supabaseUrl') || '';
    let messageHistory = [];
    let currentTestResults = null; // Store current test results for saving

    // Parameter testing functions
    function toggleParams() {
      const controls = document.getElementById('param-controls');
      const button = event.target;
      
      if (controls.style.display === 'none' || controls.style.display === '') {
        controls.style.display = 'block';
        button.textContent = '🔧 Hide Parameters';
      } else {
        controls.style.display = 'none';
        button.textContent = '🔧 Parameter Testing';
      }
    }

    function resetParams() {
      document.getElementById('openai-temp').value = '0.7';
      document.getElementById('claude-temp').value = '0.7';
      document.getElementById('max-tokens').value = '1024';
      console.log('Parameters reset to defaults');
    }

    function getTestParams() {
      const openaiTemp = document.getElementById('openai-temp');
      const claudeTemp = document.getElementById('claude-temp');
      const maxTokens = document.getElementById('max-tokens');
      
      return {
        openai_temperature: openaiTemp ? parseFloat(openaiTemp.value) : 0.7,
        claude_temperature: claudeTemp ? parseFloat(claudeTemp.value) : 0.7,
        max_tokens: maxTokens ? parseInt(maxTokens.value) : 1024
      };
    }

    // Load saved config on page load
    window.onload = function() {
      // Try to load from frontend-config.js first
      if (typeof window.COMPLIANCE_CONFIG !== 'undefined') {
        supabaseUrl = window.COMPLIANCE_CONFIG.supabaseUrl;
        document.getElementById('supabaseUrl').value = supabaseUrl;
        localStorage.setItem('supabaseUrl', supabaseUrl);
        console.log('✅ Auto-loaded configuration from deployment');
      } else if (supabaseUrl) {
        document.getElementById('supabaseUrl').value = supabaseUrl;
      }
    }

    function saveConfig() {
      supabaseUrl = document.getElementById('supabaseUrl').value;
      localStorage.setItem('supabaseUrl', supabaseUrl);
      alert('Configuration saved!');
    }

    async function submitPrompt(mode = 'both') {
        const testParams = getTestParams();
        console.log('Running test with parameters:', testParams);
        
      const userInput = document.getElementById('userInput').value.trim();
      const systemPrompt = document.getElementById('systemPrompt').value.trim();

      if (!userInput) {
        alert('Please enter a question');
        return;
      }

      if (!supabaseUrl) {
        alert('Please configure your Supabase URL first');
        return;
      }

      // Add user message to history
      messageHistory.push({ role: "user", content: userInput });

      // Reset outputs based on mode and set loading state
      const claudeOutput = document.getElementById('claudeOutput');
      const gptOutput = document.getElementById('gptOutput');
      
      if (mode === 'both' || mode === 'claude') {
        claudeOutput.textContent = "Loading...";
        claudeOutput.className = "response-output loading";
      } else {
        claudeOutput.textContent = "Not requested";
        claudeOutput.className = "response-output";
      }
      
      if (mode === 'both' || mode === 'openai') {
        gptOutput.textContent = "Loading...";
        gptOutput.className = "response-output loading";
      } else {
        gptOutput.textContent = "Not requested";
        gptOutput.className = "response-output";
      }

      document.getElementById('saveTestBtn').disabled = true;

      // Store test data for potential saving (including parameters)
      currentTestResults = {
        userQuestion: userInput,
        systemPrompt: systemPrompt,
        claudeResponse: null,
        openaiResponse: null,
        claudeResponseTime: null,
        openaiResponseTime: null,
        testMode: mode,
        testParameters: testParams // Store the parameters used
      };

      // Call APIs based on mode
      const promises = [];
      
      if (mode === 'both' || mode === 'claude') {
        promises.push(callAPI('claude', [...messageHistory], systemPrompt, testParams));
      }
      
      if (mode === 'both' || mode === 'openai') {
        promises.push(callAPI('openai', [...messageHistory], systemPrompt, testParams));
      }

      // Wait for all requested APIs to complete
      if (promises.length > 0) {
        await Promise.allSettled(promises);
      }

      // Enable save button if we have any responses
      if (currentTestResults.claudeResponse || currentTestResults.openaiResponse) {
        document.getElementById('saveTestBtn').disabled = false;
      }

      // Clear input
      document.getElementById('userInput').value = '';
    }

    async function callAPI(provider, messages, systemPrompt, testParams) {
      const startTime = Date.now();
      const TIMEOUT_MS = 30000; // 30 second timeout
      
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
        
        // Prepare request body with parameters
        const requestBody = {
          provider: provider,
          messages: messages,
          systemPrompt: systemPrompt
        };

        // Add provider-specific parameters
        if (provider === 'claude') {
          requestBody.parameters = {
            temperature: testParams.claude_temperature,
            max_tokens: testParams.max_tokens
          };
        } else if (provider === 'openai') {
          requestBody.parameters = {
            temperature: testParams.openai_temperature,
            max_tokens: testParams.max_tokens
          };
        }

        console.log(`Calling ${provider} with parameters:`, requestBody.parameters);
        
        const response = await fetch(`${supabaseUrl}/functions/v1/compliance-proxy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.COMPLIANCE_CONFIG?.anonKey || ''}`,
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });

        // Clear timeout if request completes
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        const reply = data.content || "No response";
        const responseTime = Date.now() - startTime;
        
        // Update the appropriate output panel with success
        if (provider === 'claude') {
          const claudeOutput = document.getElementById('claudeOutput');
          claudeOutput.textContent = reply;
          claudeOutput.className = "response-output success";
          currentTestResults.claudeResponse = reply;
          currentTestResults.claudeResponseTime = responseTime;
        } else if (provider === 'openai') {
          const gptOutput = document.getElementById('gptOutput');
          gptOutput.textContent = reply;
          gptOutput.className = "response-output success";
          currentTestResults.openaiResponse = reply;
          currentTestResults.openaiResponseTime = responseTime;
        }

        // Add assistant response to history (only once, not for both providers)
        if (provider === 'claude') {
          messageHistory.push({ role: "assistant", content: reply });
        }

        return { provider, content: reply, responseTime, status: 'success' };

      } catch (error) {
        const responseTime = Date.now() - startTime;
        console.error(`${provider} error:`, error);
        
        // Determine error type and message
        let errorMessage;
        let errorType;
        
        if (error.name === 'AbortError') {
          errorType = 'timeout';
          errorMessage = `⏰ Timeout after ${TIMEOUT_MS/1000}s`;
        } else if (error.message.includes('HTTP 401')) {
          errorType = 'auth';
          errorMessage = `🔐 Authentication failed`;
        } else if (error.message.includes('HTTP 429')) {
          errorType = 'rate_limit';
          errorMessage = `🚦 Rate limit exceeded`;
        } else if (error.message.includes('HTTP 503') || error.message.includes('HTTP 502')) {
          errorType = 'service_unavailable';
          errorMessage = `🚫 Service unavailable`;
        } else if (!navigator.onLine) {
          errorType = 'network';
          errorMessage = `📡 No internet connection`;
        } else {
          errorType = 'unknown';
          errorMessage = `❌ Error: ${error.message}`;
        }
        
        // Update UI with error state
        const fullErrorMessage = `${errorMessage}\n(${responseTime}ms before failure)`;
        
        if (provider === 'claude') {
          const claudeOutput = document.getElementById('claudeOutput');
          claudeOutput.textContent = fullErrorMessage;
          claudeOutput.className = "response-output error";
          // Record error details for potential saving
          currentTestResults.claudeResponse = null;
          currentTestResults.claudeError = errorMessage;
          currentTestResults.claudeErrorType = errorType;
          currentTestResults.claudeResponseTime = responseTime;
        } else if (provider === 'openai') {
          const gptOutput = document.getElementById('gptOutput');
          gptOutput.textContent = fullErrorMessage;
          gptOutput.className = "response-output error";
          // Record error details for potential saving
          currentTestResults.openaiResponse = null;
          currentTestResults.openaiError = errorMessage;
          currentTestResults.openaiErrorType = errorType;
          currentTestResults.openaiResponseTime = responseTime;
        }
        
        return { provider, error: errorMessage, errorType, responseTime, status: 'error' };
      }
    }

    function saveCurrentTest() {
      if (!currentTestResults || (!currentTestResults.claudeResponse && !currentTestResults.openaiResponse)) {
        alert('No test results to save');
        return;
      }
      
      // Update preferred response options based on what was tested
      const preferredSelect = document.getElementById('preferredResponse');
      const hasClaudeResponse = currentTestResults.claudeResponse && currentTestResults.claudeResponse.trim() !== '';
      const hasOpenAIResponse = currentTestResults.openaiResponse && currentTestResults.openaiResponse.trim() !== '';
      
      // Clear existing options
      preferredSelect.innerHTML = '<option value="">No preference</option>';
      
      // Add options based on available responses
      if (hasClaudeResponse && hasOpenAIResponse) {
        preferredSelect.innerHTML += `
          <option value="claude">Claude</option>
          <option value="openai">OpenAI</option>
          <option value="both">Both equally good</option>
          <option value="neither">Neither satisfactory</option>
        `;
      } else if (hasClaudeResponse) {
        preferredSelect.innerHTML += `
          <option value="claude">Claude (only tested)</option>
          <option value="neither">Not satisfactory</option>
        `;
      } else if (hasOpenAIResponse) {
        preferredSelect.innerHTML += `
          <option value="openai">OpenAI (only tested)</option>
          <option value="neither">Not satisfactory</option>
        `;
      }
      
      document.getElementById('saveTestForm').style.display = 'block';
      document.getElementById('testName').focus();
    }

    function cancelSaveTest() {
      document.getElementById('saveTestForm').style.display = 'none';
      clearSaveForm();
    }

    async function confirmSaveTest() {
      const testName = document.getElementById('testName').value.trim();
      const category = document.getElementById('testCategory').value;
      const rating = document.getElementById('testRating').value ? parseInt(document.getElementById('testRating').value) : null;
      const preferredResponse = document.getElementById('preferredResponse').value || null;
      const notes = document.getElementById('testNotes').value.trim();

      if (!testName) {
        alert('Please enter a test name');
        return;
      }

      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/compliance-proxy/save-test`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.COMPLIANCE_CONFIG?.anonKey || ''}`,
          },
          body: JSON.stringify({
            ...currentTestResults,
            testName,
            category,
            rating,
            preferredResponse,
            notes
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }

        alert('Test saved successfully!');
        document.getElementById('saveTestForm').style.display = 'none';
        clearSaveForm();

      } catch (error) {
        console.error('Error saving test:', error);
        alert(`Failed to save test: ${error.message}`);
      }
    }

    function clearSaveForm() {
      document.getElementById('testName').value = '';
      document.getElementById('testCategory').value = 'general';
      document.getElementById('testRating').value = '';
      document.getElementById('preferredResponse').value = '';
      document.getElementById('testNotes').value = '';
    }

    // Load saved tests functionality
    async function loadSavedTests() {
      const category = document.getElementById('categoryFilter')?.value || '';
      
      try {
        let url = `${supabaseUrl}/functions/v1/compliance-proxy/get-tests?limit=50`;
        if (category) {
          url += `&category=${category}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${window.COMPLIANCE_CONFIG?.anonKey || ''}`,
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        displaySavedTests(data.tests);
        document.getElementById('savedTestsSection').style.display = 'block';

      } catch (error) {
        console.error('Error loading tests:', error);
        alert(`Failed to load tests: ${error.message}`);
      }
    }

    function displaySavedTests(tests) {
      const container = document.getElementById('savedTestsList');
      
      if (!tests || tests.length === 0) {
        container.innerHTML = '<p>No saved tests found.</p>';
        return;
      }

      const html = tests.map(test => {
        const hasClaudeResponse = test.claude_response && test.claude_response.trim() !== '';
        const hasOpenAIResponse = test.openai_response && test.openai_response.trim() !== '';
        const hasClaudeError = test.claude_error && test.claude_error.trim() !== '';
        const hasOpenAIError = test.openai_error && test.openai_error.trim() !== '';
        
        return `
        <div style="border: 1px solid #ddd; padding: 1em; margin-bottom: 1em; border-radius: 5px;">
          <h4>${test.test_name || 'Untitled Test'} 
            <span style="font-size: 0.8em; color: #666;">(${test.category || 'general'})</span>
            ${test.rating ? `<span style="color: #f39c12;">★${test.rating}</span>` : ''}
            <span style="font-size: 0.8em; color: #999;">
              [${hasClaudeResponse ? 'Claude ✅' : hasClaudeError ? 'Claude ❌' : ''}${hasClaudeResponse && hasOpenAIResponse ? ' + ' : hasClaudeError && hasOpenAIError ? ' + ' : ''}${hasOpenAIResponse ? 'OpenAI ✅' : hasOpenAIError ? 'OpenAI ❌' : ''}]
            </span>
          </h4>
          <p><strong>Question:</strong> ${test.user_question}</p>
          <div style="display: grid; grid-template-columns: ${hasClaudeResponse && hasOpenAIResponse ? '1fr 1fr' : '1fr'}; gap: 1em; margin: 1em 0;">
            ${hasClaudeResponse ? `
              <div>
                <strong>Claude Response:</strong>
                <div class="saved-test-response">
                  ${test.claude_response.substring(0, 300)}${test.claude_response.length > 300 ? '...' : ''}
                </div>
                ${test.claude_response_time_ms ? `<small>Response time: ${test.claude_response_time_ms}ms</small>` : ''}
              </div>
            ` : hasClaudeError ? `
              <div>
                <strong>Claude Error:</strong>
                <div class="saved-test-error">
                  ${test.claude_error}
                </div>
                <small>Error type: ${test.claude_error_type || 'unknown'}</small>
                ${test.claude_response_time_ms ? `<small> • Time before failure: ${test.claude_response_time_ms}ms</small>` : ''}
              </div>
            ` : `
              <div style="color: #999; font-style: italic;">
                <strong>Claude Response:</strong> Not tested
              </div>
            `}
            
            <!-- OpenAI Response/Error -->
            ${hasOpenAIResponse ? `
              <div>
                <strong>OpenAI Response:</strong>
                <div class="saved-test-response">
                  ${test.openai_response.substring(0, 300)}${test.openai_response.length > 300 ? '...' : ''}
                </div>
                ${test.openai_response_time_ms ? `<small>Response time: ${test.openai_response_time_ms}ms</small>` : ''}
              </div>
            ` : hasOpenAIError ? `
              <div>
                <strong>OpenAI Error:</strong>
                <div class="saved-test-error">
                  ${test.openai_error}
                </div>
                <small>Error type: ${test.openai_error_type || 'unknown'}</small>
                ${test.openai_response_time_ms ? `<small> • Time before failure: ${test.openai_response_time_ms}ms</small>` : ''}
              </div>
            ` : `
              <div style="color: #999; font-style: italic;">
                <strong>OpenAI Response:</strong> Not tested
              </div>
            `}
          </div>
          ${test.preferred_response ? `<p><strong>Preferred:</strong> ${test.preferred_response}</p>` : ''}
          ${test.notes ? `<p><strong>Notes:</strong> ${test.notes}</p>` : ''}
          <small style="color: #666;">
            Saved: ${new Date(test.created_at).toLocaleString()}
            ${(!hasClaudeResponse && !hasOpenAIResponse) ? ' • Failed test' : 
              (!hasClaudeResponse || !hasOpenAIResponse) ? ' • Partial result' : ''}
          </small>
        </div>
      `}).join('');

      container.innerHTML = html;
    }

    function closeSavedTests() {
      document.getElementById('savedTestsSection').style.display = 'none';
    }

    // Add these functions to your existing JavaScript
// Add this to your script section after your existing functions

// Load and apply model configuration dynamically
function loadModelConfiguration() {
  // Try to get config from frontend-config.js first, then from any loaded config
  let config = {};
  
  // Check if we have access to the config
  if (typeof window.COMPLIANCE_CONFIG !== 'undefined') {
    // We might need to fetch the frontend-config.js file directly
    fetch('./frontend-config.js')
      .then(response => response.json())
      .then(configData => {
        config = configData;
        updateInterfaceLabels(config);
      })
      .catch(error => {
        console.log('Could not load frontend-config.js, using defaults');
        // Use fallback config
        config = {
          models: { openai: "gpt-4o", claude: "claude-3-5-sonnet-20241022" },
          appConfig: { title: "Compliance Assistant Tester" }
        };
        updateInterfaceLabels(config);
      });
  } else {
    // Fallback config
    config = {
      models: { openai: "gpt-4o", claude: "claude-3-5-sonnet-20241022" },
      appConfig: { title: "Compliance Assistant Tester" }
    };
    updateInterfaceLabels(config);
  }
}

function updateInterfaceLabels(config) {
  const models = config.models || { openai: "gpt-4o", claude: "claude-3-5-sonnet-20241022" };
  
  // Get the model names and their display names
  const modelEntries = Object.entries(models);
  const leftModel = modelEntries[0]; // [provider, modelName]
  const rightModel = modelEntries[1]; // [provider, modelName]
  
  // Update response panel headers
  updateResponsePanelHeaders(leftModel, rightModel);
  
  // Update parameter control labels
  updateParameterLabels(leftModel, rightModel);
  
  // Update title if available
  if (config.appConfig && config.appConfig.title) {
    document.title = config.appConfig.title;
    const h1 = document.querySelector('h1');
    if (h1) h1.textContent = config.appConfig.title;
  }
  
  console.log('Interface updated with models:', { left: leftModel, right: rightModel });
}

function updateResponsePanelHeaders(leftModel, rightModel) {
  // Find the response panels
  const panels = document.querySelectorAll('#results .panel h2');
  
  if (panels.length >= 2) {
    // Update left panel (first model)
    panels[0].textContent = `${getModelDisplayName(leftModel[0])} Response`;
    panels[0].setAttribute('data-provider', leftModel[0]);
    panels[0].setAttribute('data-model', leftModel[1]);
    
    // Update right panel (second model)  
    panels[1].textContent = `${getModelDisplayName(rightModel[0])} Response`;
    panels[1].setAttribute('data-provider', rightModel[0]);
    panels[1].setAttribute('data-model', rightModel[1]);
    
    // Add model details as subtitle
    addModelSubtitles(panels[0], leftModel[1]);
    addModelSubtitles(panels[1], rightModel[1]);
  }
}

function updateParameterLabels(leftModel, rightModel) {
  // Update parameter control labels to match the actual models
  const paramControls = document.getElementById('param-controls');
  if (!paramControls) return;
  
  // Find and update parameter labels
  const labels = paramControls.querySelectorAll('label');
  labels.forEach(label => {
    const text = label.textContent;
    
    // Update temperature labels
    if (text.includes('OpenAI Temp') || text.includes('Claude Temp')) {
      if (text.includes(leftModel[0]) || text.includes('OpenAI')) {
        label.textContent = `${getModelDisplayName(leftModel[0])} Temp:`;
      } else if (text.includes(rightModel[0]) || text.includes('Claude')) {
        label.textContent = `${getModelDisplayName(rightModel[0])} Temp:`;
      }
    }
  });
  
  // Update the HTML structure for better alignment
  updateParameterControlsHTML(leftModel, rightModel);
}

function updateParameterControlsHTML(leftModel, rightModel) {
  const paramControls = document.getElementById('param-controls');
  if (!paramControls) return;
  
  // Replace the parameter controls with dynamic ones
  paramControls.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2em; margin: 0.5em 0; align-items: start;">
      <!-- Left Model Parameters -->
      <div style="border: 1px solid #ddd; padding: 1em; border-radius: 4px; background: #f9f9f9;">
        <h4 style="margin: 0 0 0.5em 0; color: #333;">${getModelDisplayName(leftModel[0])} Parameters</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5em;">
          <div>
            <label style="font-weight: bold; margin-bottom: 0.25em; display: block;">Temperature:</label>
            <input type="number" id="${leftModel[0]}-temp" min="0" max="1" step="0.1" value="0.7" 
                   style="width: 100%; padding: 0.3em; border: 1px solid #ccc; border-radius: 3px;">
          </div>
          <div>
            <label style="font-weight: bold; margin-bottom: 0.25em; display: block;">Max Tokens:</label>
            <input type="number" id="${leftModel[0]}-tokens" min="100" max="4000" value="1024" 
                   style="width: 100%; padding: 0.3em; border: 1px solid #ccc; border-radius: 3px;">
          </div>
        </div>
      </div>
      
      <!-- Right Model Parameters -->
      <div style="border: 1px solid #ddd; padding: 1em; border-radius: 4px; background: #f9f9f9;">
        <h4 style="margin: 0 0 0.5em 0; color: #333;">${getModelDisplayName(rightModel[0])} Parameters</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5em;">
          <div>
            <label style="font-weight: bold; margin-bottom: 0.25em; display: block;">Temperature:</label>
            <input type="number" id="${rightModel[0]}-temp" min="0" max="1" step="0.1" value="0.7" 
                   style="width: 100%; padding: 0.3em; border: 1px solid #ccc; border-radius: 3px;">
          </div>
          <div>
            <label style="font-weight: bold; margin-bottom: 0.25em; display: block;">Max Tokens:</label>
            <input type="number" id="${rightModel[0]}-tokens" min="100" max="4000" value="1024" 
                   style="width: 100%; padding: 0.3em; border: 1px solid #ccc; border-radius: 3px;">
          </div>
        </div>
      </div>
    </div>
    
    <!-- Global Controls -->
    <div style="text-align: center; margin-top: 1em; padding-top: 1em; border-top: 1px solid #ddd;">
      <button type="button" onclick="resetParams()" style="margin-right: 1em;">Reset All</button>
      <button type="button" onclick="copyParamsLeftToRight()">Copy ${getModelDisplayName(leftModel[0])} → ${getModelDisplayName(rightModel[0])}</button>
      <button type="button" onclick="copyParamsRightToLeft()">Copy ${getModelDisplayName(rightModel[0])} → ${getModelDisplayName(leftModel[0])}</button>
    </div>
  `;
}

function getModelDisplayName(provider) {
  const displayNames = {
    'openai': 'OpenAI',
    'claude': 'Claude',
    'anthropic': 'Claude',
    'gpt': 'OpenAI',
    'chatgpt': 'OpenAI'
  };
  
  return displayNames[provider.toLowerCase()] || provider.charAt(0).toUpperCase() + provider.slice(1);
}

function addModelSubtitles(headerElement, modelName) {
  // Add model name as subtitle
  const subtitle = document.createElement('div');
  subtitle.style.fontSize = '0.8em';
  subtitle.style.color = '#666';
  subtitle.style.fontWeight = 'normal';
  subtitle.textContent = modelName;
  headerElement.appendChild(subtitle);
}

// Updated parameter functions to work with dynamic model names
function resetParams() {
  const inputs = document.querySelectorAll('#param-controls input[type="number"]');
  inputs.forEach(input => {
    if (input.id.includes('temp')) {
      input.value = '0.7';
    } else if (input.id.includes('tokens')) {
      input.value = '1024';
    }
  });
  console.log('All parameters reset to defaults');
}

function copyParamsLeftToRight() {
  const leftTempInput = document.querySelector('#param-controls input[id$="-temp"]');
  const leftTokensInput = document.querySelector('#param-controls input[id$="-tokens"]');
  const rightTempInput = document.querySelectorAll('#param-controls input[id$="-temp"]')[1];
  const rightTokensInput = document.querySelectorAll('#param-controls input[id$="-tokens"]')[1];
  
  if (leftTempInput && rightTempInput) {
    rightTempInput.value = leftTempInput.value;
  }
  if (leftTokensInput && rightTokensInput) {
    rightTokensInput.value = leftTokensInput.value;
  }
  console.log('Parameters copied from left to right');
}

function copyParamsRightToLeft() {
  const leftTempInput = document.querySelector('#param-controls input[id$="-temp"]');
  const leftTokensInput = document.querySelector('#param-controls input[id$="-tokens"]');
  const rightTempInput = document.querySelectorAll('#param-controls input[id$="-temp"]')[1];
  const rightTokensInput = document.querySelectorAll('#param-controls input[id$="-tokens"]')[1];
  
  if (leftTempInput && rightTempInput) {
    leftTempInput.value = rightTempInput.value;
  }
  if (leftTokensInput && rightTokensInput) {
    leftTokensInput.value = rightTokensInput.value;
  }
  console.log('Parameters copied from right to left');
}

// Updated getTestParams function to work with dynamic models
function getTestParams() {
  const allInputs = document.querySelectorAll('#param-controls input[type="number"]');
  const params = {};
  
  allInputs.forEach(input => {
    const id = input.id;
    const value = input.value;
    
    if (id.includes('-temp')) {
      const provider = id.replace('-temp', '');
      if (!params[provider]) params[provider] = {};
      params[provider].temperature = parseFloat(value);
    } else if (id.includes('-tokens')) {
      const provider = id.replace('-tokens', '');
      if (!params[provider]) params[provider] = {};
      params[provider].max_tokens = parseInt(value);
    }
  });
  
  // Also maintain backwards compatibility with the old format
  const providers = Object.keys(params);
  const result = {
    openai_temperature: params.openai?.temperature || params[providers[0]]?.temperature || 0.7,
    claude_temperature: params.claude?.temperature || params.anthropic?.temperature || params[providers[1]]?.temperature || 0.7,
    max_tokens: params.openai?.max_tokens || params.claude?.max_tokens || params[providers[0]]?.max_tokens || 1024
  };
  
  // Add provider-specific parameters
  Object.keys(params).forEach(provider => {
    result[`${provider}_parameters`] = params[provider];
  });
  
  return result;
}

// Initialize the dynamic interface when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Load model configuration and update interface
  setTimeout(loadModelConfiguration, 100); // Small delay to ensure other scripts are loaded
});

// Also call it when the window loads as backup
window.addEventListener('load', function() {
  setTimeout(loadModelConfiguration, 200);
});

    // Allow Enter key to submit
    document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('userInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          submitPrompt();
        }
      });
    });
