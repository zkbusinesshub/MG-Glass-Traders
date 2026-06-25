import React, { useState, useEffect } from 'react';
import { 
  Phone, Shield, ShieldCheck, MapPin, Award, CheckCircle, Search, 
  MessageSquare, Star, ArrowRight, Clock, Map, UserCheck, Upload,
  DollarSign, FileText, Settings, Heart, AlertTriangle
} from 'lucide-react';
import { Product, Branch, Quotation, VehicleCategory } from '../types';
import { getProducts, getBranches, getQuotations, saveQuotations } from '../utils/storage';

interface PublicWebsiteProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openLoginModal: () => void;
}

export default function PublicWebsite({ activeTab, setActiveTab, openLoginModal }: PublicWebsiteProps) {
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [branches, setBranches] = useState<Branch[]>(getBranches());

  useEffect(() => {
    setBranches(getBranches());
  }, [activeTab]);
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Request a glass form states
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custWhatsApp, setCustWhatsApp] = useState('');
  const [vehBrand, setVehBrand] = useState('');
  const [vehModel, setVehModel] = useState('');
  const [vehYear, setVehYear] = useState('');
  const [requiredGlass, setRequiredGlass] = useState<VehicleCategory>('Front Windshields');
  const [notes, setNotes] = useState('');
  const [imgFile, setImgFile] = useState<string | null>(null);
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Cart/Quote list states (simple localized quote cart)
  const [quoteCart, setQuoteCart] = useState<Product[]>([]);

  // Contact form states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  const categories: (VehicleCategory | 'All')[] = [
    'All',
    'Front Windshields',
    'Rear Windshields',
    'Door Glasses',
    'Quarter Glasses',
    'Sunroof Glass',
    'Side Mirrors',
    'Rear View Mirrors',
    'Truck Glass',
    'Bus Glass'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setImgFile(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddToQuote = (product: Product) => {
    if (!quoteCart.find((p) => p.id === product.id)) {
      setQuoteCart([...quoteCart, product]);
      // Prefill vehicle in glass request
      setVehBrand(product.brand);
      setVehModel(product.model);
      setVehYear(product.year);
      setRequiredGlass(product.category);
    }
    setActiveTab('request-glass');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone) {
      alert('Please fill out Name and Mobile Number');
      return;
    }

    const currentQuotes = getQuotations();
    const newQuoteId = `Q-2026-${String(currentQuotes.length + 1).padStart(3, '0')}`;
    
    // Check if there's items in the quote cart
    const items = quoteCart.map(item => ({
      productId: item.id,
      name: `${item.name} (${item.brand} ${item.model})`,
      price: item.discountPrice || item.price,
      quantity: 1
    }));

    const totalAmount = items.reduce((sum, i) => sum + i.price, 0) || 5000; // default estimated labor

    const newQuotation: Quotation = {
      id: newQuoteId,
      customerName: custName,
      phone: custPhone,
      whatsapp: custWhatsApp || custPhone,
      vehicleBrand: vehBrand,
      vehicleModel: vehModel,
      vehicleYear: vehYear,
      requiredGlassType: requiredGlass,
      imageUrl: imgFile || undefined,
      status: 'pending',
      notes: notes || (quoteCart.length > 0 ? `Inquiry for catalog products: ${quoteCart.map(p => p.sku).join(', ')}` : ''),
      date: new Date().toISOString(),
      totalAmount,
      items: items.length > 0 ? items : [{
        productId: 'custom',
        name: `${requiredGlass} for ${vehBrand} ${vehModel}`,
        price: 5000,
        quantity: 1
      }]
    };

    saveQuotations([...currentQuotes, newQuotation]);
    setRequestSuccess(true);
    setQuoteCart([]);
    
    // Reset form
    setCustName('');
    setCustPhone('');
    setCustWhatsApp('');
    setVehBrand('');
    setVehModel('');
    setVehYear('');
    setNotes('');
    setImgFile(null);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setContactName('');
    setContactEmail('');
    setContactMsg('');
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#0B1220] min-h-screen text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* ----------------- HOME PAGE ----------------- */}
      {activeTab === 'home' && (
        <div id="home-view" className="animate-fade-in">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-slate-950 via-[#0B1220] to-slate-900 py-24 md:py-32 overflow-hidden border-b border-slate-900">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-bold tracking-wider uppercase">
                  <Award className="h-4 w-4" />
                  <span>ISO 9001:2015 Certified Service</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
                  Your Trusted <span className="text-blue-500">Automotive Glass</span> Solution
                </h1>
                <p className="text-base text-slate-400 leading-relaxed">
                  MG Glass Traders specializes in premium windshield replacements, glass repairs, side mirrors, and sunroof servicing for all major automotive brands. Experience flawless OEM-grade quality fitments at unbeatable prices in Hyderabad.
                </p>
                
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => {
                      setActiveTab('request-glass');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="flex items-center space-x-2 px-6 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-extrabold text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    <span>Get Instant Quote</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href="https://wa.me/919324187807?text=Hello%20MG%20Glass%20Traders,%20I'm%20looking%20for%20automotive%20glass%20repair."
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-sm font-extrabold text-white shadow-lg active:scale-95 transition-all"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>WhatsApp Enquiry</span>
                  </a>
                  <a
                    href="tel:+919324187807"
                    className="flex items-center space-x-2 px-6 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-extrabold text-white border border-slate-700 active:scale-95 transition-all"
                  >
                    <Phone className="h-4 w-4 text-blue-400" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>

              {/* Glassmorphism Graphic Badge */}
              <div className="relative w-full max-w-md bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-blue-600 text-white rounded-full p-2 text-xs font-black shadow-lg">
                  HYD #1
                </div>
                <div className="flex items-center space-x-3 border-b border-slate-800 pb-4 mb-4">
                  <div className="bg-blue-500/10 p-2 rounded-lg">
                    <ShieldCheck className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">MG Premium Shield</h3>
                    <p className="text-xs text-slate-400">Professional Glass Installation Service</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>On-Site Doorstep Glass Installation Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Cashless Tie-up with Major General Insurances</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>AIS Certified Toughened Glass Imports</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Lifetime Leak-Proof Adhesive Sealant Guarantee</span>
                  </div>
                </div>

                {/* Live Branch Status */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <MapPin className="h-4 w-4 text-red-500 animate-pulse" />
                    <span>3 Active Branches in Hyderabad</span>
                  </div>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Open Now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Intro / Stats */}
          <div className="py-16 bg-[#070b14]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-lg">
                  <p className="text-3xl md:text-4xl font-extrabold text-blue-500">10,000+</p>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Glass Replaced</p>
                </div>
                <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-lg">
                  <p className="text-3xl md:text-4xl font-extrabold text-blue-500">12+</p>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Years Experience</p>
                </div>
                <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-lg">
                  <p className="text-3xl md:text-4xl font-extrabold text-blue-500">3</p>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Expert Branches</p>
                </div>
                <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-lg">
                  <p className="text-3xl md:text-4xl font-extrabold text-blue-500">100%</p>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">OEM Quality Glass</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="py-20 bg-[#0B1220]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                <h2 className="text-3xl font-extrabold tracking-tight text-white">Why Choose MG Glass Traders?</h2>
                <div className="h-1 w-20 bg-blue-500 mx-auto rounded"></div>
                <p className="text-slate-400 text-sm">
                  We combine premium materials, expert craftsmanship, and unmatched customer service to keep you and your vehicle safe on the road.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition duration-300">
                  <div className="h-12 w-12 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Multi-Brand OEM Quality</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    We source directly from Saint-Gobain Sekurit, AIS, AGC, and Pilkington. All glasses are original manufacturer equivalent and perfectly match vehicle dynamics.
                  </p>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition duration-300">
                  <div className="h-12 w-12 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Certified Technicians</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Our fitment specialists are factory trained to handle ADAS calibration support, defogger connections, and sensitive sensor systems without zero wiring errors.
                  </p>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition duration-300">
                  <div className="h-12 w-12 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-500 mb-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Same-Day Fitment Warranty</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Most glass replacements are completed within 2 to 4 hours. We back every single replacement with a 1-year leak-proof adhesive guarantee.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="py-20 bg-[#070b14]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                <h2 className="text-3xl font-extrabold tracking-tight text-white">Overwhelming Customer Love</h2>
                <div className="h-1 w-20 bg-blue-500 mx-auto rounded"></div>
                <p className="text-slate-400 text-sm">
                  Read real feedback from vehicle owners who trust MG Glass Traders with their windshield and mirror fitments.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex text-amber-500 mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                    </div>
                    <p className="text-sm text-slate-300 italic">
                      "I got my Audi A4 windshield replaced at their Uppal branch. Absolute OEM glass with rain sensor fitting. Saved me more than 40% compared to dealer quotes. Super job!"
                    </p>
                  </div>
                  <div className="mt-4 flex items-center space-x-3 border-t border-slate-800 pt-3">
                    <div className="h-8 w-8 rounded-full bg-blue-600/20 flex items-center justify-center font-bold text-xs text-blue-400">AR</div>
                    <div>
                      <p className="text-xs font-bold text-white">Anil Reddy</p>
                      <p className="text-[10px] text-slate-500">Audi A4 Owner</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex text-amber-500 mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                    </div>
                    <p className="text-sm text-slate-300 italic">
                      "Highly professional. Replaced the rear glass of my Toyota Fortuner right in my garage. Excellent sealant finish, defogger lines working perfectly. Highly recommend their home service."
                    </p>
                  </div>
                  <div className="mt-4 flex items-center space-x-3 border-t border-slate-800 pt-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-600/20 flex items-center justify-center font-bold text-xs text-emerald-400">VM</div>
                    <div>
                      <p className="text-xs font-bold text-white">Vikram Malhotra</p>
                      <p className="text-[10px] text-slate-500">Toyota Fortuner Owner</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex text-amber-500 mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                    </div>
                    <p className="text-sm text-slate-300 italic">
                      "Fantastic stock! My luxury vintage sedan side mirror glass was hard to find, but MG Glass Attapur had it in stock and custom cut it to match. Excellent craftsmanship."
                    </p>
                  </div>
                  <div className="mt-4 flex items-center space-x-3 border-t border-slate-800 pt-3">
                    <div className="h-8 w-8 rounded-full bg-purple-600/20 flex items-center justify-center font-bold text-xs text-purple-400">SD</div>
                    <div>
                      <p className="text-xs font-bold text-white">Sanjay Dutt</p>
                      <p className="text-[10px] text-slate-500">Mercedes Collector</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact & Map embed CTA */}
          <div className="py-20 bg-[#0B1220] border-t border-slate-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-extrabold tracking-tight text-white">Visit Our Attapur Main Hub</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Located conveniently in Attapur, we are fully equipped with specialized tools, high-capacity stock, and a spacious facility to manage up to 10 vehicle installations simultaneously. Walk-ins are welcome!
                </p>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span>Door No. 4-8-121/A, Pillar No. 143, PV Narasimha Rao Expressway, Attapur, Hyderabad, TS - 500048</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span>+91 93241 87807</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setActiveTab('branches')}
                    className="flex items-center space-x-1.5 px-4 py-2.5 rounded bg-slate-800 border border-slate-700 text-xs font-bold hover:bg-slate-700 transition"
                  >
                    <Map className="h-4 w-4 text-blue-400" />
                    <span>View Other Branches</span>
                  </button>
                </div>
              </div>

              {/* Map Embed */}
              <div className="h-80 w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
                <iframe
                  title="Attapur Main Branch Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.45207!2d78.4291094!3d17.3745207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb96534d386e93%3A0x2eee6fd4811774e3!2sM.G.+Glass+Traders!5e0!3m2!1sen!2sin!4v1719280000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- ABOUT US PAGE ----------------- */}
      {activeTab === 'about' && (
        <div id="about-view" className="py-16 md:py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 animate-fade-in">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">The MG Glass Story</h1>
            <div className="h-1.5 w-24 bg-blue-500 mx-auto rounded"></div>
            <p className="text-slate-400 text-base">
              A decade of engineering excellence, genuine automotive components, and committed consumer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Our Mission & Vision</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Since our humble beginnings in 2014, MG Glass Traders has aimed to deliver safe, transparent, and expert vehicle glass solutions. Our mission is to bridge the gap between high-priced dealership services and unreliable local mechanics, ensuring vehicle owners receive premium OEM equivalent automotive glasses with a certified warranty.
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                We believe that clear sight is vital for safe driving. By employing advanced polyurethane glass adhesive techniques and complying with international quality standards, we guarantee air-tight and water-tight windshield installations that restore your car's structural roof support system completely.
              </p>
            </div>
            {/* Visual badge */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-4 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/40 rounded-lg">
                  <p className="text-2xl font-bold text-blue-500">12+ Years</p>
                  <p className="text-xs text-slate-400 mt-1">In Glass Business</p>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-lg">
                  <p className="text-2xl font-bold text-blue-500">10k+</p>
                  <p className="text-xs text-slate-400 mt-1">Vehicles Replaced</p>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-lg">
                  <p className="text-2xl font-bold text-blue-500">30+</p>
                  <p className="text-xs text-slate-400 mt-1">Luxury Brands Supported</p>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-lg">
                  <p className="text-2xl font-bold text-blue-500">3 Hubs</p>
                  <p className="text-xs text-slate-400 mt-1">Active in Hyderabad</p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Leadership & Development credits */}
          <div className="space-y-8 bg-slate-900/20 border border-slate-900 rounded-xl p-8">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">Core Leadership Team</h3>
              <p className="text-slate-400 text-xs">The expert minds driving MG Glass Traders to new heights.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-slate-950 p-6 rounded-lg text-center border border-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200"
                  alt="Mohammed Usman Pathan"
                  className="h-20 w-20 rounded-full mx-auto object-cover border-2 border-blue-500 mb-4"
                />
                <h4 className="font-bold text-white">Mohammed Usman Pathan</h4>
                <p className="text-xs text-blue-400 font-medium">Founder & Managing Director</p>
                <p className="text-slate-500 text-[11px] mt-2">Over 15 years in logistics, auto parts distribution, and glass trading.</p>
              </div>

              <div className="bg-slate-950 p-6 rounded-lg text-center border border-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200"
                  alt="Zameer Khan"
                  className="h-20 w-20 rounded-full mx-auto object-cover border-2 border-blue-500 mb-4"
                />
                <h4 className="font-bold text-white">Zameer Khan</h4>
                <p className="text-xs text-blue-400 font-medium">Head of Finance & Operations</p>
                <p className="text-slate-500 text-[11px] mt-2">Handles commercial tie-ups, corporate fleets, and ZK Business Hub systems.</p>
              </div>

              <div className="bg-slate-950 p-6 rounded-lg text-center border border-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200"
                  alt="Syed Abdul Rahman"
                  className="h-20 w-20 rounded-full mx-auto object-cover border-2 border-blue-500 mb-4"
                />
                <h4 className="font-bold text-white">Syed Abdul Rahman</h4>
                <p className="text-xs text-blue-400 font-medium">Technical Lead Specialist</p>
                <p className="text-slate-500 text-[11px] mt-2">Ensures all high-tech European vehicle sensor windshields compile perfectly.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SERVICES PAGE ----------------- */}
      {activeTab === 'services' && (
        <div id="services-view" className="py-16 md:py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 animate-fade-in">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Professional Glass Services</h1>
            <div className="h-1.5 w-24 bg-blue-500 mx-auto rounded"></div>
            <p className="text-slate-400 text-base">
              No matter what vehicle you drive, our tailored fitment processes ensure maximum sealing protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">Windshield Replacement</h3>
              <p className="text-sm text-slate-400">
                Full-service replacement of damaged front or rear windshields. Includes removal of old sealant, vacuuming of loose glass pieces, applying high-grade primers, and installing a new laminated glass with premium polyurethane.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 pt-2">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" /> Original OEM Equivalent Brands</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" /> Built-in rain sensor brackets preserved</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" /> Defogger line grid testing</li>
              </ul>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">Windshield Repair</h3>
              <p className="text-sm text-slate-400">
                Before you replace, we check if we can repair! Bullseye, star, and crescent cracks under the size of a coin can be successfully sealed using advanced vacuum resins to halt crack expansion.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 pt-2">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" /> Done in 30 minutes</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" /> Restores glass structural strength</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" /> Highly cost effective alternative</li>
              </ul>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">Insurance Cashless Claim Assistance</h3>
              <p className="text-sm text-slate-400">
                Let us handle the headache. We have direct billing partnerships with major insurers (ICICI Lombard, HDFC Ergo, Bajaj Allianz, Tata AIG, etc.). We take care of surveyor assessments and process claims cashless.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 pt-2">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" /> Zero-hassle documentation assistance</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" /> Only pay policy compulsory excess</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-500 mr-2" /> Same day approvals on average</li>
              </ul>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">Door Glass & Side Mirror Assembly</h3>
              <p className="text-sm text-slate-400">
                Fitment of side door window glasses and mirrors. Includes cleaning internal door channel debris, lubricating motor tracks, adjusting auto-dimming wiring and indicator signals.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">On-site Home Installation</h3>
              <p className="text-sm text-slate-400">
                Can't drive with a shattered windshield? Our specialized mobile van comes with all necessary vacuum clamps, adhesives, and tools to install your windshield safely at your office or home driveway.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">Commercial Fleet Service (Truck & Bus)</h3>
              <p className="text-sm text-slate-400">
                Heavy vehicle double-curved panoramic glasses are tough to fit, but our commercial division specializes in large Volvo buses, Tata/Ashok Leyland transport trucks, and multi-axle logistics carriers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- PRODUCTS / CATALOG PAGE ----------------- */}
      {activeTab === 'catalog' && (
        <div id="catalog-view" className="py-16 md:py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Automotive Glass Catalog</h1>
            <div className="h-1.5 w-24 bg-blue-500 mx-auto rounded"></div>
            <p className="text-slate-400 text-sm">
              Search and filter through our ready stock of premium windshields, sunroofs, mirrors, and door glasses.
            </p>
          </div>

          {/* Search and Filters Block */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search brand, model, sku (e.g., Fortuner, Audi A4)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 rounded-lg border border-slate-800 py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition placeholder-slate-500"
                />
              </div>

              {/* Quote Cart Indicator */}
              {quoteCart.length > 0 && (
                <div className="text-xs bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-lg flex items-center space-x-2 shrink-0">
                  <span className="font-bold">{quoteCart.length} item(s) selected for Quote</span>
                  <button
                    onClick={() => {
                      setActiveTab('request-glass');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-2.5 py-1 rounded text-[10px] uppercase transition"
                  >
                    Build Quote Form Now
                  </button>
                </div>
              )}
            </div>

            {/* Category Pill Filters */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Products */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-slate-900/10 border border-dashed border-slate-800 rounded-xl space-y-4">
              <AlertTriangle className="h-12 w-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Glasses Found Matching Filters</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                We might still have it in our offline central warehouse. Please submit a "Request a Glass" form and our sales executives will trace it for you in 10 minutes.
              </p>
              <button
                onClick={() => setActiveTab('request-glass')}
                className="mt-2 text-sm text-blue-500 hover:underline font-bold"
              >
                Go to Request Form →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
                const discountPercent = product.discountPrice 
                  ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
                  : 0;

                return (
                  <div 
                    key={product.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group flex flex-col justify-between"
                  >
                    {/* Image Area */}
                    <div className="relative h-48 bg-slate-950 overflow-hidden shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      {product.discountPrice && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                          -{discountPercent}% OFF
                        </span>
                      )}
                      <span className="absolute bottom-3 right-3 bg-slate-900/90 text-[10px] text-blue-400 font-mono tracking-widest px-2 py-1 rounded border border-slate-800">
                        {product.sku}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-grow space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold tracking-wide uppercase">
                          {product.category}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          product.stockQuantity > 5 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-white text-base leading-snug group-hover:text-blue-400 transition">
                          {product.name}
                        </h3>
                        <p className="text-xs text-blue-500 font-semibold mt-1">
                          Compatible: {product.brand} {product.model} ({product.year})
                        </p>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="text-xs text-slate-500 flex items-center space-x-1 border-t border-slate-800/60 pt-2.5">
                        <Shield className="h-3.5 w-3.5 text-blue-500" />
                        <span>{product.warranty}</span>
                      </div>
                    </div>

                    {/* Pricing & Add Button */}
                    <div className="px-6 pb-6 pt-2 border-t border-slate-800/50 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Fitted Price</p>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-lg font-black text-white">
                            ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
                          </span>
                          {product.discountPrice && (
                            <span className="text-xs text-slate-500 line-through">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToQuote(product)}
                        className="px-3.5 py-2 text-xs font-bold rounded bg-blue-600 hover:bg-blue-700 text-white active:scale-95 transition-all"
                      >
                        Add to Quote
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ----------------- REQUEST A GLASS FORM ----------------- */}
      {activeTab === 'request-glass' && (
        <div id="request-glass-view" className="py-16 md:py-24 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 animate-fade-in">
          
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Request a Glass Quotation</h1>
            <div className="h-1.5 w-24 bg-blue-500 mx-auto rounded"></div>
            <p className="text-slate-400 text-sm">
              Fill out your vehicle specs and required glass details. Our technicians will instantly calculate the pricing and get in touch with you via phone/WhatsApp.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl relative">
            
            {requestSuccess ? (
              <div className="text-center py-10 space-y-4">
                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-2xl font-bold text-white">Quote Requested Successfully!</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Thank you! Your quote request has been received by our Hyderabad sales desk. We have registered this submission in our Central Admin Panel. A sales executive will WhatsApp/Call you with price estimates shortly.
                </p>
                <div className="flex justify-center space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setRequestSuccess(false);
                      setActiveTab('catalog');
                    }}
                    className="px-5 py-2 text-xs font-bold rounded bg-slate-800 border border-slate-700 text-white"
                  >
                    Back to Catalog
                  </button>
                  <button
                    onClick={() => setRequestSuccess(false)}
                    className="px-5 py-2 text-xs font-bold rounded bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-6">
                
                {/* Selected Quote Items Banner */}
                {quoteCart.length > 0 && (
                  <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Quote Requested For Catalog Products:</p>
                    <div className="space-y-1">
                      {quoteCart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs text-slate-300">
                          <span>• {item.name} ({item.brand} {item.model})</span>
                          <span className="font-bold text-white">₹{item.discountPrice || item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Customer Details */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anil Kumar Reddy"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      className="w-full bg-slate-950 rounded-lg border border-slate-800 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 91234 56789"
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      className="w-full bg-slate-950 rounded-lg border border-slate-800 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">WhatsApp Number</label>
                    <input
                      type="tel"
                      placeholder="Same as mobile if left empty"
                      value={custWhatsApp}
                      onChange={(e) => setCustWhatsApp(e.target.value)}
                      className="w-full bg-slate-950 rounded-lg border border-slate-800 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Required Glass Type</label>
                    <select
                      value={requiredGlass}
                      onChange={(e) => setRequiredGlass(e.target.value as VehicleCategory)}
                      className="w-full bg-slate-950 rounded-lg border border-slate-800 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      {categories.filter(c => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Vehicle Specs */}
                <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 space-y-4">
                  <p className="text-xs font-bold text-blue-400 tracking-wider uppercase">Vehicle Specifications</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Brand</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Audi"
                        value={vehBrand}
                        onChange={(e) => setVehBrand(e.target.value)}
                        className="w-full bg-slate-900 rounded border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Model</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. A4 Sedan"
                        value={vehModel}
                        onChange={(e) => setVehModel(e.target.value)}
                        className="w-full bg-slate-900 rounded border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Year</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2021"
                        value={vehYear}
                        onChange={(e) => setVehYear(e.target.value)}
                        className="w-full bg-slate-900 rounded border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* File Upload Simulation */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Upload Glass Picture (Optional)</label>
                  <div className="border border-dashed border-slate-800 hover:border-blue-500/50 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-950 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      id="upload-pic"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="upload-pic" className="cursor-pointer flex flex-col items-center justify-center w-full">
                      <Upload className="h-8 w-8 text-slate-500 mb-2" />
                      {imgFile ? (
                        <p className="text-xs text-emerald-400 font-bold">Image Uploaded Successfully!</p>
                      ) : (
                        <>
                          <p className="text-xs text-slate-400">Drag & drop or Click to choose file</p>
                          <p className="text-[10px] text-slate-500 mt-1">Supports JPG, PNG (Max 5MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                  {imgFile && (
                    <div className="mt-2 h-20 w-32 border border-slate-800 rounded overflow-hidden">
                      <img src={imgFile} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Additional Notes / Inquiry Details</label>
                  <textarea
                    rows={3}
                    placeholder="Provide any specific detail (e.g., ADAS camera support, rain sensor bracket, defogger element requirement...)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-950 rounded-lg border border-slate-800 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 rounded-lg bg-blue-600 py-3.5 px-4 text-sm font-bold text-white shadow-lg hover:bg-blue-700 active:scale-95 transition"
                >
                  <span>Submit Quotation Request</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ----------------- BRANCHES PAGE ----------------- */}
      {activeTab === 'branches' && (
        <div id="branches-view" className="py-16 md:py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 animate-fade-in">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Our Active Branches</h1>
            <div className="h-1.5 w-24 bg-blue-500 mx-auto rounded"></div>
            <p className="text-slate-400 text-sm">
              We have strategically established advanced service hubs across Hyderabad to ensure swift fitments and accessible doorstep logistics.
            </p>
          </div>

          <div className="space-y-12">
            {branches.map((branch, idx) => (
              <div 
                key={branch.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col md:flex-row gap-8 p-6 items-stretch"
              >
                {/* Branch Details */}
                <div className="flex-1 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold bg-blue-600/15 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded uppercase">
                        Hub 0{idx + 1}
                      </span>
                      <h3 className="text-xl font-bold text-white">{branch.name}</h3>
                    </div>

                    <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                      {branch.address}
                    </p>

                    <div className="mt-6 space-y-2 text-xs text-slate-300">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>Hours: {branch.hours}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4 text-blue-500" />
                        <span>Branch Manager: {branch.manager}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-blue-500" />
                        <span>Contact: {branch.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <a
                      href={`tel:${branch.phone}`}
                      className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center space-x-1 border border-slate-700"
                    >
                      <Phone className="h-3.5 w-3.5 text-blue-400" />
                      <span>Call Branch</span>
                    </a>
                    <a
                      href={`https://wa.me/${branch.whatsapp}?text=Hello%20${encodeURIComponent(branch.name)},%20I'm%20inquiring%20about%20an%20automotive%20glass.`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition flex items-center space-x-1"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>WhatsApp Desk</span>
                    </a>
                  </div>
                </div>

                {/* Map View */}
                <div className="w-full md:w-96 h-64 md:h-auto rounded-lg overflow-hidden border border-slate-800 shrink-0">
                  <iframe
                    title={`${branch.name} Map`}
                    src={branch.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '240px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ----------------- CONTACT US PAGE ----------------- */}
      {activeTab === 'contact' && (
        <div id="contact-view" className="py-16 md:py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Contact MG Glass Traders</h1>
            <div className="h-1.5 w-24 bg-blue-500 mx-auto rounded"></div>
            <p className="text-slate-400 text-sm">
              Have questions about insurance coverage, custom heavy truck glasses, or diagnostic calibrations? Send us a message or contact our office instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-6">Send A Direct Message</h3>

              {contactSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
                  <h4 className="text-xl font-bold text-white">Message Dispatched!</h4>
                  <p className="text-xs text-slate-400">
                    Your query has been logged. Our customer service desk will contact you via email or phone shortly.
                  </p>
                  <button
                    onClick={() => setContactSuccess(false)}
                    className="mt-4 px-4 py-2 rounded bg-slate-800 text-xs font-semibold hover:bg-slate-700 text-white"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mohammed Usman"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. usman@gmail.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Your Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe what you need... (e.g. quote for retro car front windshield replacement)"
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow transition-all active:scale-95"
                  >
                    Submit Message
                  </button>
                </form>
              )}
            </div>

            {/* General Contacts Detail */}
            <div className="space-y-8 flex flex-col justify-between">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                <h4 className="font-bold text-white text-base">Attapur Central Office</h4>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Door No. 4-8-121/A, Pillar No. 143, PV Narasimha Rao Expressway, Attapur, Hyderabad, TS - 500048</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span>+91 93241 87807</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <span>WhatsApp ID: +91 93241 87807</span>
                  </div>
                </div>
              </div>

              {/* Map embed of Main Office */}
              <div className="h-64 w-full rounded-xl overflow-hidden border border-slate-800">
                <iframe
                  title="Contact Page Office Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.45207!2d78.4291094!3d17.3745207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb96534d386e93%3A0x2eee6fd4811774e3!2sM.G.+Glass+Traders!5e0!3m2!1sen!2sin!4v1719280000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
