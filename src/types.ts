export type VehicleCategory =
  | 'Front Windshields'
  | 'Rear Windshields'
  | 'Door Glasses'
  | 'Quarter Glasses'
  | 'Sunroof Glass'
  | 'Side Mirrors'
  | 'Rear View Mirrors'
  | 'Truck Glass'
  | 'Bus Glass';

export interface Product {
  id: string;
  name: string;
  category: VehicleCategory;
  brand: string; // e.g., Hyundai, Toyota
  model: string; // e.g., i20, Fortuner
  year: string;  // e.g., 2020-2024
  sku: string;
  description: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  branchStock: Record<string, number>; // branchId -> stock
  warranty: string; // e.g., "1 Year Leakage Warranty"
  imageUrl: string;
  available: boolean;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  manager: string;
  hours: string;
  mapEmbedUrl: string;
}

export type QuotationStatus = 'pending' | 'approved' | 'converted' | 'rejected';

export interface Quotation {
  id: string;
  customerName: string;
  phone: string;
  whatsapp: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  requiredGlassType: VehicleCategory;
  imageUrl?: string;
  status: QuotationStatus;
  notes: string;
  date: string;
  totalAmount: number;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'razorpay';

export interface Order {
  id: string;
  quotationId?: string;
  customerName: string;
  phone: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  orderDate: string;
  totalAmount: number;
  taxAmount: number; // GST 18% included
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  invoiceNumber: string;
  notes?: string;
}

export interface Expense {
  id: string;
  category: string; // e.g., Rent, Salaries, Transport, Consumables
  description: string;
  amount: number;
  date: string;
  payee: string;
  branchId: string;
  paymentMethod: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  type: 'stock_in' | 'stock_out' | 'transfer';
  quantity: number;
  branchId: string;
  date: string;
  reason: string;
  user: string;
}

export type UserRole = 'Admin' | 'Accountant' | 'BranchManager' | 'SalesExecutive';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  branchId: string;
  email: string;
  avatar: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicles: {
    brand: string;
    model: string;
    year: string;
  }[];
  serviceHistory: {
    id: string;
    date: string;
    type: string;
    cost: number;
    notes: string;
  }[];
  notes: string;
}

export interface PriceHistory {
  id: string;
  productId: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
  updatedAt: string;
  updatedBy: string;
}

export interface CatalogFile {
  id: string;
  title: string;
  category: string;
  updatedAt: string;
  pdfUrl: string;
}
