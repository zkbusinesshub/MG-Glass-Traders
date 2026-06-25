import { Product, Branch, Quotation, Order, Expense, InventoryLog, User, Customer, PriceHistory, CatalogFile } from '../types';

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'hyd-main',
    name: 'Attapur Branch (Main Hub)',
    address: 'Door No. 4-8-121/A, Pillar No. 143, PV Narasimha Rao Expressway, Attapur, Hyderabad, Telangana - 500048',
    phone: '+91 93241 87807',
    whatsapp: '919324187807',
    manager: 'Mohammed Usman Pathan',
    hours: '09:00 AM - 08:00 PM (Mon - Sat)',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.45207!2d78.4291094!3d17.3745207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb96534d386e93%3A0x2eee6fd4811774e3!2sM.G.+Glass+Traders!5e0!3m2!1sen!2sin!4v1719280000000!5m2!1sen!2sin'
  },
  {
    id: 'hyd-gachibowli',
    name: 'Uppal Branch',
    address: 'Plot No. 22-B, Near Uppal Metro Station, Main Road, Uppal, Hyderabad, Telangana - 500039',
    phone: '+91 93241 87807',
    whatsapp: '919324187807',
    manager: 'Zameer Khan',
    hours: '10:00 AM - 09:00 PM (Mon - Sat)',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.4788!2d78.5594807!3d17.3974788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9909130d7c3f%3A0xf3610f6b38536300!2sMG+Glass+Traders!5e0!3m2!1sen!2sin!4v1719280000000!5m2!1sen!2sin'
  },
  {
    id: 'hyd-secunderabad',
    name: 'Sangareddy Branch',
    address: 'Plot No. 5, Near bypass road, NH-65, Sangareddy, Telangana - 502001',
    phone: '+91 93241 87807',
    whatsapp: '919324187807',
    manager: 'Syed Abdul Rahman',
    hours: '09:00 AM - 07:00 PM (Mon - Sat)',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.5855623!2d78.0997451!3d17.5855623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcbfa0355f97699%3A0xcb62bd2dcbae67b7!2sMG+GLASS+TRADERS!5e0!3m2!1sen!2sin!4v1719280000000!5m2!1sen!2sin'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin',
    name: 'Mohammed Usman Pathan',
    username: 'admin',
    role: 'Admin',
    branchId: 'hyd-main',
    email: 'usmanpathan0107@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
  },
  {
    id: 'u-accountant',
    name: 'Zameer Khan',
    username: 'accountant',
    role: 'Accountant',
    branchId: 'hyd-main',
    email: 'zameer.acc@mgglass.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'
  },
  {
    id: 'u-manager',
    name: 'Syed Abdul Rahman',
    username: 'manager',
    role: 'BranchManager',
    branchId: 'hyd-gachibowli',
    email: 'rahman.gachibowli@mgglass.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200'
  },
  {
    id: 'u-sales',
    name: 'Karan Sharma',
    username: 'sales',
    role: 'SalesExecutive',
    branchId: 'hyd-main',
    email: 'karan.sales@mgglass.com',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: 'Acoustic Laminated Front Windshield',
    category: 'Front Windshields',
    brand: 'Audi',
    model: 'A4 Sedan',
    year: '2019-2024',
    sku: 'FW-AUD-A4-19',
    description: 'High-performance solar and acoustic laminated windshield glass. Reduced cabin noise and premium clarity.',
    price: 18500,
    discountPrice: 16999,
    stockQuantity: 12,
    branchStock: { 'hyd-main': 6, 'hyd-gachibowli': 4, 'hyd-secunderabad': 2 },
    warranty: '2 Years Glass Leakage & Discoloration Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600',
    available: true
  },
  {
    id: 'p-2',
    name: 'Green Tinted Rear Defogger Glass',
    category: 'Rear Windshields',
    brand: 'BMW',
    model: '3 Series (G20)',
    year: '2020-2025',
    sku: 'RW-BMW-G20-20',
    description: 'Rear windshield featuring integrated defogger heating lines and built-in radio antenna support.',
    price: 14200,
    discountPrice: 13500,
    stockQuantity: 8,
    branchStock: { 'hyd-main': 4, 'hyd-gachibowli': 2, 'hyd-secunderabad': 2 },
    warranty: '1 Year Heating Element & Sealant Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=600',
    available: true
  },
  {
    id: 'p-3',
    name: 'Front Left Side Door Glass (Tempered)',
    category: 'Door Glasses',
    brand: 'Toyota',
    model: 'Fortuner',
    year: '2016-2024',
    sku: 'DG-TOY-FT-FL',
    description: 'Tough tempered safety glass designed for perfect fitment in front left side doors of Toyota Fortuner.',
    price: 4800,
    discountPrice: 4200,
    stockQuantity: 18,
    branchStock: { 'hyd-main': 10, 'hyd-gachibowli': 5, 'hyd-secunderabad': 3 },
    warranty: '6 Months Fitment & Crack Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600',
    available: true
  },
  {
    id: 'p-4',
    name: 'Panoramic Double-Glazed Sunroof Glass',
    category: 'Sunroof Glass',
    brand: 'Mercedes-Benz',
    model: 'C-Class (W205)',
    year: '2018-2023',
    sku: 'SG-MB-W205-PA',
    description: 'Premium double-glazed panoramic sliding roof section with high UV radiation reflection coating.',
    price: 32000,
    discountPrice: 29500,
    stockQuantity: 4,
    branchStock: { 'hyd-main': 2, 'hyd-gachibowli': 2, 'hyd-secunderabad': 0 },
    warranty: '3 Years UV Protection Coating Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600',
    available: true
  },
  {
    id: 'p-5',
    name: 'Heated Power Foldable Side Mirror Assembly',
    category: 'Side Mirrors',
    brand: 'Hyundai',
    model: 'i20 Asta',
    year: '2020-2024',
    sku: 'SM-HYU-I20-RT',
    description: 'Complete right side mirror assembly with electrical adjustment, integrated turn indicators, and heater element.',
    price: 6500,
    stockQuantity: 15,
    branchStock: { 'hyd-main': 8, 'hyd-gachibowli': 4, 'hyd-secunderabad': 3 },
    warranty: '1 Year Internal Motor Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1617469767053-d3b508a0d1e5?q=80&w=600',
    available: true
  },
  {
    id: 'p-6',
    name: 'Anti-Glare Auto-Dimming Rear View Mirror',
    category: 'Rear View Mirrors',
    brand: 'Honda',
    model: 'City ZX',
    year: '2020-2024',
    sku: 'RM-HON-CTY-AD',
    description: 'Smart inside rear-view mirror with electrochromic auto-dimming sensor and ambient light detection.',
    price: 5200,
    discountPrice: 4800,
    stockQuantity: 20,
    branchStock: { 'hyd-main': 10, 'hyd-gachibowli': 6, 'hyd-secunderabad': 4 },
    warranty: '1 Year Sensor & Circuit Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600',
    available: true
  },
  {
    id: 'p-7',
    name: 'Heavy-Duty Laminated Multi-Layer Windshield',
    category: 'Truck Glass',
    brand: 'Tata',
    model: 'Signa 4825.T',
    year: '2018-2025',
    sku: 'TG-TAT-SIG-FW',
    description: 'Extra thick double-layered heavy commercial vehicle laminated windshield glass. Made for severe long-haul operations.',
    price: 15500,
    discountPrice: 14500,
    stockQuantity: 6,
    branchStock: { 'hyd-main': 3, 'hyd-gachibowli': 1, 'hyd-secunderabad': 2 },
    warranty: '1 Year Heavy Haul Road Leakage Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=600',
    available: true
  },
  {
    id: 'p-8',
    name: 'Double-Curved Executive Bus Front Glass',
    category: 'Bus Glass',
    brand: 'Volvo',
    model: '9400 Multi-Axle',
    year: '2016-2024',
    sku: 'BG-VOL-9400-FW',
    description: 'Panoramic wide double-curved premium laminated bus glass. High-definition optics and UV filtering.',
    price: 42000,
    discountPrice: 38999,
    stockQuantity: 3,
    branchStock: { 'hyd-main': 1, 'hyd-gachibowli': 1, 'hyd-secunderabad': 1 },
    warranty: '2 Years Manufacturer Sealant Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600',
    available: true
  },
  {
    id: 'p-9',
    name: 'Rear Right Quarter Triangle Glass',
    category: 'Quarter Glasses',
    brand: 'Kia',
    model: 'Seltos',
    year: '2019-2024',
    sku: 'QG-KIA-SEL-RR',
    description: 'Dark tinted rear right quarter vent window. Molded rubber trim included for waterproof fitment.',
    price: 3200,
    stockQuantity: 25,
    branchStock: { 'hyd-main': 15, 'hyd-gachibowli': 6, 'hyd-secunderabad': 4 },
    warranty: '1 Year Water Seep Guarantee',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600',
    available: true
  }
];

export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'Q-2026-001',
    customerName: 'Anil Kumar Reddy',
    phone: '+91 91234 56789',
    whatsapp: '919123456789',
    vehicleBrand: 'Audi',
    vehicleModel: 'A4 Sedan',
    vehicleYear: '2021',
    requiredGlassType: 'Front Windshields',
    status: 'converted',
    notes: 'Needs immediate emergency home on-site installation in Gachibowli area.',
    date: '2026-06-20T10:30:00Z',
    totalAmount: 16999,
    items: [
      { productId: 'p-1', name: 'Acoustic Laminated Front Windshield', price: 16999, quantity: 1 }
    ]
  },
  {
    id: 'Q-2026-002',
    customerName: 'Prashanth Gowd',
    phone: '+91 99887 76655',
    whatsapp: '919988776655',
    vehicleBrand: 'Toyota',
    vehicleModel: 'Fortuner',
    vehicleYear: '2020',
    requiredGlassType: 'Door Glasses',
    status: 'pending',
    notes: 'Left side front door glass broken due to stone hit. Please quote final price with labor.',
    date: '2026-06-24T14:15:00Z',
    totalAmount: 4200,
    items: [
      { productId: 'p-3', name: 'Front Left Side Door Glass (Tempered)', price: 4200, quantity: 1 }
    ]
  },
  {
    id: 'Q-2026-003',
    customerName: 'Meera Deshmukh',
    phone: '+91 88776 65544',
    whatsapp: '918877665544',
    vehicleBrand: 'Hyundai',
    vehicleModel: 'i20 Asta',
    vehicleYear: '2022',
    requiredGlassType: 'Side Mirrors',
    status: 'approved',
    notes: 'Wants delivery at Gachibowli IT park.',
    date: '2026-06-25T08:00:00Z',
    totalAmount: 6500,
    items: [
      { productId: 'p-5', name: 'Heated Power Foldable Side Mirror Assembly', price: 6500, quantity: 1 }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-101',
    quotationId: 'Q-2026-001',
    customerName: 'Anil Kumar Reddy',
    phone: '+91 91234 56789',
    vehicleBrand: 'Audi',
    vehicleModel: 'A4 Sedan',
    vehicleYear: '2021',
    orderDate: '2026-06-20T11:00:00Z',
    totalAmount: 16999,
    taxAmount: 2593.07, // GST 18% included inside
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    items: [
      { productId: 'p-1', name: 'Acoustic Laminated Front Windshield (Audi A4)', price: 16999, quantity: 1 }
    ],
    invoiceNumber: 'MGG-2026-GST-098'
  },
  {
    id: 'ORD-2026-102',
    customerName: 'Vikram Malhotra',
    phone: '+91 95551 12233',
    vehicleBrand: 'BMW',
    vehicleModel: '3 Series (G20)',
    vehicleYear: '2021',
    orderDate: '2026-06-23T15:30:00Z',
    totalAmount: 13500,
    taxAmount: 2059.32,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'razorpay',
    items: [
      { productId: 'p-2', name: 'Green Tinted Rear Defogger Glass (BMW 3 Series)', price: 13500, quantity: 1 }
    ],
    invoiceNumber: 'MGG-2026-GST-099'
  },
  {
    id: 'ORD-2026-103',
    customerName: 'Sanjay Dutt Pathak',
    phone: '+91 77766 55443',
    vehicleBrand: 'Kia',
    vehicleModel: 'Seltos',
    vehicleYear: '2020',
    orderDate: '2026-06-24T09:45:00Z',
    totalAmount: 3200,
    taxAmount: 488.14,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    items: [
      { productId: 'p-9', name: 'Rear Right Quarter Triangle Glass (Kia Seltos)', price: 3200, quantity: 1 }
    ],
    invoiceNumber: 'MGG-2026-GST-100'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    category: 'Rent',
    description: 'Nampally main warehouse monthly rental',
    amount: 45000,
    date: '2026-06-01',
    payee: 'Sri Rama Murthy Estate',
    branchId: 'hyd-main',
    paymentMethod: 'bank_transfer'
  },
  {
    id: 'exp-2',
    category: 'Salaries',
    description: 'Technician salaries - 3 staff',
    amount: 60000,
    date: '2026-06-05',
    payee: 'Branch Technicians',
    branchId: 'hyd-gachibowli',
    paymentMethod: 'cash'
  },
  {
    id: 'exp-3',
    category: 'Consumables',
    description: 'Purchase of Sika professional polyurethane glass sealants (30 cartridges)',
    amount: 18500,
    date: '2026-06-15',
    payee: 'Sika India Distributors',
    branchId: 'hyd-main',
    paymentMethod: 'upi'
  },
  {
    id: 'exp-4',
    category: 'Utilities',
    description: 'Electricity bill payment for Gachibowli store',
    amount: 8400,
    date: '2026-06-18',
    payee: 'TSSPDCL Hyderabad',
    branchId: 'hyd-gachibowli',
    paymentMethod: 'card'
  }
];

export const INITIAL_INVENTORY_LOGS: InventoryLog[] = [
  {
    id: 'log-1',
    productId: 'p-1',
    productName: 'Acoustic Laminated Front Windshield',
    type: 'stock_in',
    quantity: 10,
    branchId: 'hyd-main',
    date: '2026-06-01T10:00:00Z',
    reason: 'Fresh import batch arrived from Saint-Gobain Sekurit',
    user: 'Mohammed Usman Pathan'
  },
  {
    id: 'log-2',
    productId: 'p-3',
    productName: 'Front Left Side Door Glass (Tempered)',
    type: 'stock_out',
    quantity: 1,
    branchId: 'hyd-main',
    date: '2026-06-12T14:30:00Z',
    reason: 'Damaged in storage warehouse during handling',
    user: 'Karan Sharma'
  },
  {
    id: 'log-3',
    productId: 'p-5',
    productName: 'Heated Power Foldable Side Mirror Assembly',
    type: 'transfer',
    quantity: 2,
    branchId: 'hyd-gachibowli',
    date: '2026-06-18T16:00:00Z',
    reason: 'Stock transferred from Nampally to meet Gachibowli client demand',
    user: 'Syed Abdul Rahman'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c-1',
    name: 'Anil Kumar Reddy',
    phone: '+91 91234 56789',
    email: 'anil.reddy@gmail.com',
    vehicles: [
      { brand: 'Audi', model: 'A4 Sedan', year: '2021' }
    ],
    serviceHistory: [
      {
        id: 'sh-1',
        date: '2026-06-20',
        type: 'Windshield Replacement',
        cost: 16999,
        notes: 'Acoustic laminated windshield replaced with on-site fitment in Gachibowli. Customer requested sealant cure guidelines.'
      }
    ],
    notes: 'Premium customer. Prefers high-end European glass. Demands home-visit installation.'
  },
  {
    id: 'c-2',
    name: 'Sanjay Dutt Pathak',
    phone: '+91 77766 55443',
    email: 'sanjay.dutt@yahoo.com',
    vehicles: [
      { brand: 'Kia', model: 'Seltos', year: '2020' }
    ],
    serviceHistory: [
      {
        id: 'sh-2',
        date: '2026-06-24',
        type: 'Quarter Glass Replacement',
        cost: 3200,
        notes: 'Rear right quarter glass fitted at Hyderabad main store. Prompt payment.'
      }
    ],
    notes: 'Regular transport coordinator, occasionally brings corporate fleet vehicles.'
  }
];

export const INITIAL_PRICE_HISTORY: PriceHistory[] = [
  {
    id: 'ph-1',
    productId: 'p-1',
    productName: 'Acoustic Laminated Front Windshield',
    oldPrice: 19500,
    newPrice: 18500,
    updatedAt: '2026-06-01T09:00:00Z',
    updatedBy: 'Mohammed Usman Pathan'
  },
  {
    id: 'ph-2',
    productId: 'p-3',
    productName: 'Front Left Side Door Glass (Tempered)',
    oldPrice: 4500,
    newPrice: 4800,
    updatedAt: '2026-06-10T11:30:00Z',
    updatedBy: 'Mohammed Usman Pathan'
  }
];

export const INITIAL_CATALOGS: CatalogFile[] = [
  {
    id: 'cat-1',
    title: 'MG Glass Premium Windshields Catalog 2026',
    category: 'Windshields',
    updatedAt: '2026-06-15',
    pdfUrl: '#'
  },
  {
    id: 'cat-2',
    title: 'MG Glass Mirrors & Side Glass Catalog 2026',
    category: 'Mirrors',
    updatedAt: '2026-06-18',
    pdfUrl: '#'
  }
];
