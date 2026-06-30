import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../src/data/serverDatabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, skuId, currentStock, backroomStock, action, quantity } = body;

    if (!storeId || !skuId) {
      return NextResponse.json(
        { error: 'storeId and skuId are required' },
        { status: 400 }
      );
    }

    let updates: any = {};

    if (action === 'restock' && quantity) {
      // Move inventory from backroom to shelf
      const product = db.getProduct(skuId, storeId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${skuId} not found` },
          { status: 404 }
        );
      }

      const currentBackroom = product.backroomStock || 0;
      const currentShelf = product.currentStock || 0;
      
      // Calculate new values
      const restockQuantity = Math.min(quantity, currentBackroom);
      const newBackroomStock = currentBackroom - restockQuantity;
      const newShelfStock = currentShelf + restockQuantity;

      updates = {
        currentStock: newShelfStock,
        backroomStock: newBackroomStock,
      };
    } else if (currentStock !== undefined || backroomStock !== undefined) {
      // Direct stock update
      if (currentStock !== undefined) updates.currentStock = currentStock;
      if (backroomStock !== undefined) updates.backroomStock = backroomStock;
    }

    // Update the inventory
    db.updateInventory(storeId, skuId, updates);

    // Return updated product info
    const updatedProduct = db.getProduct(skuId, storeId);

    return NextResponse.json({
      success: true,
      message: 'Inventory updated successfully',
      product: updatedProduct,
      updates,
      metadata: {
        timestamp: new Date().toISOString(),
        storeId,
        skuId,
        action: action || 'update'
      }
    });

  } catch (error) {
    console.error('Inventory update error:', error);
    return NextResponse.json(
      { error: `Inventory update failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}