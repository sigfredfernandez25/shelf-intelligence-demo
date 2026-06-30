# Shelf Intelligence Agent Integration Kit

This package contains TypeScript agent modules, Next.js API routes, an OpenAPI specification, and an integration manual for wiring the Shelf Intelligence demo UI into Copilot Studio or Azure AI Foundry.

## Contents

```text
src/agents/                 Agent modules
src/data/                   Mock POS, inventory, planogram, and task data
src/types/                  Shared TypeScript types
app/api/                    Next.js App Router API endpoints
openapi.yaml                API definition for Copilot Studio / Azure AI Foundry
docs/INTEGRATION_MANUAL.md  Step-by-step integration manual
```

## Quick Test

```bash
npm install
npm run dev
```

Then open:

```text
/api/dashboard?storeId=102
/api/sku/CHIPS_A
```

## Main Pattern

```text
Vercel UI → API Layer → Agent Orchestrator → Agent Modules → Data
```
