# Dynamic Inventory Update System

## Overview
The Shelf Intelligence application now uses a **JSON-based dynamic database** that updates in real-time when tasks are completed. All inventory changes persist to JSON files and are reflected immediately through the API.

## System Architecture

### JSON Database Files
Located in `src/data/`:

1. **warehouse.json** - Products, inventory levels, stores, substitutions
2. **pos.json** - Sales history, inventory history, transactions  
3. **promotions.json** - Active/scheduled/expired promotions
4. **tasks.json** - Active tasks, completed tasks, employees
5. **planogram.json** - Store layouts, shelf optimization data

### API Endpoints

#### Inventory Management
- **POST /api/inventory/update** - Direct inventory updates
  ```json
  {
    "storeId": "102",
    "skuId": "CHIPS_A",
    "action": "restock",
    "quantity": 20
  }
  ```

#### Task Management  
- **POST /api/update-task** - Complete tasks (auto-updates inventory)
  ```json
  {
    "taskId": "T001",
    "status": "completed",
    "notes": "Restocked 20 units"
  }
  ```

#### Data Retrieval
- **GET /api/dashboard?storeId=102** - Real-time dashboard data with updated inventory
- **GET /api/sku/{skuId}?storeId=102** - Product details with current stock levels

## How Inventory Updates Work

### When a Task is Completed:

1. **Mobile Associate** completes restock task
2. **API Call** to `/api/update-task` with status="completed"
3. **Inventory Update** automatically triggered:
   - Reads current inventory from warehouse.json
   - Moves quantity from backroom to shelf
   - Updates warehouse.json file
4. **Dashboard Refresh** shows updated stock levels
5. **Risk Assessment** recalculated based on new stock

### Example Flow:

**Initial State:**
```json
{
  "storeId": "102",
  "skuId": "CHIPS_A",
  "currentStock": 34,
  "backroomStock": 25
}
```

**After Restocking 20 Units:**
```json
{
  "storeId": "102",
  "skuId": "CHIPS_A",
  "currentStock": 54,  // +20
  "backroomStock": 5,  // -20
  "lastUpdated": "2026-06-30T07:33:29.652Z"
}
```

## Testing Inventory Updates

### Via API:
```bash
# 1. Add backroom stock
curl -X POST http://localhost:3000/api/inventory/update \
  -H "Content-Type: application/json" \
  -d '{"storeId":"102","skuId":"CHIPS_A","backroomStock":25,"action":"update"}'

# 2. Perform restock
curl -X POST http://localhost:3000/api/inventory/update \
  -H "Content-Type: application/json" \
  -d '{"storeId":"102","skuId":"CHIPS_A","action":"restock","quantity":20}'

# 3. Check updated inventory
curl http://localhost:3000/api/sku/CHIPS_A?storeId=102
```

### Via UI:
1. **Desktop**: View critical stockout alert
2. **Switch to Mobile**: Complete restock task
3. **Task Completion**: Moves 20 units from backroom to shelf
4. **Return to Desktop**: Dashboard shows updated stock (54 units)
5. **Risk Status**: Critical warning removed

## Current Inventory Levels

After testing, current CHIPS_A inventory:
- **Shelf Stock**: 54 units (was 34, added 20)
- **Backroom**: 5 units (was 25, used 20)
- **Total**: 59 units available
- **Capacity**: 48 units (shelf is over capacity)

## Data Persistence

All changes are persisted to JSON files:
- ✅ Inventory updates saved to `warehouse.json`
- ✅ Task completions saved to `tasks.json`
- ✅ Updates include timestamps
- ✅ Data survives server restarts

## Dashboard Real-Time Updates

The dashboard now:
- ✅ Fetches fresh data from API on load
- ✅ Refreshes when returning from mobile tasks
- ✅ Shows real-time stock levels
- ✅ Recalculates risk based on updated inventory
- ✅ Updates KPIs dynamically

## Troubleshooting

### Stock Not Updating in UI:
- **Solution**: Dashboard fetches from API on load/refresh
- **Verify**: Check browser console for API calls
- **Fix**: Force refresh with Ctrl+R or use refreshKey prop

### Task Completion Not Updating Inventory:
- **Check**: Task must have `type: "restock"` and `quantity` field
- **Check**: Backroom stock must be > 0
- **Verify**: Check warehouse.json file directly

### API Errors:
- **500 Error**: Check server logs for details
- **404 Error**: Verify SKU ID exists in warehouse.json
- **No Data**: Ensure JSON files have proper structure

## Future Enhancements

Planned improvements:
- [ ] WebSocket for real-time updates without refresh
- [ ] Transaction history log for audit trail
- [ ] Rollback capability for incorrect updates
- [ ] Bulk inventory import/export
- [ ] Integration with real ERP/WMS systems

## File Structure

```
src/data/
├── warehouse.json      # Inventory master data
├── pos.json           # Sales transactions
├── promotions.json    # Active promotions
├── tasks.json         # Task management
├── planogram.json     # Shelf layouts
└── serverDatabase.ts  # Database access layer
```

## API Response Format

All APIs return consistent metadata:
```json
{
  "success": true,
  "product": { /* updated product data */ },
  "metadata": {
    "timestamp": "2026-06-30T07:33:29.652Z",
    "storeId": "102",
    "skuId": "CHIPS_A",
    "action": "restock"
  }
}
```

## Notes

- JSON files are the source of truth
- Updates are synchronous (no race conditions)
- All timestamps are ISO 8601 format
- Stock cannot go negative (validated)
- Shelf capacity limits are enforced
