import React from 'react';
import { Shield, Phone, Mail, MapPin, ExternalLink, MessageSquare } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#070b14] text-slate-400 border-t border-slate-900 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Brief */}
          <div className="space-y-4">
            <div className="flex items-center cursor-pointer select-none" onClick={() => handleNavClick('home')}>
              <svg viewBox="0 0 320 80" className="h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Silver metallic gradient for M */}
                  <linearGradient id="footer-silver-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#E2E8F0" />
                    <stop offset="50%" stopColor="#CBD5E1" />
                    <stop offset="75%" stopColor="#94A3B8" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                  
                  {/* Metallic Blue gradient for G */}
                  <linearGradient id="footer-blue-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="50%" stopColor="#0284C7" />
                    <stop offset="100%" stopColor="#0369A1" />
                  </linearGradient>
                </defs>

                {/* Blue Car Silhouette/Arch */}
                <path 
                  d="M 5 35 Q 45 10 95 12 Q 135 13 175 25 Q 160 27 145 27 Q 105 18 65 18 Q 30 18 5 35" 
                  fill="#0EA5E9" 
                />
                
                {/* Metallic 'M' in MG */}
                <text 
                  x="3" 
                  y="58" 
                  fontFamily="system-ui, -apple-system, sans-serif" 
                  fontSize="44" 
                  fontWeight="900" 
                  fontStyle="italic" 
                  fill="url(#footer-silver-grad)"
                  style={{ letterSpacing: '-2px' }}
                >
                  M
                </text>
                
                {/* Metallic 'G' in MG */}
                <text 
                  x="42" 
                  y="58" 
                  fontFamily="system-ui, -apple-system, sans-serif" 
                  fontSize="44" 
                  fontWeight="900" 
                  fontStyle="italic" 
                  fill="url(#footer-blue-grad)"
                  style={{ letterSpacing: '-2px' }}
                >
                  G
                </text>

                {/* "MG GLASS TRADERS" Text */}
                <text 
                  x="105" 
                  y="40" 
                  fontFamily="system-ui, -apple-system, sans-serif" 
                  fontSize="18" 
                  fontWeight="900" 
                  fill="#F8FAFC" 
                  style={{ letterSpacing: '0.5px' }}
                >
                  MG GLASS
                </text>
                <text 
                  x="200" 
                  y="40" 
                  fontFamily="system-ui, -apple-system, sans-serif" 
                  fontSize="18" 
                  fontWeight="900" 
                  fill="#0EA5E9" 
                  style={{ letterSpacing: '0.5px' }}
                >
                  TRADERS
                </text>

                {/* Subtext tagline */}
                <text 
                  x="105" 
                  y="58" 
                  fontFamily="system-ui, -apple-system, sans-serif" 
                  fontSize="7.5" 
                  fontWeight="700" 
                  fill="#64748B" 
                  style={{ letterSpacing: '1.2px' }}
                >
                  YOUR TRUSTED AUTOMOTIVE GLASS SOLUTION
                </text>
              </svg>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted automotive glass and vehicle mirror repair partner in Hyderabad. Offering premium, certified glass installations for luxury, executive, commercial, and utility vehicles.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wider uppercase text-xs">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNavClick('home')} className="hover:text-blue-400 transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('about')} className="hover:text-blue-400 transition">
                  About Us & Team
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="hover:text-blue-400 transition">
                  Services Offered
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('catalog')} className="hover:text-blue-400 transition">
                  Glass Catalog
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('request-glass')} className="hover:text-blue-400 transition font-medium text-blue-400">
                  Request Custom Glass
                </button>
              </li>
            </ul>
          </div>

          {/* Services Quick */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wider uppercase text-xs">Popular Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-blue-400 transition cursor-pointer" onClick={() => handleNavClick('services')}>Windshield Replacement</li>
              <li className="hover:text-blue-400 transition cursor-pointer" onClick={() => handleNavClick('services')}>Stone Crack Repair</li>
              <li className="hover:text-blue-400 transition cursor-pointer" onClick={() => handleNavClick('services')}>Side Door Glass Installation</li>
              <li className="hover:text-blue-400 transition cursor-pointer" onClick={() => handleNavClick('services')}>Panoramic Sunroof Re-sealing</li>
              <li className="hover:text-blue-400 transition cursor-pointer" onClick={() => handleNavClick('services')}>Cashless Insurance Claims</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-base mb-4 tracking-wider uppercase text-xs">Get In Touch</h3>
            <div className="flex items-start space-x-2 text-sm">
              <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <span>Door No. 4-8-121/A, Pillar No. 143, PV Narasimha Rao Expressway, Attapur, Hyderabad, TS - 500048</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-blue-500" />
              <a href="tel:+919324187807" className="hover:text-blue-400 transition">+91 93241 87807</a>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-blue-500" />
              <a href="mailto:info@mgglasstraders.com" className="hover:text-blue-400 transition">info@mgglasstraders.com</a>
            </div>
            <div className="pt-2 flex space-x-2">
              <a
                href="https://wa.me/919324187807?text=Hello%20MG%20Glass%20Traders,%20I'm%20interested%20in%20automotive%20glass%20repair."
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>WhatsApp Live Chat</span>
              </a>
            </div>
          </div>
        </div>

        {/* Separator */}
        <hr className="border-slate-900 my-12" />

        {/* Bottom credits */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 MG Glass Traders. All Rights Reserved.</p>
          <div className="mt-2 md:mt-0 flex space-x-4">
            <span className="text-slate-400">Powered by ZK Business Hub</span>
            <span className="hidden md:inline">|</span>
            <span className="text-slate-400">Developed by Mohammed Usman Pathan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
