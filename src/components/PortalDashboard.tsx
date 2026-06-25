import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, ShoppingCart, FileSpreadsheet, Percent, LayoutDashboard,
  Box, Tag, FileText, ClipboardList, Settings, Landmark, Landmark as Bank, Plus, Edit, Trash, 
  MapPin, CheckCircle, Clock, AlertCircle, Share2, Mail, ArrowRight, Download, Send, RefreshCw, 
  Search, Shield, DollarSign, ArrowUpRight, ArrowDownRight, Printer, Check, X, FileImage
} from 'lucide-react';
import { Product, Branch, Quotation, Order, Expense, InventoryLog, User, Customer, PriceHistory, CatalogFile, VehicleCategory } from '../types';
import { 
  getProducts, saveProducts, getBranches, saveBranches, getQuotations, saveQuotations,
  getOrders, saveOrders, getExpenses, saveExpenses, getInventoryLogs, saveInventoryLogs,
  getCustomers, saveCustomers, getPriceHistory, savePriceHistory, getCatalogs, saveCatalogs 
} from '../utils/storage';
import RazorpayModal from './RazorpayModal';
import PDFViewerModal from './PDFViewerModal';

interface PortalDashboardProps {
  currentUser: User;
  onLogout: () => void;
}

export default function PortalDashboard({ currentUser, onLogout }: PortalDashboardProps) {
  // Databases (Sync state on mount & state updates)
  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [catalogs, setCatalogs] = useState<CatalogFile[]>([]);

  // Selected Sidebar Tab
  const [activeSidebar, setActiveSidebar] = useState('dashboard');

  // Interactive UI modals
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<Order | null>(null);
  const [pdfView, setPdfView] = useState<{ type: 'invoice' | 'quotation' | 'catalog'; data: any } | null>(null);
  
  // Search query states
  const [productSearch, setProductSearch] = useState('');
  const [quoteSearch, setQuoteSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  // Forms / Modals States
  const [showProductModal, setShowProductModal] = useState<Product | 'add' | null>(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showQuoteCreatorModal, setShowQuoteCreatorModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState<Branch | 'add' | null>(null);

  // Bulk / Price adjustment states
  const [bulkPercent, setBulkPercent] = useState('5');
  const [bulkActionType, setBulkActionType] = useState<'increase' | 'decrease'>('increase');

  // Notification Banner
  const [bannerMsg, setBannerMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync state with storage helper on mount
  useEffect(() => {
    setProducts(getProducts());
    setBranches(getBranches());
    setQuotations(getQuotations());
    setOrders(getOrders());
    setExpenses(getExpenses());
    setInventoryLogs(getInventoryLogs());
    setCustomers(getCustomers());
    setPriceHistory(getPriceHistory());
    setCatalogs(getCatalogs());
  }, []);

  const triggerBanner = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setBannerMsg({ text, type });
    setTimeout(() => setBannerMsg(null), 4000);
  };

  // ---------------- HELPER FUNCTIONS & OPERATIONS ----------------

  // Update product state & storage
  const handleSaveProduct = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
  };

  const handleAddOrEditProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const pId = showProductModal && showProductModal !== 'add' ? (showProductModal as Product).id : `p-${Date.now()}`;

    const newProduct: Product = {
      id: pId,
      name: fd.get('name') as string,
      category: fd.get('category') as VehicleCategory,
      brand: fd.get('brand') as string,
      model: fd.get('model') as string,
      year: fd.get('year') as string,
      sku: fd.get('sku') as string,
      description: fd.get('description') as string,
      price: Number(fd.get('price')),
      discountPrice: fd.get('discountPrice') ? Number(fd.get('discountPrice')) : undefined,
      stockQuantity: Number(fd.get('stockQuantity')),
      branchStock: {
        'hyd-main': Number(fd.get('stock-hyd-main') || 0),
        'hyd-gachibowli': Number(fd.get('stock-hyd-gachibowli') || 0),
        'hyd-secunderabad': Number(fd.get('stock-hyd-secunderabad') || 0),
      },
      warranty: fd.get('warranty') as string,
      imageUrl: (fd.get('imageUrl') as string) || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600',
      available: true
    };

    let updatedList: Product[];
    if (showProductModal === 'add') {
      updatedList = [...products, newProduct];
      // Log inventory log for stock in
      const newLog: InventoryLog = {
        id: `log-${Date.now()}`,
        productId: newProduct.id,
        productName: newProduct.name,
        type: 'stock_in',
        quantity: newProduct.stockQuantity,
        branchId: 'hyd-main',
        date: new Date().toISOString(),
        reason: 'Initial stock import / Product registration',
        user: currentUser.name
      };
      const updatedLogs = [...inventoryLogs, newLog];
      setInventoryLogs(updatedLogs);
      saveInventoryLogs(updatedLogs);
      triggerBanner('New Glass Product registered successfully!');
    } else {
      updatedList = products.map((p) => p.id === pId ? newProduct : p);
      
      // Price change history tracking
      const oldProd = showProductModal as Product;
      if (oldProd.price !== newProduct.price) {
        const newHist: PriceHistory = {
          id: `ph-${Date.now()}`,
          productId: pId,
          productName: newProduct.name,
          oldPrice: oldProd.price,
          newPrice: newProduct.price,
          updatedAt: new Date().toISOString(),
          updatedBy: currentUser.name
        };
        const updatedHist = [...priceHistory, newHist];
        setPriceHistory(updatedHist);
        savePriceHistory(updatedHist);
      }
      triggerBanner('Product details updated successfully!');
    }

    handleSaveProduct(updatedList);
    setShowProductModal(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const filtered = products.filter((p) => p.id !== id);
      handleSaveProduct(filtered);
      triggerBanner('Product deleted from inventory.', 'info');
    }
  };

  // Stock In / Out Adjustment Form
  const handleQuickStockAdjustment = (prodId: string, qty: number, type: 'stock_in' | 'stock_out', branch: string) => {
    const updated = products.map((p) => {
      if (p.id === prodId) {
        const currentBranchStock = p.branchStock[branch] || 0;
        const newBranchStock = type === 'stock_in' ? currentBranchStock + qty : Math.max(0, currentBranchStock - qty);
        const diff = newBranchStock - currentBranchStock;
        
        return {
          ...p,
          stockQuantity: Math.max(0, p.stockQuantity + diff),
          branchStock: {
            ...p.branchStock,
            [branch]: newBranchStock
          }
        };
      }
      return p;
    });

    handleSaveProduct(updated);

    // Add movement log
    const targetProduct = products.find(p => p.id === prodId);
    if (targetProduct) {
      const newLog: InventoryLog = {
        id: `log-${Date.now()}`,
        productId: prodId,
        productName: targetProduct.name,
        type,
        quantity: qty,
        branchId: branch,
        date: new Date().toISOString(),
        reason: type === 'stock_in' ? 'Manual stock augmentation' : 'Service usage / Manual reduction',
        user: currentUser.name
      };
      const updatedLogs = [...inventoryLogs, newLog];
      setInventoryLogs(updatedLogs);
      saveInventoryLogs(updatedLogs);
    }

    triggerBanner(`Stock level adjusted for branch: ${branch}`);
  };

  // Bulk Price Management
  const handleBulkPriceUpdate = () => {
    const percent = Number(bulkPercent) / 100;
    const factor = bulkActionType === 'increase' ? 1 + percent : 1 - percent;

    const updated = products.map((p) => {
      const oldPrice = p.price;
      const newPrice = Math.round(p.price * factor);
      
      // Track price changes
      const newHist: PriceHistory = {
        id: `ph-${Date.now()}-${p.id}`,
        productId: p.id,
        productName: p.name,
        oldPrice,
        newPrice,
        updatedAt: new Date().toISOString(),
        updatedBy: `${currentUser.name} (Bulk)`
      };
      priceHistory.push(newHist); // Mutate locally since we'll set state below

      return {
        ...p,
        price: newPrice,
        discountPrice: p.discountPrice ? Math.round(p.discountPrice * factor) : undefined
      };
    });

    handleSaveProduct(updated);
    setPriceHistory([...priceHistory]);
    savePriceHistory(priceHistory);

    triggerBanner(`Bulk prices updated successfully by ${bulkPercent}%!`);
  };

  // Convert Quote request to formal order
  const handleConvertQuoteToOrder = (quote: Quotation) => {
    // Generate invoice number
    const nextInvNo = `MGG-2026-GST-${String(orders.length + 101).padStart(3, '0')}`;
    const preTaxTotal = quote.totalAmount / 1.18;
    const taxAmount = quote.totalAmount - preTaxTotal;

    const newOrder: Order = {
      id: `ORD-2026-${String(orders.length + 101).padStart(3, '0')}`,
      quotationId: quote.id,
      customerName: quote.customerName,
      phone: quote.phone,
      vehicleBrand: quote.vehicleBrand,
      vehicleModel: quote.vehicleModel,
      vehicleYear: quote.vehicleYear,
      orderDate: new Date().toISOString(),
      totalAmount: quote.totalAmount,
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'razorpay', // default simulated portal payment gateway
      items: quote.items,
      invoiceNumber: nextInvNo
    };

    // Update Quotation status to converted
    const updatedQuotes = quotations.map((q) => q.id === quote.id ? { ...q, status: 'converted' as const } : q);
    setQuotations(updatedQuotes);
    saveQuotations(updatedQuotes);

    // Save Order
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    saveOrders(updatedOrders);

    // Deduct stock quantity across the branch stock for each item
    const updatedProducts = products.map((p) => {
      const lineItem = quote.items.find((i) => i.productId === p.id);
      if (lineItem) {
        const branchToDeduct = 'hyd-main'; // Assume default branch for quote fullfillment
        const currentBranchStock = p.branchStock[branchToDeduct] || 0;
        const newBranchStock = Math.max(0, currentBranchStock - lineItem.quantity);
        const actualDeducted = currentBranchStock - newBranchStock;

        // Log stock out movement
        const newLog: InventoryLog = {
          id: `log-${Date.now()}-${p.id}`,
          productId: p.id,
          productName: p.name,
          type: 'stock_out',
          quantity: actualDeducted,
          branchId: branchToDeduct,
          date: new Date().toISOString(),
          reason: `Converted from Quotation ${quote.id}`,
          user: currentUser.name
        };
        inventoryLogs.push(newLog);

        return {
          ...p,
          stockQuantity: Math.max(0, p.stockQuantity - actualDeducted),
          branchStock: {
            ...p.branchStock,
            [branchToDeduct]: newBranchStock
          }
        };
      }
      return p;
    });

    handleSaveProduct(updatedProducts);
    setInventoryLogs([...inventoryLogs]);
    saveInventoryLogs(inventoryLogs);

    // Ensure customer file exists or register service history
    const existingCustIdx = customers.findIndex(c => c.phone === quote.phone);
    if (existingCustIdx > -1) {
      const updatedCust = [...customers];
      updatedCust[existingCustIdx].serviceHistory.push({
        id: `sh-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: `${quote.requiredGlassType} Replacement`,
        cost: quote.totalAmount,
        notes: `Standard replacement completed. Invoice ${nextInvNo}`
      });
      setCustomers(updatedCust);
      saveCustomers(updatedCust);
    } else {
      const newCust: Customer = {
        id: `c-${Date.now()}`,
        name: quote.customerName,
        phone: quote.phone,
        email: `${quote.customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        vehicles: [{ brand: quote.vehicleBrand, model: quote.vehicleModel, year: quote.vehicleYear }],
        serviceHistory: [{
          id: `sh-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: `${quote.requiredGlassType} Replacement`,
          cost: quote.totalAmount,
          notes: `Initial fitting. Invoice ${nextInvNo}`
        }],
        notes: quote.notes
      };
      const updatedCust = [...customers, newCust];
      setCustomers(updatedCust);
      saveCustomers(updatedCust);
    }

    triggerBanner(`Quote successfully converted to active Order: ${newOrder.id}! Stock deducted.`);
    setActiveSidebar('orders');
  };

  // Create customized quotation form submit
  const handleCreateQuotationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const pId = fd.get('productId') as string;
    const selectedProd = products.find(p => p.id === pId);

    if (!selectedProd) return;

    const newQuote: Quotation = {
      id: `Q-2026-${String(quotations.length + 1).padStart(3, '0')}`,
      customerName: fd.get('customerName') as string,
      phone: fd.get('phone') as string,
      whatsapp: fd.get('whatsapp') as string || (fd.get('phone') as string),
      vehicleBrand: selectedProd.brand,
      vehicleModel: selectedProd.model,
      vehicleYear: selectedProd.year,
      requiredGlassType: selectedProd.category,
      status: 'pending',
      notes: fd.get('notes') as string,
      date: new Date().toISOString(),
      totalAmount: selectedProd.discountPrice || selectedProd.price,
      items: [{
        productId: selectedProd.id,
        name: selectedProd.name,
        price: selectedProd.discountPrice || selectedProd.price,
        quantity: 1
      }]
    };

    const updated = [...quotations, newQuote];
    setQuotations(updated);
    saveQuotations(updated);
    setShowQuoteCreatorModal(false);
    triggerBanner('Formal Quotation created successfully!');
  };

  // Add Expense Log submit
  const handleExpenseSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      category: fd.get('category') as string,
      description: fd.get('description') as string,
      amount: Number(fd.get('amount')),
      date: fd.get('date') as string,
      payee: fd.get('payee') as string,
      branchId: fd.get('branchId') as string,
      paymentMethod: fd.get('paymentMethod') as string
    };

    const updated = [...expenses, newExp];
    setExpenses(updated);
    saveExpenses(updated);
    setShowExpenseModal(false);
    triggerBanner('New expense record registered in accountant books.');
  };

  // Add or Edit Branch
  const handleSaveBranchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const bId = showBranchModal && showBranchModal !== 'add' ? (showBranchModal as Branch).id : `hyd-${Date.now()}`;

    const newBranch: Branch = {
      id: bId,
      name: fd.get('name') as string,
      address: fd.get('address') as string,
      phone: fd.get('phone') as string,
      whatsapp: fd.get('whatsapp') as string,
      manager: fd.get('manager') as string,
      hours: fd.get('hours') as string,
      mapEmbedUrl: (fd.get('mapEmbedUrl') as string) || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.1342603881473!2d78.46332147598818!3d17.381373502844814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb977f6b9c8b7f%3A0x6bda19e5d6d87bbd!2sNampally%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1719280000000!5m2!1sen!2sin'
    };

    let updated: Branch[];
    if (showBranchModal === 'add') {
      updated = [...branches, newBranch];
      triggerBranchBanner('New branch created successfully.');
    } else {
      updated = branches.map(b => b.id === bId ? newBranch : b);
      triggerBranchBanner('Branch details updated.');
    }

    setBranches(updated);
    saveBranches(updated);
    setShowBranchModal(null);
  };

  const triggerBranchBanner = (text: string) => {
    triggerBanner(text);
  };

  // Integration simulations
  const simulateWhatsApp = (type: 'quote' | 'catalog' | 'order', target: any) => {
    let msg = '';
    let phone = '';
    if (type === 'quote') {
      phone = target.whatsapp;
      msg = `Hello ${target.customerName}, this is MG Glass Traders Hyderabad. We have generated your formal Price Quotation ${target.id} for the ${target.vehicleBrand} ${target.vehicleModel} (${target.requiredGlassType}) at an estimated fitted price of ₹${target.totalAmount.toLocaleString('en-IN')}. Clean glass & 1-Year leak warranty included.`;
    } else if (type === 'order') {
      phone = target.phone;
      msg = `Dear ${target.customerName}, your Glass Fitment Order ${target.id} is confirmed with Invoice No. ${target.invoiceNumber}. Total paid amount: ₹${target.totalAmount.toLocaleString('en-IN')}. Thank you for choosing MG Glass Traders!`;
    } else if (type === 'catalog') {
      phone = '919876543210';
      msg = `Greetings, here is the updated MG Glass Traders Automotive Windshield & Mirror catalog. We support 30+ luxury brands (Audi, BMW, Benz, Toyota, Hyundai). Contact us for emergency glass fitments!`;
    }

    const waUrl = `https://wa.me/${phone.replace(/\+/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    triggerBanner('Simulated WhatsApp message dispatched!');
  };

  const simulateEmail = (type: 'quote' | 'order', target: any) => {
    const email = 'customer@example.com';
    const subject = type === 'quote' ? `OFFICIAL GLASS QUOTATION - MG GLASS TRADERS` : `INVOICE & ORDER CONFIRMATION - MG GLASS TRADERS`;
    const body = type === 'quote' 
      ? `Dear ${target.customerName},\n\nPlease find attached our formal quotation ${target.id} for your ${target.vehicleBrand} ${target.vehicleModel}.\n\nTotal estimated fitted cost: ₹${target.totalAmount.toLocaleString('en-IN')}.\n\nRegards,\nMG Glass Traders Hyderabad`
      : `Dear ${target.customerName},\n\nThank you for your business. Your Invoice ${target.invoiceNumber} is processed for payment of ₹${target.totalAmount.toLocaleString('en-IN')}.\n\nWarm regards,\nMG Glass Traders Hyderabad`;

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    triggerBanner('Simulated Email dispatcher opened!');
  };

  // ---------------- ANALYTICS CALCULATIONS ----------------
  const totalProductsCount = products.length;
  const totalOrdersCount = orders.length;
  const totalQuotesCount = quotations.length;
  
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  
  const todayRevenue = completedOrders
    .filter(o => new Date(o.orderDate).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const lowStockItems = products.filter(p => p.stockQuantity < 5);
  const totalExpensesAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpensesAmount;

  // ---------------- UI VIEW RENDERING ----------------

  const sidebarItems = [
    { id: 'dashboard', label: 'Overview Metrics', icon: LayoutDashboard, roles: ['Admin', 'Accountant', 'BranchManager', 'SalesExecutive'] },
    { id: 'products', label: 'Product Catalog', icon: Box, roles: ['Admin', 'SalesExecutive'] },
    { id: 'inventory', label: 'Stock & Inventory', icon: ClipboardList, roles: ['Admin', 'BranchManager'] },
    { id: 'pricing', label: 'Price Management', icon: Percent, roles: ['Admin'] },
    { id: 'quotations', label: 'Quotations Box', icon: FileSpreadsheet, roles: ['Admin', 'BranchManager', 'SalesExecutive'] },
    { id: 'orders', label: 'Sales & Invoices', icon: ShoppingCart, roles: ['Admin', 'Accountant', 'SalesExecutive'] },
    { id: 'customers', label: 'Customer Files', icon: Users, roles: ['Admin', 'SalesExecutive'] },
    { id: 'accountant', label: 'Accounting Ledger', icon: Landmark, roles: ['Admin', 'Accountant'] },
    { id: 'branches', label: 'Branches Desk', icon: MapPin, roles: ['Admin', 'BranchManager'] },
  ];

  const allowedSidebarItems = sidebarItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans flex flex-col md:flex-row border-t border-slate-900">
      
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-900 flex flex-col justify-between p-4 shrink-0">
        <div className="space-y-6">
          {/* Active staff identity */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-900 flex items-center space-x-3">
            <img src={currentUser.avatar} alt="Staff" className="h-10 w-10 rounded-full object-cover border border-blue-500" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-0.5">{currentUser.role}</p>
            </div>
          </div>

          <div className="h-px bg-slate-900"></div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {allowedSidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSidebar(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeSidebar === item.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom utility */}
        <div className="pt-6 border-t border-slate-900">
          <p className="text-[10px] text-slate-500 text-center font-bold">ZK BUSINESS SECURITY KEY</p>
          <p className="text-[9px] text-slate-600 text-center mt-1">Attapur IP-AUTH: SECURE</p>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT AREA ---------------- */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-4 gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-500 tracking-widest">MG Management Portal</span>
            <h1 className="text-2xl font-black text-white capitalize">{activeSidebar.replace('-', ' ')} Pane</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setProducts(getProducts());
                setQuotations(getQuotations());
                setOrders(getOrders());
                setExpenses(getExpenses());
                setCustomers(getCustomers());
                triggerBanner('Database synchronization refreshed!');
              }}
              className="p-2 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Refresh DB"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600/10 border border-red-500/20 hover:bg-red-600 hover:text-white rounded text-xs font-semibold text-red-400 transition"
            >
              Exit Portal
            </button>
          </div>
        </div>

        {/* Global Notifications Panel banner */}
        {bannerMsg && (
          <div className={`p-4 rounded-lg flex items-center space-x-3 text-xs border ${
            bannerMsg.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
          }`}>
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>{bannerMsg.text}</span>
          </div>
        )}

        {/* ---------------- PANEL 1: DASHBOARD OVERVIEW ---------------- */}
        {activeSidebar === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* KPI Summary Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/5 rounded-bl-full"></div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</p>
                <p className="text-2xl font-black text-white mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center mt-2">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                  +18.4% this month
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/5 rounded-bl-full"></div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</p>
                <p className="text-2xl font-black text-white mt-1">{totalOrdersCount}</p>
                <span className="text-[10px] text-blue-400 font-bold flex items-center mt-2">
                  <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                  {orders.filter(o => o.status === 'pending').length} pending dispatch
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/5 rounded-bl-full"></div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Quotes</p>
                <p className="text-2xl font-black text-white mt-1">
                  {quotations.filter(q => q.status === 'pending').length}
                </p>
                <span className="text-[10px] text-amber-400 font-semibold flex items-center mt-2">
                  <Clock className="h-3.5 w-3.5 mr-1 animate-pulse" />
                  Requires callback today
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 bg-red-500/5 rounded-bl-full"></div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Low Stock Warning</p>
                <p className="text-2xl font-black text-red-500 mt-1">{lowStockItems.length}</p>
                <span className="text-[10px] text-red-400 font-bold flex items-center mt-2">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  Reorder immediately
                </span>
              </div>
            </div>

            {/* Custom SVG Sales Chart Block */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Revenue & Earnings Trend</h3>
                  <p className="text-xs text-slate-400 mt-1">Sales distribution for active automotive glasses</p>
                </div>
                <span className="text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded">2026 Fiscal</span>
              </div>

              {/* Styled SVG Chart representing visual data */}
              <div className="relative h-48 w-full bg-slate-950/40 rounded-lg p-2 border border-slate-800/60 flex items-end">
                {/* Visual grid lines */}
                <div className="absolute inset-x-0 top-1/4 border-t border-slate-900"></div>
                <div className="absolute inset-x-0 top-2/4 border-t border-slate-900"></div>
                <div className="absolute inset-x-0 top-3/4 border-t border-slate-900"></div>
                
                {/* Render bars dynamically */}
                <div className="w-full flex justify-around items-end h-32 z-10">
                  <div className="flex flex-col items-center w-8">
                    <div className="bg-blue-600 rounded-t w-full h-12 hover:bg-blue-500 transition-all cursor-pointer relative group">
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] px-1.5 py-0.5 rounded border border-slate-800 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20">₹45k</span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-2">Mar</span>
                  </div>
                  <div className="flex flex-col items-center w-8">
                    <div className="bg-blue-600 rounded-t w-full h-16 hover:bg-blue-500 transition-all cursor-pointer relative group">
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] px-1.5 py-0.5 rounded border border-slate-800 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20">₹62k</span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-2">Apr</span>
                  </div>
                  <div className="flex flex-col items-center w-8">
                    <div className="bg-blue-600 rounded-t w-full h-24 hover:bg-blue-500 transition-all cursor-pointer relative group">
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] px-1.5 py-0.5 rounded border border-slate-800 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20">₹98k</span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-2">May</span>
                  </div>
                  <div className="flex flex-col items-center w-8">
                    <div className="bg-blue-500 rounded-t w-full h-28 hover:bg-blue-400 transition-all cursor-pointer relative group">
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] px-1.5 py-0.5 rounded border border-slate-800 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20">₹118k</span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-2">Jun</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Low stock indicators & Urgent callback actions split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stock Alerts list */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  Low Stock Notifications
                </h3>
                {lowStockItems.length === 0 ? (
                  <p className="text-xs text-slate-400">All products are healthy and well-stocked.</p>
                ) : (
                  <div className="divide-y divide-slate-800 space-y-3">
                    {lowStockItems.map((p) => (
                      <div key={p.id} className="flex justify-between items-center text-xs pt-2.5">
                        <div>
                          <p className="font-bold text-slate-200">{p.name}</p>
                          <p className="text-[10px] text-slate-500">SKU: {p.sku}</p>
                        </div>
                        <span className="text-red-400 font-bold bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                          Only {p.stockQuantity} Left
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Latest Quotations to Callback */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center">
                  <Clock className="h-4 w-4 text-amber-500 mr-2 animate-pulse" />
                  Urgent Customer Callback Leads
                </h3>
                <div className="space-y-3 divide-y divide-slate-800">
                  {quotations.filter(q => q.status === 'pending').slice(0, 3).map((q) => (
                    <div key={q.id} className="flex justify-between items-center text-xs pt-2.5">
                      <div>
                        <p className="font-bold text-slate-200">{q.customerName}</p>
                        <p className="text-[10px] text-slate-500">Vehicle: {q.vehicleBrand} {q.vehicleModel} ({q.vehicleYear})</p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveSidebar('quotations');
                          setQuoteSearch(q.customerName);
                        }}
                        className="text-[10px] font-bold text-blue-400 hover:underline"
                      >
                        Action Lead →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- PANEL 2: PRODUCT CATALOG MANAGEMENT ---------------- */}
        {activeSidebar === 'products' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 p-4 rounded-xl gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search brand, name, sku..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowProductModal('add')}
                  className="px-3.5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow flex items-center space-x-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Register New Glass</span>
                </button>
                <button
                  onClick={() => {
                    // Export simulation
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
                    const dlAnchorElem = document.createElement('a');
                    dlAnchorElem.setAttribute("href", dataStr);
                    dlAnchorElem.setAttribute("download", "mg_glass_catalog_export.json");
                    dlAnchorElem.click();
                    triggerBanner('Catalog database exported successfully as JSON!');
                  }}
                  className="px-3 py-2 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-bold text-white flex items-center space-x-1.5"
                >
                  <Download className="h-3.5 w-3.5 text-blue-400" />
                  <span>Export Catalog</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-800">
                    <th className="py-3 px-4">Glass Specs & Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Vehicle Model / Compatibility</th>
                    <th className="py-3 px-4">Fitted Price (INR)</th>
                    <th className="py-3 px-4">Total Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {products
                    .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.brand.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase()))
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-slate-900/40 text-slate-300">
                        <td className="py-4 px-4 flex items-center space-x-3">
                          <img src={p.imageUrl} alt="P" className="h-9 w-9 rounded object-cover" />
                          <div>
                            <p className="font-bold text-white">{p.name}</p>
                            <p className="text-[10px] font-mono text-blue-400 mt-0.5">{p.sku}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-400">{p.category}</td>
                        <td className="py-4 px-4 text-blue-500 font-bold">{p.brand} {p.model} ({p.year})</td>
                        <td className="py-4 px-4 font-mono font-bold text-white">
                          ₹{(p.discountPrice || p.price).toLocaleString('en-IN')}
                          {p.discountPrice && (
                            <span className="block text-[10px] text-slate-500 line-through">₹{p.price.toLocaleString('en-IN')}</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.stockQuantity > 5 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {p.stockQuantity} units
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => setShowProductModal(p)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400"
                            title="Edit Product"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-red-400"
                            title="Delete Product"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- PANEL 3: STOCK & INVENTORY MANAGEMENT ---------------- */}
        {activeSidebar === 'inventory' && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick stock in / out simulator panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Manual Quick Stock-In / Stock-Out Logger</h3>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const pId = fd.get('prodId') as string;
                  const qty = Number(fd.get('qty'));
                  const actionType = fd.get('actionType') as 'stock_in' | 'stock_out';
                  const branch = fd.get('branch') as string;
                  handleQuickStockAdjustment(pId, qty, actionType, branch);
                  e.currentTarget.reset();
                }}
                className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end"
              >
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Product</label>
                  <select name="prodId" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none">
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.brand} {p.model} - {p.sku}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Branch Hub</label>
                  <select name="branch" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none">
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name.split(' (')[0]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Action Type</label>
                  <select name="actionType" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none">
                    <option value="stock_in">Stock In (+)</option>
                    <option value="stock_out">Stock Out (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Quantity</label>
                  <input type="number" required min={1} name="qty" placeholder="Units" className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none" />
                </div>
                <div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-xs font-bold py-2 rounded text-white shadow">
                    Register Movement
                  </button>
                </div>
              </form>
            </div>

            {/* Inventory Logs List */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Inventory Movement Logs</h3>
                <span className="text-[10px] text-slate-500 font-bold">Total {inventoryLogs.length} entries</span>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 divide-y divide-slate-800">
                {inventoryLogs.slice().reverse().map((log) => (
                  <div key={log.id} className="flex justify-between items-start text-xs pt-3">
                    <div className="space-y-1">
                      <p className="font-bold text-white">{log.productName}</p>
                      <p className="text-[11px] text-slate-400">Branch: <span className="font-semibold text-blue-400">{log.branchId}</span> | Reason: {log.reason}</p>
                      <p className="text-[10px] text-slate-500">Logged by {log.user} on {new Date(log.date).toLocaleString('en-IN')}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      log.type === 'stock_in' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {log.type === 'stock_in' ? '+' : '-'}{log.quantity} units
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- PANEL 4: PRICE MANAGEMENT ---------------- */}
        {activeSidebar === 'pricing' && (
          <div className="space-y-6 animate-fade-in">
            {/* Bulk adjustment tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                  <Percent className="h-4 w-4 text-blue-500 mr-2" />
                  Global Catalog Price Multiplier
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Easily update all automotive glasses in the catalog simultaneously. Ideal for adjusting prices due to raw glass material inflation, supplier price hikes, or seasonal holiday promotions.
                </p>

                <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Adjustment Action</label>
                      <select 
                        value={bulkActionType} 
                        onChange={(e) => setBulkActionType(e.target.value as 'increase' | 'decrease')}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white"
                      >
                        <option value="increase">Increase Prices (+)</option>
                        <option value="decrease">Decrease Prices (-)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Percentage (%)</label>
                      <input 
                        type="number" 
                        value={bulkPercent}
                        onChange={(e) => setBulkPercent(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white" 
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleBulkPriceUpdate}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded text-white shadow-lg shadow-blue-500/10 transition"
                  >
                    Apply Bulk Multiplier
                  </button>
                </div>
              </div>

              {/* Price update logs tracking */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Audit Price Modification logs</h3>
                <div className="space-y-3 divide-y divide-slate-800 max-h-60 overflow-y-auto pr-2">
                  {priceHistory.slice().reverse().map((h) => (
                    <div key={h.id} className="flex justify-between items-start text-xs pt-2.5">
                      <div>
                        <p className="font-bold text-slate-200">{h.productName}</p>
                        <p className="text-[10px] text-slate-500">Updated by {h.updatedBy} on {new Date(h.updatedAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-emerald-400 font-bold">₹{h.newPrice}</span>
                        <span className="block text-[10px] text-slate-500 line-through font-mono">₹{h.oldPrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- PANEL 5: QUOTATIONS BOX ---------------- */}
        {activeSidebar === 'quotations' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header / Add Quotation */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 p-4 rounded-xl gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customer name..."
                  value={quoteSearch}
                  onChange={(e) => setQuoteSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 pl-9 text-xs text-white placeholder-slate-500"
                />
              </div>
              <button
                onClick={() => setShowQuoteCreatorModal(true)}
                className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Create Pro Quote</span>
              </button>
            </div>

            {/* List of Quotes */}
            <div className="space-y-4">
              {quotations
                .filter(q => q.customerName.toLowerCase().includes(quoteSearch.toLowerCase()))
                .slice().reverse().map((quote) => (
                  <div 
                    key={quote.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-blue-400 font-mono">{quote.id}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          quote.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                          quote.status === 'converted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                          'bg-red-500/10 text-red-400 border border-red-500/25'
                        }`}>
                          {quote.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-base">{quote.customerName}</h4>
                        <p className="text-xs text-slate-400">Phone: <span className="text-slate-200">{quote.phone}</span> | WhatsApp: <span className="text-slate-200">{quote.whatsapp}</span></p>
                        <p className="text-xs text-slate-400 mt-1">Vehicle: <span className="font-semibold text-blue-500">{quote.vehicleBrand} {quote.vehicleModel} ({quote.vehicleYear})</span></p>
                        {quote.notes && (
                          <p className="text-xs text-slate-500 italic mt-1.5 bg-slate-950 p-2 rounded border border-slate-800">
                            Notes: "{quote.notes}"
                          </p>
                        )}
                        {quote.imageUrl && (
                          <div className="pt-2 flex items-center space-x-2">
                            <FileImage className="h-4 w-4 text-blue-400" />
                            <span className="text-xs text-blue-400 font-bold hover:underline cursor-pointer" onClick={() => window.open(quote.imageUrl!, '_blank')}>
                              View Customer Uploaded Glass Image
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions and Pricing */}
                    <div className="flex flex-col items-end shrink-0 space-y-3 w-full md:w-auto border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Price Quoted</p>
                        <p className="text-xl font-black text-white">₹{quote.totalAmount.toLocaleString('en-IN')}</p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 justify-end">
                        <button
                          onClick={() => setPdfView({ type: 'quotation', data: { quotation: quote } })}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                          title="Print Quotation PDF"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => simulateWhatsApp('quote', quote)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded"
                          title="Send to WhatsApp"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => simulateEmail('quote', quote)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded"
                          title="Send to Email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        {quote.status === 'pending' && (
                          <button
                            onClick={() => handleConvertQuoteToOrder(quote)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow"
                          >
                            Convert to Order
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ---------------- PANEL 6: SALES & INVOICES (ORDERS) ---------------- */}
        {activeSidebar === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header Search */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search order ID or customer..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 pl-9 text-xs text-white"
                />
              </div>
            </div>

            {/* List of Orders */}
            <div className="space-y-4">
              {orders
                .filter(o => o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.includes(orderSearch))
                .slice().reverse().map((order) => (
                  <div 
                    key={order.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-blue-400 font-mono">{order.id}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          order.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-red-500/10 text-red-400 border border-red-500/25'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-base">{order.customerName}</h4>
                      <p className="text-xs text-slate-400">Phone: <span className="text-slate-200">{order.phone}</span> | Vehicle: <span className="font-semibold text-blue-500">{order.vehicleBrand} {order.vehicleModel}</span></p>
                      <p className="text-[11px] text-slate-500 mt-1">Invoice: <span className="font-mono text-slate-300 font-bold">{order.invoiceNumber}</span> | GST INCLUDED: ₹{order.taxAmount}</p>
                    </div>

                    <div className="flex flex-col items-end shrink-0 space-y-3 w-full md:w-auto">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-mono">Invoice Amount</p>
                        <p className="text-xl font-black text-white">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                      </div>

                      <div className="flex space-x-1.5 justify-end">
                        <button
                          onClick={() => setPdfView({ type: 'invoice', data: { order: order } })}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded flex items-center space-x-1"
                        >
                          <Printer className="h-3.5 w-3.5 text-blue-400" />
                          <span>View GST Invoice</span>
                        </button>

                        {order.paymentStatus === 'pending' && (
                          <button
                            onClick={() => setSelectedOrderForPayment(order)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow"
                          >
                            Pay via Razorpay
                          </button>
                        )}
                        
                        <button
                          onClick={() => simulateWhatsApp('order', order)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded"
                          title="Share Invoice WhatsApp"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ---------------- PANEL 7: CUSTOMER REGISTRY ---------------- */}
        {activeSidebar === 'customers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customer name or phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 pl-9 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customers
                .filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch))
                .map((cust) => (
                  <div key={cust.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-base">{cust.name}</h4>
                        <p className="text-xs text-slate-400">Phone: {cust.phone} | Email: {cust.email}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                        {cust.serviceHistory.length} Services Replaced
                      </span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-3">
                      <p className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">Fitted Vehicles & History</p>
                      
                      <div className="space-y-2">
                        {cust.serviceHistory.map((hist) => (
                          <div key={hist.id} className="text-xs border-b border-slate-900/60 pb-2">
                            <p className="font-bold text-slate-200">{hist.type} (₹{hist.cost.toLocaleString('en-IN')})</p>
                            <p className="text-[10px] text-slate-500">Date: {hist.date} | Notes: {hist.notes}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer Notes */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Customer Internal File Notes</label>
                      <textarea
                        rows={2}
                        defaultValue={cust.notes}
                        onBlur={(e) => {
                          const updated = customers.map(c => c.id === cust.id ? { ...c, notes: e.target.value } : c);
                          setCustomers(updated);
                          saveCustomers(updated);
                          triggerBanner('Customer File notes autosaved!');
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white"
                        placeholder="Add critical insights about the customer..."
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ---------------- PANEL 8: ACCOUNTANT PANEL ---------------- */}
        {activeSidebar === 'accountant' && (
          <div className="space-y-6 animate-fade-in">
            {/* Financial metrics bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Billings (18% GST)</p>
                <p className="text-2xl font-black text-white mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Outflow Expenses</p>
                <p className="text-2xl font-black text-red-500 mt-1">₹{totalExpensesAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Profit & Loss Margin</p>
                <p className="text-2xl font-black text-emerald-500 mt-1">₹{netProfit.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Expenses logger & export button */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Operational Expense Logs</h3>
                <button
                  onClick={() => setShowExpenseModal(true)}
                  className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow"
                >
                  Log Expense Outflow
                </button>
              </div>

              <div className="space-y-3 divide-y divide-slate-800">
                {expenses.slice().reverse().map((exp) => (
                  <div key={exp.id} className="flex justify-between items-center text-xs pt-2.5">
                    <div>
                      <p className="font-bold text-white">{exp.description}</p>
                      <p className="text-[10px] text-slate-500">Paid to: {exp.payee} | Date: {exp.date} | Method: {exp.paymentMethod}</p>
                    </div>
                    <span className="font-mono text-red-400 font-bold shrink-0">
                      - ₹{exp.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- PANEL 9: BRANCHES MANAGEMENT ---------------- */}
        {activeSidebar === 'branches' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Hyderabad Hub Registry</h3>
              <button
                onClick={() => setShowBranchModal('add')}
                className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow"
              >
                Establish New Branch
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {branches.map((b) => (
                <div key={b.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-bold text-white text-base">{b.name}</h4>
                    <p className="text-xs text-slate-400">{b.address}</p>
                    <div className="text-xs text-slate-500 space-y-1 pt-2">
                      <p>Manager: <span className="font-semibold text-slate-300">{b.manager}</span></p>
                      <p>Tel: <span className="font-semibold text-slate-300">{b.phone}</span></p>
                      <p>Business hours: <span className="font-semibold text-slate-300">{b.hours}</span></p>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-slate-800/60">
                    <button
                      onClick={() => setShowBranchModal(b)}
                      className="flex-1 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                    >
                      Configure Branch
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ----------------- MODAL DIALOGS ----------------- */}

      {/* Product Add / Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-slate-900 border border-slate-800 text-white shadow-2xl p-6 max-h-[90vh] overflow-y-auto my-8">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">
              {showProductModal === 'add' ? 'Register New Automotive Glass' : 'Modify Glass Specifications'}
            </h3>

            <form onSubmit={handleAddOrEditProductSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Product Display Name</label>
                  <input required name="name" type="text" defaultValue={showProductModal !== 'add' ? (showProductModal as Product).name : ''} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category Category</label>
                  <select name="category" defaultValue={showProductModal !== 'add' ? (showProductModal as Product).category : 'Front Windshields'} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white">
                    <option value="Front Windshields">Front Windshields</option>
                    <option value="Rear Windshields">Rear Windshields</option>
                    <option value="Door Glasses">Door Glasses</option>
                    <option value="Quarter Glasses">Quarter Glasses</option>
                    <option value="Sunroof Glass">Sunroof Glass</option>
                    <option value="Side Mirrors">Side Mirrors</option>
                    <option value="Rear View Mirrors">Rear View Mirrors</option>
                    <option value="Truck Glass">Truck Glass</option>
                    <option value="Bus Glass">Bus Glass</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Vehicle Brand</label>
                  <input required name="brand" type="text" placeholder="e.g. Audi" defaultValue={showProductModal !== 'add' ? (showProductModal as Product).brand : ''} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Vehicle Model</label>
                  <input required name="model" type="text" placeholder="e.g. A4 Sedan" defaultValue={showProductModal !== 'add' ? (showProductModal as Product).model : ''} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Year Range</label>
                  <input required name="year" type="text" placeholder="e.g. 2019-2024" defaultValue={showProductModal !== 'add' ? (showProductModal as Product).year : ''} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">SKU Unique Code</label>
                  <input required name="sku" type="text" placeholder="e.g. FW-AUD-A4-19" defaultValue={showProductModal !== 'add' ? (showProductModal as Product).sku : ''} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Warranty Information</label>
                  <input required name="warranty" type="text" placeholder="e.g. 1 Year Leakage Warranty" defaultValue={showProductModal !== 'add' ? (showProductModal as Product).warranty : '1 Year Leak-proof Warranty'} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Standard Fitted Price (INR)</label>
                  <input required name="price" type="number" defaultValue={showProductModal !== 'add' ? (showProductModal as Product).price : ''} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Discount Price (INR - Optional)</label>
                  <input name="discountPrice" type="number" defaultValue={showProductModal !== 'add' ? (showProductModal as Product).discountPrice : ''} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-3">
                <p className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">Branch wise Stock allocation</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] font-semibold text-slate-500 mb-1">Attapur (Main)</label>
                    <input name="stock-hyd-main" type="number" defaultValue={showProductModal !== 'add' ? (showProductModal as Product).branchStock['hyd-main'] : 5} className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-slate-500 mb-1">Uppal Branch</label>
                    <input name="stock-hyd-gachibowli" type="number" defaultValue={showProductModal !== 'add' ? (showProductModal as Product).branchStock['hyd-gachibowli'] : 3} className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-slate-500 mb-1">Sangareddy</label>
                    <input name="stock-hyd-secunderabad" type="number" defaultValue={showProductModal !== 'add' ? (showProductModal as Product).branchStock['hyd-secunderabad'] : 2} className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-xs text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mt-2 mb-1">Total Aggregate Stock Quantity</label>
                  <input required name="stockQuantity" type="number" defaultValue={showProductModal !== 'add' ? (showProductModal as Product).stockQuantity : 10} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Glass Description</label>
                <textarea name="description" rows={2} defaultValue={showProductModal !== 'add' ? (showProductModal as Product).description : ''} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Image URL Preview</label>
                <input name="imageUrl" type="text" defaultValue={showProductModal !== 'add' ? (showProductModal as Product).imageUrl : ''} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => setShowProductModal(null)} className="px-4 py-2 bg-slate-800 rounded text-xs font-semibold text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 text-white p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Log Business Expense</h3>
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Expense Category</label>
                <select name="category" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white">
                  <option value="Rent">Warehouse Rent</option>
                  <option value="Salaries">Staff Salaries</option>
                  <option value="Consumables">Consumables (Polyurethane / sealants)</option>
                  <option value="Utilities">Utilities (Electricity / Water)</option>
                  <option value="Transport">Transport & Mobile Van fuels</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Expense Description</label>
                <input required name="description" placeholder="e.g. Electricity bill for Uppal" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Outflow Amount (INR)</label>
                  <input required name="amount" type="number" placeholder="5000" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Payment Date</label>
                  <input required name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Payee / Recipient</label>
                  <input required name="payee" placeholder="e.g. TSSPDCL" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Payment Method</label>
                  <select name="paymentMethod" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white">
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="upi">UPI</option>
                    <option value="cash">Cash Handout</option>
                    <option value="card">Company Debit Card</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Branch Hub allocation</label>
                <select name="branchId" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white">
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name.split(' (')[0]}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => setShowExpenseModal(false)} className="px-4 py-2 bg-slate-800 text-xs font-semibold rounded text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-xs font-bold text-white rounded">
                  Record Ledger Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quote Creator Modal */}
      {showQuoteCreatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 text-white p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Generate Proactive Quotation</h3>
            <form onSubmit={handleCreateQuotationSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Customer Full Name</label>
                <input required name="customerName" placeholder="Anil Reddy" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Phone</label>
                  <input required name="phone" placeholder="+91 91234 56789" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">WhatsApp</label>
                  <input name="whatsapp" placeholder="Same if blank" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Catalog Glass Product</label>
                <select name="productId" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white">
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.brand} {p.model} - {p.name} (₹{p.discountPrice || p.price})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Job Specification Notes</label>
                <textarea name="notes" rows={2} placeholder="Immediate delivery or on-site fitting instructions..." className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => setShowQuoteCreatorModal(false)} className="px-4 py-2 bg-slate-800 text-xs font-semibold rounded text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded">
                  Generate Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branch Modal add/edit */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 text-white p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              {showBranchModal === 'add' ? 'Configure New Hub Branch' : 'Modify Branch Details'}
            </h3>
            <form onSubmit={handleSaveBranchSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Branch Name</label>
                <input required name="name" defaultValue={showBranchModal !== 'add' ? (showBranchModal as Branch).name : ''} placeholder="Uppal Branch" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Physical Address</label>
                <input required name="address" defaultValue={showBranchModal !== 'add' ? (showBranchModal as Branch).address : ''} placeholder="Survey No. 104, Outer Ring Road" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Phone</label>
                  <input required name="phone" defaultValue={showBranchModal !== 'add' ? (showBranchModal as Branch).phone : ''} placeholder="+91 98765 43211" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">WhatsApp API Phone</label>
                  <input required name="whatsapp" defaultValue={showBranchModal !== 'add' ? (showBranchModal as Branch).whatsapp : ''} placeholder="919876543211" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Branch Manager</label>
                  <input required name="manager" defaultValue={showBranchModal !== 'add' ? (showBranchModal as Branch).manager : ''} placeholder="Syed Abdul" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Business Hours</label>
                  <input required name="hours" defaultValue={showBranchModal !== 'add' ? (showBranchModal as Branch).hours : ''} placeholder="10:00 AM - 09:00 PM" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Google Maps Embed URL</label>
                <input name="mapEmbedUrl" defaultValue={showBranchModal !== 'add' ? (showBranchModal as Branch).mapEmbedUrl : ''} placeholder="https://www.google.com/maps/embed?..." className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white" />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => setShowBranchModal(null)} className="px-4 py-2 bg-slate-800 text-xs font-semibold rounded text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded">
                  Save Hub details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulated Razorpay Checkout */}
      {selectedOrderForPayment && (
        <RazorpayModal
          order={selectedOrderForPayment}
          onSuccess={(method) => {
            // Update order payment status
            const updated = orders.map((o) => o.id === selectedOrderForPayment.id ? { ...o, paymentStatus: 'paid' as const, paymentMethod: method } : o);
            setOrders(updated);
            saveOrders(updated);
            setSelectedOrderForPayment(null);
            triggerBanner(`Invoice successfully marked as PAID! transaction authenticated.`);
          }}
          onClose={() => setSelectedOrderForPayment(null)}
        />
      )}

      {/* PDF Printable Document previewer */}
      {pdfView && (
        <PDFViewerModal
          type={pdfView.type}
          data={pdfView.data}
          onClose={() => setPdfView(null)}
        />
      )}

    </div>
  );
}
