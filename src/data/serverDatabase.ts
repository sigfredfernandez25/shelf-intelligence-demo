import fs from 'fs';
import path from 'path';
import { 
  Store, 
  Product, 
  StockRisk, 
  Task, 
  Substitution, 
  KPIs,
  Alert,
  Promotion 
} from '../types';

// Type definitions for JSON data structures
interface WarehouseData {
  stores: Store[];
  products: Product[];
  inventory: any[];
  substitutionMatrix: Substitution[];
}

interface PosData {
  salesHistory: Record<string, any[]>;
  inventoryHistory: Record<string, any[]>;
  transactions: any[];
}

interface PromotionData {
  activePromotions: Promotion[];
  scheduledPromotions: Promotion[];
  expiredPromotions: Promotion[];
  promotionTemplates: any[];
}

interface TaskData {
  activeTasks: Task[];
  completedTasks: Task[];
  taskTemplates: any[];
  employees: any[];
}

interface PlanogramData {
  storeLayouts: any[];
  planogramData: any[];
  categoryPerformance: any[];
  shelfOptimization: any[];
  competitorBenchmarks: any[];
}

class DatabaseManager {
  private warehouseData: WarehouseData | null = null;
  private posData: PosData | null = null;
  private promotionData: PromotionData | null = null;
  private taskData: TaskData | null = null;
  private planogramData: PlanogramData | null = null;

  private getDataPath(filename: string): string {
    return path.join(process.cwd(), 'src', 'data', filename);
  }

  private loadJsonFile<T>(filename: string): T {
    try {
      const filePath = this.getDataPath(filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent) as T;
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      throw new Error(`Failed to load ${filename}: ${error}`);
    }
  }

  private saveJsonFile<T>(filename: string, data: T): void {
    try {
      const filePath = this.getDataPath(filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Error saving ${filename}:`, error);
      throw new Error(`Failed to save ${filename}: ${error}`);
    }
  }

  // Warehouse/Inventory operations
  getWarehouseData(): WarehouseData {
    if (!this.warehouseData) {
      this.warehouseData = this.loadJsonFile<WarehouseData>('warehouse.json');
    }
    return this.warehouseData;
  }

  getProduct(skuId: string, storeId: string = '102'): Product | undefined {
    const data = this.getWarehouseData();
    const product = data.products.find(p => p.id === skuId);
    
    if (!product) return undefined;

    // Get inventory data for this store
    const inventory = this.getInventory(storeId, skuId);
    
    // Get promotion data
    const promotion = this.getPromotionForProduct(skuId);
    
    // Merge data into product
    const enrichedProduct: Product = {
      ...product,
      currentStock: inventory?.currentStock || 0,
      backroomStock: inventory?.backroomStock || 0,
      shelfCapacity: inventory?.shelfCapacity || 48,
      promotion: promotion ? {
        ...promotion,
        // Legacy compatibility
        active: promotion.status === 'active',
        lift: promotion.metrics?.lift || 0
      } : undefined
    };

    return enrichedProduct;
  }

  getProducts(storeId: string = '102'): Product[] {
    const data = this.getWarehouseData();
    
    return data.products.map(product => {
      // Get inventory data for this store
      const inventory = this.getInventory(storeId, product.id);
      
      // Get promotion data
      const promotion = this.getPromotionForProduct(product.id);
      
      return {
        ...product,
        currentStock: inventory?.currentStock || 0,
        backroomStock: inventory?.backroomStock || 0,
        shelfCapacity: inventory?.shelfCapacity || 48,
        promotion: promotion ? {
          ...promotion,
          // Legacy compatibility
          active: promotion.status === 'active',
          lift: promotion.metrics?.lift || 0
        } : undefined
      };
    });
  }

  getStore(storeId: string): Store | undefined {
    const data = this.getWarehouseData();
    return data.stores.find(s => s.id === storeId);
  }

  getStores(): Store[] {
    const data = this.getWarehouseData();
    return data.stores;
  }

  getInventory(storeId: string, skuId?: string) {
    const data = this.getWarehouseData();
    const inventory = data.inventory.filter(i => i.storeId === storeId);
    return skuId ? inventory.find(i => i.skuId === skuId) : inventory;
  }

  updateInventory(storeId: string, skuId: string, updates: any): void {
    const data = this.getWarehouseData();
    const inventoryIndex = data.inventory.findIndex(i => 
      i.storeId === storeId && i.skuId === skuId
    );
    
    if (inventoryIndex !== -1) {
      data.inventory[inventoryIndex] = {
        ...data.inventory[inventoryIndex],
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      this.warehouseData = data;
      this.saveJsonFile('warehouse.json', data);
    }
  }

  getSubstitution(skuId: string): Substitution | undefined {
    const data = this.getWarehouseData();
    return data.substitutionMatrix.find(s => s.originalSKU === skuId && s.active);
  }

  // POS operations
  getPosData(): PosData {
    if (!this.posData) {
      this.posData = this.loadJsonFile<PosData>('pos.json');
    }
    return this.posData;
  }

  getSalesHistory(skuId: string): number[] {
    const data = this.getPosData();
    const history = data.salesHistory[skuId] || [];
    return history.map(h => h.units);
  }

  getInventoryHistory(skuId: string): number[] {
    const data = this.getPosData();
    const history = data.inventoryHistory[skuId] || [];
    return history.map(h => h.stock);
  }

  addTransaction(transaction: any): void {
    const data = this.getPosData();
    data.transactions.push(transaction);
    this.posData = data;
    this.saveJsonFile('pos.json', data);
  }

  // Promotion operations
  getPromotionData(): PromotionData {
    if (!this.promotionData) {
      this.promotionData = this.loadJsonFile<PromotionData>('promotions.json');
    }
    return this.promotionData;
  }

  getActivePromotions(storeId?: string, skuId?: string): Promotion[] {
    const data = this.getPromotionData();
    let promotions = data.activePromotions.filter(p => p.status === 'active');
    
    if (storeId) {
      promotions = promotions.filter(p => 
        p.storeIds?.includes(storeId) || !p.storeIds
      );
    }
    
    if (skuId) {
      promotions = promotions.filter(p => 
        p.skuId === skuId || p.skuIds?.includes(skuId)
      );
    }
    
    return promotions;
  }

  getPromotionForProduct(skuId: string): Promotion | null {
    const promotions = this.getActivePromotions(undefined, skuId);
    return promotions.length > 0 ? promotions[0] : null;
  }

  // Task operations
  getTaskData(): TaskData {
    if (!this.taskData) {
      this.taskData = this.loadJsonFile<TaskData>('tasks.json');
    }
    return this.taskData;
  }

  getTasks(status?: string): Task[] {
    const data = this.getTaskData();
    const allTasks = status === 'completed' ? data.completedTasks : data.activeTasks;
    return status ? allTasks.filter(t => t.status === status) : allTasks;
  }

  getTasksBySKU(skuId: string): Task[] {
    const data = this.getTaskData();
    return data.activeTasks.filter(t => t.sku === skuId);
  }

  getTasksByStore(storeId: string): Task[] {
    const data = this.getTaskData();
    return data.activeTasks.filter(t => t.storeId === storeId);
  }

  addTask(task: Task): void {
    const data = this.getTaskData();
    data.activeTasks.push(task);
    this.taskData = data;
    this.saveJsonFile('tasks.json', data);
  }

  updateTask(taskId: string, updates: Partial<Task>): Task | undefined {
    const data = this.getTaskData();
    const taskIndex = data.activeTasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
      data.activeTasks[taskIndex] = {
        ...data.activeTasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      // Move completed tasks to completed array
      if (updates.status === 'completed') {
        const completedTask = data.activeTasks.splice(taskIndex, 1)[0];
        data.completedTasks.push(completedTask);
      }
      
      this.taskData = data;
      this.saveJsonFile('tasks.json', data);
      return data.activeTasks[taskIndex];
    }
    
    return undefined;
  }

  generateTaskId(): string {
    const data = this.getTaskData();
    const allTaskCount = data.activeTasks.length + data.completedTasks.length;
    return `T${String(allTaskCount + 1).padStart(3, '0')}`;
  }

  getEmployees(): any[] {
    const data = this.getTaskData();
    return data.employees;
  }

  // Planogram operations
  getPlanogramData(): PlanogramData {
    if (!this.planogramData) {
      this.planogramData = this.loadJsonFile<PlanogramData>('planogram.json');
    }
    return this.planogramData;
  }

  getPlanogramInfo(skuId: string, storeId: string = '102') {
    const data = this.getPlanogramData();
    return data.planogramData.find(p => 
      p.skuId === skuId && p.storeId === storeId
    );
  }

  getCategoryPerformance(category: string, storeId: string = '102') {
    const data = this.getPlanogramData();
    return data.categoryPerformance.find(c => 
      c.category === category && c.storeId === storeId
    );
  }

  updatePlanogramData(storeId: string, skuId: string, updates: any): void {
    const data = this.getPlanogramData();
    const planogramIndex = data.planogramData.findIndex(p => 
      p.storeId === storeId && p.skuId === skuId
    );
    
    if (planogramIndex !== -1) {
      data.planogramData[planogramIndex] = {
        ...data.planogramData[planogramIndex],
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      this.planogramData = data;
      this.saveJsonFile('planogram.json', data);
    }
  }

  // Utility methods for compatibility with existing code
  get products() {
    return this.getProducts();
  }

  get mockTasks() {
    return this.getTasks();
  }
}

// Singleton instance
const db = new DatabaseManager();

// Export functions for backward compatibility
export const getProduct = (skuId: string, storeId?: string) => db.getProduct(skuId, storeId);
export const getProducts = (storeId?: string) => db.getProducts(storeId);
export const getStore = (storeId: string) => db.getStore(storeId);
export const getStores = () => db.getStores();
export const getSalesHistory = (skuId: string) => db.getSalesHistory(skuId);
export const getInventoryHistory = (skuId: string) => db.getInventoryHistory(skuId);
export const getSubstitution = (skuId: string) => db.getSubstitution(skuId);
export const getPlanogramData = (skuId: string) => db.getPlanogramInfo(skuId);
export const addTask = (task: Task) => db.addTask(task);
export const updateTask = (taskId: string, updates: Partial<Task>) => db.updateTask(taskId, updates);
export const generateTaskId = () => db.generateTaskId();
export const getTasksBySKU = (skuId: string) => db.getTasksBySKU(skuId);
export const getTasksByStore = (storeId: string) => db.getTasksByStore(storeId);
export const getTasks = (status?: string) => db.getTasks(status);

// Export additional properties for compatibility
export const products = db.getProducts();
export const mockTasks = db.getTasks();

// Export database instance for advanced usage
export default db;