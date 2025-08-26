#!/bin/bash
# File path: create-testing-structure.sh (run from arioncomply-v1/ directory)
# Creates complete testing infrastructure directory structure

set -e

echo "🏗️  Creating testing infrastructure for ArionComply..."

# Verify we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "backend" ]; then
    echo "❌ Please run this script from the arioncomply-v1/ directory"
    exit 1
fi

# Create main testing directory structure
echo "📁 Creating directory structure..."

mkdir -p testing/llm-comparison/{config/{parameter-sets,environments},web-interface/{css,js,assets},backend/{extensions,providers,validators},database/{extensions,seeds},scripts/{analysis,utilities},docs}
mkdir -p testing/llm-comparison/config/parameter-sets/custom
mkdir -p testing/docs

echo "📄 Creating configuration files..."

# Main endpoints configuration
cat > testing/llm-comparison/config/endpoints.json << 'EOF'
{
  "_description": "Service endpoint configuration for LLM testing infrastructure",
  "_file_path": "testing/llm-comparison/config/endpoints.json",
  "version": "1.0",
  "services": {
    "arioncomply_retrieval": {
      "enabled": true,
      "endpoint": "https://your-project.supabase.co/functions/v1/assistant",
      "auth_header": "Bearer ${SUPABASE_ANON_KEY}",
      "timeout_ms": 30000,
      "description": "ArionComply platform retrieval pipeline"
    },
    "alternative_retrieval": {
      "enabled": false,
      "endpoint": "http://localhost:3001/api/retrieve",
      "auth_header": "Bearer ${ALT_API_KEY}",
      "timeout_ms": 5000,
      "description": "Alternative retrieval service for testing"
    }
  },
  "models": {
    "edge_function": {
      "enabled": true,
      "endpoint": "https://your-project.supabase.co/functions/v1/compliance-proxy",
      "auth_header": "Bearer ${SUPABASE_ANON_KEY}",
      "description": "Existing compliance-proxy edge function"
    },
    "direct_api": {
      "enabled": false,
      "openai_endpoint": "https://api.openai.com/v1",
      "anthropic_endpoint": "https://api.anthropic.com/v1",
      "description": "Direct API calls (bypass edge function)"
    }
  },
  "database": {
    "primary": {
      "type": "supabase",
      "endpoint": "https://your-project.supabase.co",
      "auth_header": "Bearer ${SUPABASE_ANON_KEY}",
      "table": "compliance_tests",
      "description": "Existing compliance_tests table"
    }
  }
}
EOF

# Models configuration
cat > testing/llm-comparison/config/models.json << 'EOF'
{
  "_description": "Model definitions and parameter specifications",
  "_file_path": "testing/llm-comparison/config/models.json",
  "version": "1.0",
  "providers": {
    "openai": {
      "type": "cloud",
      "display_name": "OpenAI",
      "default_parameters": {
        "temperature": 0.1,
        "top_p": 0.9,
        "max_tokens": 1024,
        "frequency_penalty": 0.0,
        "presence_penalty": 0.0
      },
      "parameter_definitions": {
        "temperature": {
          "type": "range",
          "min": 0.0,
          "max": 2.0,
          "step": 0.1,
          "description": "Controls randomness. Lower = more deterministic, higher = more creative."
        },
        "top_p": {
          "type": "range",
          "min": 0.0,
          "max": 1.0,
          "step": 0.05,
          "description": "Nucleus sampling. Considers tokens with cumulative probability up to this value."
        },
        "max_tokens": {
          "type": "number",
          "min": 1,
          "max": 4096,
          "step": 1,
          "description": "Maximum number of tokens to generate."
        },
        "frequency_penalty": {
          "type": "range",
          "min": -2.0,
          "max": 2.0,
          "step": 0.1,
          "description": "Penalize frequent tokens. Positive values discourage repetition."
        },
        "presence_penalty": {
          "type": "range",
          "min": -2.0,
          "max": 2.0,
          "step": 0.1,
          "description": "Penalize tokens that already appeared. Positive values encourage topic diversity."
        }
      },
      "models": [
        {
          "id": "gpt-4o",
          "name": "GPT-4 Omni",
          "max_context": 128000,
          "cost_per_1k_tokens": 0.03,
          "supported_parameters": ["temperature", "top_p", "max_tokens", "frequency_penalty", "presence_penalty", "stop", "seed"]
        },
        {
          "id": "gpt-4o-mini",
          "name": "GPT-4 Omni Mini", 
          "max_context": 128000,
          "cost_per_1k_tokens": 0.0015,
          "supported_parameters": ["temperature", "top_p", "max_tokens", "frequency_penalty", "presence_penalty", "stop", "seed"]
        }
      ]
    },
    "anthropic": {
      "type": "cloud",
      "display_name": "Anthropic",
      "default_parameters": {
        "temperature": 0.1,
        "top_p": 0.9,
        "top_k": 40,
        "max_tokens": 1024
      },
      "parameter_definitions": {
        "temperature": {
          "type": "range",
          "min": 0.0,
          "max": 1.0,
          "step": 0.1,
          "description": "Controls randomness. Lower = more deterministic, higher = more creative."
        },
        "top_p": {
          "type": "range",
          "min": 0.0,
          "max": 1.0,
          "step": 0.05,
          "description": "Nucleus sampling."
        },
        "top_k": {
          "type": "number",
          "min": 1,
          "max": 100,
          "step": 1,
          "description": "Consider only the top K most likely tokens."
        },
        "max_tokens": {
          "type": "number",
          "min": 1,
          "max": 4096,
          "step": 1,
          "description": "Maximum number of tokens to generate."
        }
      },
      "models": [
        {
          "id": "claude-3-5-sonnet-20241022",
          "name": "Claude 3.5 Sonnet",
          "max_context": 200000,
          "cost_per_1k_tokens": 0.015,
          "supported_parameters": ["temperature", "top_p", "top_k", "max_tokens", "stop_sequences"]
        }
      ]
    }
  }
}
EOF

# Production parameter set
cat > testing/llm-comparison/config/parameter-sets/production.json << 'EOF'
{
  "_description": "Conservative parameters for production compliance use",
  "_file_path": "testing/llm-comparison/config/parameter-sets/production.json",
  "name": "Production Settings",
  "description": "Conservative parameters for production compliance use",
  "version": "1.0",
  "created_date": "2025-01-14",
  "parameter_overrides": {
    "openai": {
      "temperature": 0.1,
      "top_p": 0.9,
      "max_tokens": 1024,
      "frequency_penalty": 0.0,
      "presence_penalty": 0.0
    },
    "anthropic": {
      "temperature": 0.1,
      "top_p": 0.9,
      "top_k": 40,
      "max_tokens": 1024
    }
  }
}
EOF

# Experimental parameter set
cat > testing/llm-comparison/config/parameter-sets/experimental.json << 'EOF'
{
  "_description": "Testing different parameter combinations",
  "_file_path": "testing/llm-comparison/config/parameter-sets/experimental.json",
  "name": "Experimental Settings",
  "description": "Testing different parameter combinations",
  "version": "1.0",
  "created_date": "2025-01-14",
  "parameter_overrides": {
    "openai": {
      "temperature": 0.3,
      "top_p": 0.8,
      "frequency_penalty": 0.2,
      "presence_penalty": 0.2
    },
    "anthropic": {
      "temperature": 0.3,
      "top_p": 0.8,
      "top_k": 20
    }
  }
}
EOF

# Deterministic parameter set
cat > testing/llm-comparison/config/parameter-sets/deterministic.json << 'EOF'
{
  "_description": "Maximum determinism for reproducible results",
  "_file_path": "testing/llm-comparison/config/parameter-sets/deterministic.json",
  "name": "Deterministic Settings",
  "description": "Maximum determinism for reproducible results",
  "version": "1.0",
  "created_date": "2025-01-14",
  "parameter_overrides": {
    "openai": {
      "temperature": 0.0,
      "top_p": 1.0,
      "seed": 42
    },
    "anthropic": {
      "temperature": 0.0,
      "top_p": 1.0,
      "top_k": 1
    }
  }
}
EOF

# Local environment configuration
cat > testing/llm-comparison/config/environments/local.json << 'EOF'
{
  "_description": "Local development environment configuration",
  "_file_path": "testing/llm-comparison/config/environments/local.json",
  "name": "Local Development",
  "version": "1.0",
  "endpoints": {
    "supabase_url": "http://localhost:54321",
    "edge_function_url": "http://localhost:54321/functions/v1/compliance-proxy"
  },
  "database": {
    "connection_string": "postgresql://postgres:postgres@localhost:54322/postgres"
  },
  "api_keys": {
    "use_environment_variables": true,
    "required_variables": ["OPENAI_API_KEY", "ANTHROPIC_API_KEY", "SUPABASE_ANON_KEY"]
  }
}
EOF

# Production environment configuration
cat > testing/llm-comparison/config/environments/production.json << 'EOF'
{
  "_description": "Production environment configuration",
  "_file_path": "testing/llm-comparison/config/environments/production.json",
  "name": "Production",
  "version": "1.0",
  "endpoints": {
    "supabase_url": "https://your-project.supabase.co",
    "edge_function_url": "https://your-project.supabase.co/functions/v1/compliance-proxy"
  },
  "database": {
    "use_supabase": true
  },
  "api_keys": {
    "use_environment_variables": true,
    "required_variables": ["OPENAI_API_KEY", "ANTHROPIC_API_KEY", "SUPABASE_ANON_KEY"]
  },
  "security": {
    "require_https": true,
    "validate_certificates": true
  }
}
EOF

echo "🌐 Creating web interface files..."

# Enhanced HTML structure
cat > testing/llm-comparison/web-interface/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ArionComply LLM Parameter Testing</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div id="app">
        <header>
            <h1>ArionComply LLM Parameter Testing</h1>
            <div id="status" class="status-indicator">
                <span id="config-status">⏳ Loading configuration...</span>
            </div>
        </header>

        <div id="configuration-panel" class="panel">
            <h2>Configuration</h2>
            <div class="config-section">
                <label for="environment-select">Environment:</label>
                <select id="environment-select">
                    <option value="local">Local Development</option>
                    <option value="production">Production</option>
                </select>
            </div>
            <div class="config-section">
                <label for="parameter-set-select">Parameter Set:</label>
                <select id="parameter-set-select">
                    <option value="production">Production Settings</option>
                    <option value="experimental">Experimental Settings</option>
                    <option value="deterministic">Deterministic Settings</option>
                    <option value="custom">Custom...</option>
                </select>
                <button id="save-parameter-set" style="display: none;">Save as New Set</button>
            </div>
        </div>

        <div id="model-selection-panel" class="panel">
            <h2>Model Selection</h2>
            <div id="model-checkboxes">
                <!-- Model checkboxes will be populated dynamically -->
            </div>
        </div>

        <div id="parameter-controls-panel" class="panel" style="display: none;">
            <h2>Parameter Controls</h2>
            <div id="parameter-tabs">
                <!-- Parameter tabs will be created dynamically -->
            </div>
            <div id="parameter-content">
                <!-- Parameter controls will be created dynamically -->
            </div>
            <div class="parameter-actions">
                <button id="reset-parameters">Reset to Defaults</button>
                <button id="apply-to-all">Apply to Compatible Models</button>
            </div>
        </div>

        <div id="test-interface" class="panel">
            <h2>Test Configuration</h2>
            <div class="test-config">
                <label for="test-category">Category:</label>
                <select id="test-category">
                    <option value="iso27001">ISO 27001</option>
                    <option value="gdpr">GDPR</option>
                    <option value="risk-assessment">Risk Assessment</option>
                    <option value="documentation">Documentation</option>
                    <option value="general">General Compliance</option>
                </select>
            </div>
            <div class="prompt-section">
                <label for="system-prompt">System Prompt:</label>
                <textarea id="system-prompt" rows="4" placeholder="System prompt for all models...">You are a compliance assistant specializing in ISO 27001 and GDPR.
Provide accurate, practical guidance based on official standards.
Be concise and reference specific clauses when applicable.</textarea>
            </div>
            <div class="query-section">
                <label for="user-query">Query:</label>
                <textarea id="user-query" rows="3" placeholder="Enter your compliance question..."></textarea>
            </div>
            <div class="test-actions">
                <button id="run-test" disabled>Run Parameter Test</button>
                <button id="save-results" disabled>Save Results</button>
                <button id="view-history">View Test History</button>
            </div>
        </div>

        <div id="results-panel" class="panel" style="display: none;">
            <h2>Test Results</h2>
            <div id="results-content">
                <!-- Results will be populated dynamically -->
            </div>
        </div>

        <div id="history-panel" class="panel" style="display: none;">
            <h2>Test History</h2>
            <div id="history-controls">
                <label for="history-filter">Filter by category:</label>
                <select id="history-filter">
                    <option value="">All categories</option>
                    <option value="iso27001">ISO 27001</option>
                    <option value="gdpr">GDPR</option>
                    <option value="risk-assessment">Risk Assessment</option>
                    <option value="documentation">Documentation</option>
                    <option value="general">General Compliance</option>
                </select>
                <button id="close-history">Close</button>
            </div>
            <div id="history-content">
                <!-- History will be populated dynamically -->
            </div>
        </div>
    </div>

    <script src="js/config-loader.js"></script>
    <script src="js/parameter-manager.js"></script>
    <script src="js/comparison.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
EOF

# Enhanced CSS
cat > testing/llm-comparison/web-interface/css/style.css << 'EOF'
/* ArionComply LLM Testing Interface Styles */
/* Phase 1 Implementation */

:root {
    --primary-color: #007acc;
    --secondary-color: #f5f5f5;
    --success-color: #28a745;
    --warning-color: #ffc107;
    --error-color: #dc3545;
    --border-color: #ddd;
    --text-color: #333;
    --bg-color: #ffffff;
}

* {
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: var(--secondary-color);
    color: var(--text-color);
    line-height: 1.6;
}

#app {
    max-width: 1400px;
    margin: 0 auto;
    background: var(--bg-color);
    padding: 0;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
}

header {
    background: var(--primary-color);
    color: white;
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
}

header h1 {
    margin: 0;
    font-size: 1.8em;
    font-weight: 600;
}

.status-indicator {
    margin-top: 10px;
    font-size: 0.9em;
}

.panel {
    margin: 0;
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-color);
}

.panel h2 {
    margin: 0 0 15px 0;
    color: var(--primary-color);
    font-size: 1.3em;
    font-weight: 600;
    border-bottom: 2px solid var(--primary-color);
    padding-bottom: 5px;
}

/* Configuration Styles */
.config-section {
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 10px;
    vertical-align: top;
}

.config-section label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
}

.config-section select {
    padding: 8px 12px;
    border: 2px solid var(--border-color);
    border-radius: 4px;
    font-size: 14px;
    min-width: 180px;
}

.config-section button {
    margin-left: 10px;
    padding: 8px 16px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.config-section button:hover {
    background: #005fa3;
}

/* Model Selection */
#model-checkboxes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
}

.model-provider {
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 15px;
    background: #fafafa;
}

.model-provider h4 {
    margin: 0 0 10px 0;
    color: var(--primary-color);
    font-size: 1.1em;
}

.model-option {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    padding: 5px;
    border-radius: 3px;
    transition: background-color 0.2s;
}

.model-option:hover {
    background: #f0f0f0;
}

.model-option input[type="checkbox"] {
    margin-right: 10px;
    scale: 1.2;
}

.model-option label {
    flex: 1;
    cursor: pointer;
    font-weight: 500;
}

/* Parameter Controls */
#parameter-tabs {
    display: flex;
    border-bottom: 2px solid var(--border-color);
    margin-bottom: 20px;
}

.parameter-tab {
    padding: 10px 20px;
    background: #f8f9fa;
    border: 1px solid var(--border-color);
    border-bottom: none;
    cursor: pointer;
    transition: background-color 0.2s;
    font-weight: 500;
}

.parameter-tab:first-child {
    border-radius: 4px 0 0 0;
}

.parameter-tab:last-child {
    border-radius: 0 4px 0 0;
}

.parameter-tab.active {
    background: var(--bg-color);
    border-bottom: 2px solid var(--bg-color);
    margin-bottom: -2px;
}

.parameter-tab:hover:not(.active) {
    background: #e9ecef;
}

.parameter-group {
    display: none;
    padding: 20px;
    border: 1px solid var(--border-color);
    border-top: none;
    border-radius: 0 0 4px 4px;
    background: var(--bg-color);
}

.parameter-group.active {
    display: block;
}

.parameter-control {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: #fafafa;
}

.parameter-control label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--text-color);
}

.parameter-control input[type="range"] {
    width: 100%;
    margin: 5px 0;
}

.parameter-control input[type="number"] {
    width: 100px;
    padding: 5px 8px;
    border: 1px solid var(--border-color);
    border-radius: 3px;
}

.parameter-value {
    display: inline-block;
    margin-left: 10px;
    font-weight: bold;
    color: var(--primary-color);
    min-width: 60px;
}

.parameter-help {
    display: block;
    margin-top: 5px;
    font-size: 0.85em;
    color: #666;
    font-style: italic;
}

.parameter-actions {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid var(--border-color);
}

.parameter-actions button {
    margin-right: 10px;
    padding: 8px 16px;
    border: 1px solid var(--primary-color);
    background: var(--bg-color);
    color: var(--primary-color);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.parameter-actions button:hover {
    background: var(--primary-color);
    color: white;
}

/* Test Interface */
.test-config {
    margin-bottom: 15px;
}

.prompt-section,
.query-section {
    margin-bottom: 20px;
}

.prompt-section label,
.query-section label,
.test-config label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
}

.prompt-section textarea,
.query-section textarea {
    width: 100%;
    padding: 10px;
    border: 2px solid var(--border-color);
    border-radius: 4px;
    font-family: inherit;
    font-size: 14px;
    resize: vertical;
}

.prompt-section textarea:focus,
.query-section textarea:focus {
    outline: none;
    border-color: var(--primary-color);
}

.test-config select {
    padding: 8px 12px;
    border: 2px solid var(--border-color);
    border-radius: 4px;
    font-size: 14px;
    min-width: 200px;
}

.test-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.test-actions button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
}

#run-test {
    background: var(--success-color);
    color: white;
}

#run-test:hover:not(:disabled) {
    background: #218838;
}

#run-test:disabled {
    background: #ccc;
    cursor: not-allowed;
}

#save-results {
    background: var(--primary-color);
    color: white;
}

#save-results:hover:not(:disabled) {
    background: #005fa3;
}

#save-results:disabled {
    background: #ccc;
    cursor: not-allowed;
}

#view-history {
    background: var(--bg-color);
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
}

#view-history:hover {
    background: var(--primary-color);
    color: white;
}

/* Results Display */
#results-content {
    margin-top: 20px;
}

.result-item {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: #fafafa;
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color);
}

.result-model {
    font-weight: 600;
    color: var(--primary-color);
}

.result-timing {
    font-size: 0.9em;
    color: #666;
}

.result-content {
    padding: 10px;
    background: white;
    border: 1px solid #eee;
    border-radius: 4px;
    white-space: pre-wrap;
    font-family: inherit;
    line-height: 1.5;
}

.result-parameters {
    margin-top: 10px;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 3px;
    font-size: 0.85em;
    color: #666;
}

/* History Panel */
#history-controls {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border-color);
}

#history-filter {
    padding: 6px 10px;
    border: 1px solid var(--border-color);
    border-radius: 3px;
    font-size: 14px;
}

#close-history {
    padding: 6px 12px;
    background: var(--error-color);
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
    margin-left: auto;
}

#close-history:hover {
    background: #c82333;
}

/* Status and Feedback */
.validation-alert {
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
    font-size: 0.9em;
}

.validation-alert.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.validation-alert.warning {
    background: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
}

.validation-alert.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

/* Loading States */
.loading {
    opacity: 0.6;
    pointer-events: none;
    position: relative;
}

.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid #ccc;
    border-top: 2px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
    body {
        padding: 10px;
    }
    
    #model-checkboxes {
        grid-template-columns: 1fr;
    }
    
    .config-section {
        display: block;
        margin-right: 0;
        margin-bottom: 15px;
    }
    
    .test-actions {
        flex-direction: column;
    }
    
    .test-actions button {
        margin-bottom: 10px;
    }
}
EOF

# Main application JavaScript
cat > testing/llm-comparison/web-interface/js/main.js << 'EOF'
// Main application initialization
// File path: testing/llm-comparison/web-interface/js/main.js

class App {
    constructor() {
        this.initialized = false;
        this.selectedModels = [];
        this.currentParameterSet = 'production';
        this.currentEnvironment = 'local';
    }

    async init() {
        try {
            this.updateStatus('⏳ Loading configuration...');
            
            // Load configuration
            await window.configLoader.loadConfiguration();
            await window.parameterManager.init();
            
            // Setup UI event listeners
            this.setupEventListeners();
            
            // Initialize UI components
            this.initializeModelSelection();
            this.initializeParameterSets();
            
            this.updateStatus('✅ Ready for testing');
            this.initialized = true;
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.updateStatus('❌ Configuration error: ' + error.message);
        }
    }

    setupEventListeners() {
        // Environment selection
        document.getElementById('environment-select').addEventListener('change', (e) => {
            this.currentEnvironment = e.target.value;
            this.handleEnvironmentChange();
        });

        // Parameter set selection
        document.getElementById('parameter-set-select').addEventListener('change', (e) => {
            this.currentParameterSet = e.target.value;
            this.handleParameterSetChange();
        });

        // Test execution
        document.getElementById('run-test').addEventListener('click', () => {
            this.runTest();
        });

        // Results saving
        document.getElementById('save-results').addEventListener('click', () => {
            this.saveResults();
        });

        // History viewing
        document.getElementById('view-history').addEventListener('click', () => {
            this.viewHistory();
        });

        // History panel controls
        document.getElementById('close-history').addEventListener('click', () => {
            document.getElementById('history-panel').style.display = 'none';
        });

        // Parameter controls
        document.getElementById('reset-parameters').addEventListener('click', () => {
            window.parameterManager.resetToDefaults();
        });

        document.getElementById('apply-to-all').addEventListener('click', () => {
            window.parameterManager.applyToAllCompatible();
        });

        // Input validation
        document.getElementById('user-query').addEventListener('input', () => {
            this.validateTestInputs();
        });
    }

    initializeModelSelection() {
        const container = document.getElementById('model-checkboxes');
        const models = window.configLoader.getModels();
        
        container.innerHTML = '';
        
        Object.entries(models.providers).forEach(([providerId, provider]) => {
            const providerDiv = document.createElement('div');
            providerDiv.className = 'model-provider';
            
            const providerTitle = document.createElement('h4');
            providerTitle.textContent = provider.display_name || providerId;
            providerDiv.appendChild(providerTitle);
            
            provider.models.forEach(model => {
                const modelDiv = document.createElement('div');
                modelDiv.className = 'model-option';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `model-${providerId}-${model.id}`;
                checkbox.value = `${providerId}/${model.id}`;
                checkbox.addEventListener('change', () => this.handleModelSelection());
                
                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = model.name;
                
                modelDiv.appendChild(checkbox);
                modelDiv.appendChild(label);
                providerDiv.appendChild(modelDiv);
            });
            
            container.appendChild(providerDiv);
        });
    }

    initializeParameterSets() {
        const select = document.getElementById('parameter-set-select');
        const parameterSets = window.parameterManager.getParameterSets();
        
        select.innerHTML = '';
        
        parameterSets.forEach(set => {
            const option = document.createElement('option');
            option.value = set.name.toLowerCase().replace(/\s+/g, '-');
            option.textContent = set.name;
            select.appendChild(option);
        });
        
        // Add custom option
        const customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.textContent = 'Custom...';
        select.appendChild(customOption);
    }

    handleModelSelection() {
        const checkboxes = document.querySelectorAll('#model-checkboxes input[type="checkbox"]:checked');
        this.selectedModels = Array.from(checkboxes).map(cb => cb.value);
        
        if (this.selectedModels.length > 0) {
            // Show parameter controls
            document.getElementById('parameter-controls-panel').style.display = 'block';
            window.parameterManager.createParameterControls(this.selectedModels);
        } else {
            // Hide parameter controls
            document.getElementById('parameter-controls-panel').style.display = 'none';
        }
        
        this.validateTestInputs();
    }

    handleEnvironmentChange() {
        this.updateStatus('⏳ Switching environment...');
        // Reload configuration for new environment
        window.configLoader.loadEnvironment(this.currentEnvironment)
            .then(() => {
                this.updateStatus('✅ Environment switched');
            })
            .catch(error => {
                this.updateStatus('❌ Environment switch failed: ' + error.message);
            });
    }

    handleParameterSetChange() {
        if (this.currentParameterSet === 'custom') {
            document.getElementById('save-parameter-set').style.display = 'inline-block';
        } else {
            document.getElementById('save-parameter-set').style.display = 'none';
        }
        
        window.parameterManager.loadParameterSet(this.currentParameterSet);
    }

    validateTestInputs() {
        const query = document.getElementById('user-query').value.trim();
        const hasModels = this.selectedModels.length > 0;
        const runButton = document.getElementById('run-test');
        
        runButton.disabled = !(query && hasModels);
    }

    async runTest() {
        if (!this.initialized) return;
        
        try {
            this.updateStatus('⏳ Running test...');
            document.getElementById('run-test').disabled = true;
            
            const testConfig = {
                query: document.getElementById('user-query').value.trim(),
                systemPrompt: document.getElementById('system-prompt').value.trim(),
                category: document.getElementById('test-category').value,
                models: this.selectedModels,
                parameterSet: this.currentParameterSet,
                parameters: window.parameterManager.getCurrentParameters()
            };
            
            const results = await window.comparisonInterface.runComparison(testConfig);
            
            this.displayResults(results);
            document.getElementById('results-panel').style.display = 'block';
            document.getElementById('save-results').disabled = false;
            
            this.updateStatus('✅ Test completed');
            
        } catch (error) {
            console.error('Test failed:', error);
            this.updateStatus('❌ Test failed: ' + error.message);
        } finally {
            document.getElementById('run-test').disabled = false;
        }
    }

    displayResults(results) {
        const container = document.getElementById('results-content');
        container.innerHTML = '';
        
        results.forEach(result => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'result-item';
            
            const header = document.createElement('div');
            header.className = 'result-header';
            
            const modelName = document.createElement('div');
            modelName.className = 'result-model';
            modelName.textContent = result.model;
            
            const timing = document.createElement('div');
            timing.className = 'result-timing';
            timing.textContent = `${result.responseTime}ms`;
            
            header.appendChild(modelName);
            header.appendChild(timing);
            
            const content = document.createElement('div');
            content.className = 'result-content';
            content.textContent = result.response;
            
            const parameters = document.createElement('div');
            parameters.className = 'result-parameters';
            parameters.textContent = `Parameters: ${JSON.stringify(result.parameters)}`;
            
            resultDiv.appendChild(header);
            resultDiv.appendChild(content);
            resultDiv.appendChild(parameters);
            
            container.appendChild(resultDiv);
        });
    }

    async saveResults() {
        try {
            this.updateStatus('⏳ Saving results...');
            // Implementation will be added in Phase 2
            this.updateStatus('✅ Results saved');
        } catch (error) {
            this.updateStatus('❌ Save failed: ' + error.message);
        }
    }

    async viewHistory() {
        try {
            document.getElementById('history-panel').style.display = 'block';
            // Implementation will be added in Phase 2
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    }

    updateStatus(message) {
        document.getElementById('config-status').textContent = message;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    window.app.init();
});
EOF

echo "📊 Creating database extension..."

# Database extension for parameter support
cat > testing/llm-comparison/database/extensions/001_add_parameter_support.sql << 'EOF'
-- Extension to existing compliance_tests table to support parameter testing
-- File path: testing/llm-comparison/database/extensions/001_add_parameter_support.sql
-- Phase 2: Database extensions (non-breaking additions)

-- Add parameter-related columns to existing table
-- Note: These are additions, not modifications to existing columns

ALTER TABLE compliance_tests 
ADD COLUMN IF NOT EXISTS parameter_set_name TEXT,
ADD COLUMN IF NOT EXISTS claude_parameters JSONB,
ADD COLUMN IF NOT EXISTS openai_parameters JSONB,
ADD COLUMN IF NOT EXISTS parameter_experiment_id UUID,
ADD COLUMN IF NOT EXISTS retrieval_context_hash TEXT,
ADD COLUMN IF NOT EXISTS context_length_tokens INTEGER;

-- Create indexes for parameter queries
CREATE INDEX IF NOT EXISTS idx_compliance_tests_parameter_set 
ON compliance_tests(parameter_set_name);

CREATE INDEX IF NOT EXISTS idx_compliance_tests_experiment 
ON compliance_tests(parameter_experiment_id);

-- Create table for parameter experiments (Phase 2)
CREATE TABLE IF NOT EXISTS parameter_experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_name TEXT NOT NULL,
    base_query TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    model_id TEXT NOT NULL,
    parameter_combinations JSONB[],
    results_summary JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for experiments
CREATE INDEX IF NOT EXISTS idx_parameter_experiments_model 
ON parameter_experiments(provider_name, model_id);

-- Comment on the extensions
COMMENT ON COLUMN compliance_tests.parameter_set_name IS 'Name of parameter set used for this test';
COMMENT ON COLUMN compliance_tests.claude_parameters IS 'Parameters used for Claude model';
COMMENT ON COLUMN compliance_tests.openai_parameters IS 'Parameters used for OpenAI model';
COMMENT ON COLUMN compliance_tests.parameter_experiment_id IS 'Links to parameter_experiments table if part of experiment';
COMMENT ON COLUMN compliance_tests.retrieval_context_hash IS 'Hash of retrieval context for reproducibility';
COMMENT ON COLUMN compliance_tests.context_length_tokens IS 'Length of context provided to models';

COMMENT ON TABLE parameter_experiments IS 'Tracks parameter optimization experiments';
EOF

echo "📚 Creating documentation..."

# Main README
cat > testing/llm-comparison/README.md << 'EOF'
# ArionComply LLM Testing Infrastructure

## Purpose
Testing and validation infrastructure for LLM parameter optimization in compliance use cases. Designed to work with the existing ArionComply platform while remaining modular and configurable.

## Architecture Principles
- **Modular:** Each component can be modified/replaced independently
- **Configurable:** All endpoints and services configurable via JSON
- **Non-intrusive:** Extends existing ArionComply code without modification
- **Incremental:** Built and tested in phases
- **JSON-first:** All configuration in JSON format

## Directory Structure
