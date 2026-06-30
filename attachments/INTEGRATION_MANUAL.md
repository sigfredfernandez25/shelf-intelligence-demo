# Shelf Intelligence Agent Integration Manual

## 1. Purpose

This kit turns the Shelf Intelligence demo UI into an agent-powered application. The UI remains the product experience, while the backend API exposes agent modules that can be consumed by:

- Your Vercel / Next.js UI
- Microsoft Copilot Studio as REST API tools or custom connector actions
- Azure AI Foundry Agent Service through OpenAPI tools or function calling

## 2. Target Architecture

```text
Vercel UI
  ↓
Next.js API Routes
  ↓
Shelf Intelligence Orchestrator
  ↓
Demand Forecast Agent
Replenishment Agent
Recommendation Agent
Planogram Agent
Task Orchestrator Agent
  ↓
Mock Data / POS / Inventory / Planogram / Promotion Data
```

## 3. Agent Modules Included

### Demand Forecast Agent
File: `src/agents/demandForecastAgent.ts`

Responsibilities:
- Reads SKU sales history and current stock.
- Calculates sales velocity.
- Estimates runout hours.
- Classifies risk as LOW, MEDIUM, or HIGH.

### Replenishment Agent
File: `src/agents/replenishmentAgent.ts`

Responsibilities:
- Checks whether backroom stock exists.
- Creates a replenishment task when stock is available.
- Returns a no-stock signal when substitute recommendation is needed.

### Recommendation Agent
File: `src/agents/recommendationAgent.ts`

Responsibilities:
- Finds a substitute SKU from the mock substitution matrix.
- Calculates margin impact.
- Returns a recommendation reason suitable for UI display.

### Planogram Agent
File: `src/agents/planogramAgent.ts`

Responsibilities:
- Reviews current shelf facings.
- Suggests facing increase when stockout risk is HIGH or MEDIUM.

### Task Orchestrator Agent
File: `src/agents/taskOrchestratorAgent.ts`

Responsibilities:
- Sorts tasks by priority.
- Updates task status.

### Shelf Intelligence Orchestrator
File: `src/agents/orchestrator.ts`

Responsibilities:
- Coordinates the smaller agents.
- Produces dashboard-ready and SKU-ready JSON payloads.

## 4. API Endpoints Included

| Endpoint | Method | Purpose |
|---|---:|---|
| `/api/dashboard?storeId=102` | GET | Dashboard KPIs, top risks, and tasks |
| `/api/forecast` | POST | Forecast SKU stockout risk |
| `/api/recommend-substitute` | POST | Recommend substitute SKU |
| `/api/create-task` | POST | Create replenishment task |
| `/api/update-task` | POST | Update task status |
| `/api/sku/[skuId]` | GET | Full SKU flow output |
| `/api/planogram-insight` | POST | Shelf-facing recommendation |

## 5. How to Add This to Your Existing Vercel / Next.js App

### Step 1 — Copy files into your repository

Copy these folders into your existing Shelf Intelligence repo:

```text
src/agents
src/data
src/types
app/api
openapi.yaml
```

If your project uses the Next.js `pages/api` router instead of the `app/api` router, convert each `route.ts` file into a normal API handler.

### Step 2 — Test API locally

Run your app locally:

```bash
npm install
npm run dev
```

Test in browser:

```text
/api/dashboard?storeId=102
/api/sku/CHIPS_A
```

Test POST endpoints using Postman, Bruno, Thunder Client, or curl.

Example:

```bash
curl -X POST http://localhost:3000/api/forecast \
  -H "Content-Type: application/json" \
  -d '{"storeId":"102","skuId":"CHIPS_A"}'
```

### Step 3 — Connect UI components

Example React call:

```ts
const response = await fetch("/api/dashboard?storeId=102");
const dashboard = await response.json();
setDashboard(dashboard);
```

For SKU detail:

```ts
const response = await fetch("/api/sku/CHIPS_A");
const skuDetails = await response.json();
setSkuDetails(skuDetails);
```

## 6. How to Wire into Copilot Studio

### Step 1 — Publish your Vercel app

Deploy the app so the API endpoints are available through HTTPS.

Example:

```text
https://your-domain.vercel.app/api/forecast
```

### Step 2 — Update `openapi.yaml`

Change the server URL:

```yaml
servers:
  - url: https://your-domain.vercel.app
```

### Step 3 — Create a Copilot Studio agent

Create an agent named:

```text
Shelf Intelligence Agent
```

Suggested instructions:

```text
You are the Shelf Intelligence Agent for retail store operations.
You help users understand stockout risk, replenishment tasks, substitute recommendations, and shelf allocation insights.
Always use the connected API tools for SKU, inventory, task, and dashboard information.
Do not invent stock levels, margins, or recommendations.
If a tool returns no data, explain that the data is unavailable.
Keep responses concise and action-oriented.
```

### Step 4 — Add a REST API tool

Use `openapi.yaml` as the API definition.

Recommended tool descriptions:

- `getDashboardSummary`: Use when the user asks for store overview, KPIs, top risks, or dashboard summary.
- `forecastSkuRisk`: Use when the user asks whether a SKU will run out.
- `recommendSubstitute`: Use when an item is unavailable and the user needs alternatives.
- `createReplenishmentTask`: Use when the user asks to assign or create a replenishment task.
- `updateTaskStatus`: Use when the user wants to mark a task as started, completed, or escalated.
- `getPlanogramInsight`: Use when the user asks about shelf facings or shelf-space optimization.

### Step 5 — Test prompts

```text
Show the high-risk SKUs for Store 102.
Why is Chips A high risk?
Recommend a substitute for Chips A.
Create a replenishment task for Chips A in Store 102.
What shelf-space change should we make for Chips A?
```

## 7. How to Wire into Azure AI Foundry Agent Service

### Step 1 — Create / open a Foundry project

Use a deployed model suitable for tool calling.

### Step 2 — Add OpenAPI tool

Upload or reference `openapi.yaml`.

### Step 3 — Configure authentication

For demo:

- Anonymous may be acceptable if the endpoint uses only mock data.

For enterprise:

- Use API key, OAuth, or managed identity.
- Place Azure API Management in front of the API.
- Enforce RBAC and logging.

### Step 4 — Create agent instructions

```text
You are the Shelf Intelligence Orchestrator.
Use tools to retrieve store dashboard data, forecast SKU risk, recommend substitutes, create replenishment tasks, update tasks, and generate planogram insights.
When a SKU is high risk, first explain the runout forecast, then recommend replenishment.
If no backroom stock is available, recommend a substitute.
Do not hallucinate SKU, inventory, or margin data.
Return structured, concise outputs that can be displayed in a dashboard.
```

### Step 5 — Backend integration pattern

Your Vercel UI should call your own API, and your API can call the Foundry agent if you want the agent to handle orchestration.

```text
Vercel UI → /api/dashboard → Foundry Agent → Shelf API tools → JSON response
```

For the current demo, the included local orchestrator already performs agent-like orchestration. You can replace the local `runDashboardFlow` and `runSkuFlow` calls later with calls to the Foundry Agent Service.

## 8. UX Integration Tips

### Dashboard
Use `/api/dashboard` to populate:

- OOS Rate
- Revenue Protected
- Active Tasks
- Margin Impact
- Top At-Risk SKUs
- Task board

### SKU Detail
Use `/api/sku/CHIPS_A` to populate:

- Sales velocity
- Runout forecast
- Restock recommendation
- Substitute recommendation
- Planogram insight

### Task Board
Use `/api/create-task` and `/api/update-task` for:

- Accept task
- Mark in progress
- Complete task
- Escalate task

## 9. Security Notes

For demo, mock data is acceptable.

For enterprise use:

- Do not expose POS, inventory, or planogram databases directly to mobile or browser clients.
- Put an API layer between UI and data.
- Use OAuth, JWT, RBAC, API gateway policies, and audit logs.
- Avoid storing secrets in frontend code.
- Use server-side environment variables.

## 10. Demo Narrative

Use this explanation during presentation:

> The UI is powered by agent APIs. The Demand Forecast Agent detects stockout risk, the Replenishment Agent checks stock availability, the Recommendation Agent suggests substitutes, the Planogram Agent recommends shelf-space changes, and the Task Orchestrator Agent coordinates actions. Mobile associates execute tasks, while desktop managers monitor KPIs and decisions.

## 11. Next Upgrade

Replace mock data with live integrations:

```text
Mock POS → Real POS API
Mock inventory → ERP / inventory API
Mock planogram → Space planning database
Mock tasks → Store execution task system
```
