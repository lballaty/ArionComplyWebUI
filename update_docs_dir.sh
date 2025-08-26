#!/bin/bash

# Create functional definitions directory structure
# Run from: arionrepo/xLLMArionComply/

echo "Creating functional definitions directory structure..."

# Create main functional-definitions directory
mkdir -p docs/functional-definitions

# Create subdirectories
mkdir -p docs/functional-definitions/workflows
mkdir -p docs/functional-definitions/schemas
mkdir -p docs/functional-definitions/integration

# Create README files
cat > docs/functional-definitions/README.md << 'EOF'
# Functional Definitions

This directory contains functional specifications for the ArionComply platform, detailing workflows, data schemas, and integration patterns.

## Structure

- **workflows/** - Business process definitions and workflow specifications
- **schemas/** - Data structure and framework definitions
- **integration/** - System integration and architecture patterns

## Cross-References

- [Technical Architecture](../Architecture.md)
- [Data Model](../DataModelingSupabase.md)
- [Functional Requirements](../FunctionalNonFunctionalReq.md)

## Status

All functional definitions are in **Draft** status unless marked otherwise.
EOF

# Create workflow placeholder files
cat > docs/functional-definitions/workflows/README.md << 'EOF'
# Workflow Definitions

Detailed specifications for ArionComply platform workflows.

## Available Workflows

- [Control Review Workflow](./control-review-workflow.md)
- [Multi-Standard Strategy Workflow](./multi-standard-strategy-workflow.md)
- [Risk Assessment Workflow](./risk-assessment-workflow.md)
- [Feedback Action Workflow](./feedback-action-workflow.md)

## Workflow Status

All workflows are **Draft** - Ready for Review pending implementation.
EOF

touch docs/functional-definitions/workflows/control-review-workflow.md
touch docs/functional-definitions/workflows/multi-standard-strategy-workflow.md
touch docs/functional-definitions/workflows/risk-assessment-workflow.md
touch docs/functional-definitions/workflows/feedback-action-workflow.md

# Create schema placeholder files
cat > docs/functional-definitions/schemas/README.md << 'EOF'
# Schema Definitions

Data structure and framework specifications for the ArionComply platform.

## Available Schemas

- [Q&A Framework Schema](./qa-framework-schema.md)
- [Evidence Automation Schema](./evidence-automation-schema.md)
- [Artifact Lifecycle Schema](./artifact-lifecycle-schema.md)

## Schema Status

All schemas are **Draft** - Ready for Review pending validation.
EOF

touch docs/functional-definitions/schemas/qa-framework-schema.md
touch docs/functional-definitions/schemas/evidence-automation-schema.md
touch docs/functional-definitions/schemas/artifact-lifecycle-schema.md

# Create integration placeholder files
cat > docs/functional-definitions/integration/README.md << 'EOF'
# Integration Specifications

System integration patterns and hybrid architecture definitions.

## Available Specifications

- [Supabase Edge Functions](./supabase-edge-functions.md)
- [Local LLM Services](./local-llm-services.md)
- [Hybrid Architecture](./hybrid-architecture.md)

## Integration Status

All integration specs are **Draft** - Ready for Review pending implementation.
EOF

touch docs/functional-definitions/integration/supabase-edge-functions.md
touch docs/functional-definitions/integration/local-llm-services.md
touch docs/functional-definitions/integration/hybrid-architecture.md

echo "✅ Functional definitions directory structure created successfully!"
echo ""
echo "Created structure:"
tree docs/functional-definitions/ 2>/dev/null || find docs/functional-definitions/ -type f | sort
