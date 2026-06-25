import { Product, Branch, Quotation, Order, Expense, InventoryLog, User, Customer, PriceHistory, CatalogFile } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_BRANCHES,
  INITIAL_QUOTATIONS,
  INITIAL_ORDERS,
  INITIAL_EXPENSES,
  INITIAL_INVENTORY_LOGS,
  INITIAL_CUSTOMERS,
  INITIAL_PRICE_HISTORY,
  INITIAL_USERS,
  INITIAL_CATALOGS
} from '../data/mockData';

export function initializeDatabase() {
  if (typeof window === 'undefined') return;

  const checkAndSet = (key: string, initialData: any) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(initialData));
    }
  };

  checkAndSet('mgg_products', INITIAL_PRODUCTS);
  checkAndSet('mgg_branches', INITIAL_BRANCHES);

  // Auto-migrate old branches to Attapur, Uppal, and Sangareddy
  const storedBranches = localStorage.getItem('mgg_branches');
  if (storedBranches && (storedBranches.includes('Nampally') || !storedBranches.includes('Attapur'))) {
    localStorage.setItem('mgg_branches', JSON.stringify(INITIAL_BRANCHES));
  }

  checkAndSet('mgg_quotations', INITIAL_QUOTATIONS);
  checkAndSet('mgg_orders', INITIAL_ORDERS);
  checkAndSet('mgg_expenses', INITIAL_EXPENSES);
  checkAndSet('mgg_inventory_logs', INITIAL_INVENTORY_LOGS);
  checkAndSet('mgg_customers', INITIAL_CUSTOMERS);
  checkAndSet('mgg_price_history', INITIAL_PRICE_HISTORY);
  checkAndSet('mgg_users', INITIAL_USERS);
  checkAndSet('mgg_catalogs', INITIAL_CATALOGS);
}

// Call immediately upon import so data is migrated before components render
if (typeof window !== 'undefined') {
  initializeDatabase();
}

// Low-level Getters & Setters
export function getData<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : [];
}

export function setData<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// CRUD for Products
export function getProducts(): Product[] {
  return getData<Product>('mgg_products');
}

export function saveProducts(products: Product[]): void {
  setData<Product>('mgg_products', products);
}

// CRUD for Branches
export function getBranches(): Branch[] {
  return getData<Branch>('mgg_branches');
}

export function saveBranches(branches: Branch[]): void {
  setData<Branch>('mgg_branches', branches);
}

// CRUD for Quotations
export function getQuotations(): Quotation[] {
  return getData<Quotation>('mgg_quotations');
}

export function saveQuotations(quotes: Quotation[]): void {
  setData<Quotation>('mgg_quotations', quotes);
}

// CRUD for Orders
export function getOrders(): Order[] {
  return getData<Order>('mgg_orders');
}

export function saveOrders(orders: Order[]): void {
  setData<Order>('mgg_orders', orders);
}

// CRUD for Expenses
export function getExpenses(): Expense[] {
  return getData<Expense>('mgg_expenses');
}

export function saveExpenses(expenses: Expense[]): void {
  setData<Expense>('mgg_expenses', expenses);
}

// CRUD for Inventory Logs
export function getInventoryLogs(): InventoryLog[] {
  return getData<InventoryLog>('mgg_inventory_logs');
}

export function saveInventoryLogs(logs: InventoryLog[]): void {
  setData<InventoryLog>('mgg_inventory_logs', logs);
}

// CRUD for Customers
export function getCustomers(): Customer[] {
  return getData<Customer>('mgg_customers');
}

export function saveCustomers(customers: Customer[]): void {
  setData<Customer>('mgg_customers', customers);
}

// CRUD for Price History
export function getPriceHistory(): PriceHistory[] {
  return getData<PriceHistory>('mgg_price_history');
}

export function savePriceHistory(history: PriceHistory[]): void {
  setData<PriceHistory>('mgg_price_history', history);
}

// Catalogs
export function getCatalogs(): CatalogFile[] {
  return getData<CatalogFile>('mgg_catalogs');
}

export function saveCatalogs(catalogs: CatalogFile[]): void {
  setData<CatalogFile>('mgg_catalogs', catalogs);
}
