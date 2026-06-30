# Testing Guide - Dynamic Inventory System

## Test Scenario: Critical Stockout Resolution

### Initial State (Before Task)
- **Product**: Premium Chips A (CHIPS_A)
- **Current Stock**: 34 units (CRITICAL ⚠️)
- **Backroom Stock**: 45 units available
- **Sales Velocity**: 10.98 units/hour (65% promotion lift)
- **Predicted Runout**: ~3 hours
- **Risk Level**: CRITICAL
- **Task**: T001 - Restock 40 units

### Expected Flow

1. **Desktop Dashboard View**
   - Shows CHIPS_A in critical risk table
   - Red alert banner: "Critical stockout in 3h"
   - Current stock: 34 units
   - Recommended action: Restock immediately

2. **Click "View Details"**
   - Opens SKU Detail page for CHIPS_A
   - Shows:
     - Current stock: 34 units  
     - Backroom: 45 units
     - Promotion: BOGO active (65% lift)
     - Stockout prediction: 3 hours

3. **Switch to Mobile View**
   - Mobile Dashboard shows pending task T001
   - Task priority: Critical
   - Estimated time: 15 minutes

4. **Complete Restock Task**
   - Step 1: Review task details
   - Step 2: Set quantity (default 40 units)
   - Step 3: Verify and complete
   - API calls:
     - POST /api/update-task (status: completed)
     - Triggers inventory update automatically

5. **Inventory Update (Automatic)**
   ```
   Before: currentStock=34, backroomStock=45
   Action: Move 40 units from backroom to shelf
   After:  currentStock=74, backroomStock=5
   ```

6. **Success Screen**
   - Shows: "Inventory replenished - New total: 74 units"
   - Business impact displayed
   - Auto-redirect to dashboard after 5 seconds

7. **Return to Desktop Dashboard**
   - Dashboard refreshes automatically
   - Risk assessment recalculated:
     - 74 units / 10.98 units/hour = 6.7 hours
     - Risk Level: MEDIUM or LOW ✅
   - CHIPS_A should either:
     - **Show as MEDIUM** (if 6.7h < 8h threshold)
     - **Be removed from critical table** (if only showing CRITICAL)
   - Task T001 moved to completed tasks

### After Task Completion

**Expected Dashboard State:**
- ✅ CHIPS_A stock updated to 74 units
- ✅ Risk level downgraded (CRITICAL → MEDIUM/LOW)
- ✅ Critical alert cleared or reduced
- ✅ Task T001 no longer in active tasks
- ✅ Data persisted to warehouse.json

### Verification Steps

```bash
# 1. Check inventory was updated
curl http://localhost:3000/api/sku/CHIPS_A?storeId=102
# Should show: currentStock=74, backroomStock=5

# 2. Check forecast risk level
curl -X POST http://localhost:3000/api/forecast \
  -H "Content-Type: application/json" \
  -d '{"storeId":"102","skuId":"CHIPS_A"}'
# Should show: riskLevel="MEDIUM" or "LOW"

# 3. Check dashboard data
curl http://localhost:3000/api/dashboard?storeId=102
# topRisks array should have:
# - CHIPS_A with 74 units and lower risk
# - Or CHIPS_A removed from list entirely
```

## Substitution Test Scenario

### When Backroom Stock is Empty

1. **Initial State**:
   - CHIPS_A: 34 units, backroom=0
   - CHIPS_B: 67 units, backroom=24

2. **Task Attempt**:
   - Restock task fails (no backroom stock)
   - System triggers substitution workflow

3. **Substitution Screen**:
   - Recommends CHIPS_B as substitute
   - Shows: 78% acceptance rate, +10% margin
   - User approves substitution

4. **Substitution Effect**:
   - CHIPS_B moved to prominent display
   - Inventory allocation changed
   - Task created for CHIPS_B setup

5. **Expected Result**:
   - CHIPS_A still shows low stock
   - But revenue risk mitigated by substitute
   - Dashboard shows substitution active

## Risk Level Thresholds

```
CRITICAL: ≤ 4 hours until stockout
HIGH:     ≤ 8 hours until stockout  
MEDIUM:   ≤ 24 hours until stockout
LOW:      > 24 hours until stockout
```

## Current Test Data

**Promotion Impact:**
- Base sales: ~6.65 units/hour
- With promotion: 10.98 units/hour (65% increase)
- Weekend surge expected

**Stock Levels After 40-Unit Restock:**
- Shelf: 74 units (34 + 40)
- Backroom: 5 units (45 - 40)
- Total: 79 units
- Runout time: ~6.7 hours
- **Result**: Should show as MEDIUM risk ✅

## Troubleshooting

### Issue: Risk still shows CRITICAL after task
**Cause**: Sales velocity is extremely high
**Solution**: Increase restock quantity or reduce promotion lift

### Issue: Inventory not updating
**Check**:
1. Browser console for API errors
2. warehouse.json file for changes
3. Task has correct SKU and quantity

### Issue: Dashboard not refreshing
**Solution**:
1. Force refresh (Ctrl+R)
2. Check refreshKey is incrementing
3. Verify API returns updated data

## Expected Test Results

✅ Task completion updates inventory
✅ Risk assessment recalculates automatically
✅ Dashboard shows current stock levels
✅ Critical warnings cleared when risk reduced
✅ Data persists across server restarts
✅ Substitution workflow creates proper tasks
✅ All changes visible in real-time

## Demo Tips

1. **Start Fresh**: Reset inventory to initial state (34 units)
2. **Show Critical State**: Emphasize the red alerts
3. **Mobile Handoff**: Demonstrate seamless desktop→mobile transition
4. **Completion Animation**: Let success screen fully display
5. **Dashboard Refresh**: Show the updated risk status
6. **Emphasize Impact**: Point out revenue protected, risk reduced
