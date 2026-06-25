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
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavClick('home')}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                MG <span className="text-blue-500">GLASS</span>
              </span>
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
              <span>Mallapally Road, Nampally, Hyderabad, Telangana - 500001</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-blue-500" />
              <a href="tel:+919876543210" className="hover:text-blue-400 transition">+91 98765 43210</a>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-blue-500" />
              <a href="mailto:info@mgglasstraders.com" className="hover:text-blue-400 transition">info@mgglasstraders.com</a>
            </div>
            <div className="pt-2 flex space-x-2">
              <a
                href="https://wa.me/919876543210?text=Hello%20MG%20Glass%20Traders,%20I'm%20interested%20in%20automotive%20glass%20repair."
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
