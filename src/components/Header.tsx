import React, { useState } from 'react';
import { Shield, Menu, X, MessageSquare, Phone, User as UserIcon, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  openLoginModal: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  openLoginModal,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'catalog', label: 'Products' },
    { id: 'request-glass', label: 'Request a Glass' },
    { id: 'branches', label: 'Branches' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setProfileDropdownOpen(false);
    setActiveTab('home');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B1220]/95 backdrop-blur-md text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex cursor-pointer items-center space-x-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-500/20">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              MG <span className="text-blue-500">GLASS</span>
            </span>
            <span className="block text-[9px] uppercase tracking-widest text-slate-400">Traders</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1 lg:space-x-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right CTA / Auth Controls */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="tel:+919876543210"
            className="flex items-center space-x-1 text-slate-300 hover:text-blue-400 transition text-sm font-medium"
          >
            <Phone className="h-4 w-4" />
            <span>Call Us</span>
          </a>

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 rounded-full bg-slate-800 p-1 pr-3 hover:bg-slate-700 transition"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-8 w-8 rounded-full object-cover border border-blue-500"
                />
                <div className="text-left">
                  <p className="text-xs font-semibold text-white leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-blue-400 font-medium leading-none mt-1">{currentUser.role}</p>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md bg-slate-900 border border-slate-800 shadow-xl py-1 text-white z-50">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('portal');
                      setProfileDropdownOpen(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4 text-blue-500" />
                    Management Panel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-800 transition"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center space-x-1 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <UserIcon className="h-4 w-4" />
              <span>Staff Portal</span>
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-2">
          {currentUser && (
            <button
              onClick={() => handleNavClick('portal')}
              className="p-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400"
              title="Portal"
            >
              <LayoutDashboard className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B1220] px-2 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <hr className="border-slate-800 my-2" />
          <div className="flex flex-col space-y-2 p-2">
            <a
              href="tel:+919876543210"
              className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 px-3 py-2 text-base"
            >
              <Phone className="h-5 w-5 text-blue-500" />
              <span>Call +91 98765 43210</span>
            </a>
            {currentUser ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-2 text-slate-300">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-9 w-9 rounded-full object-cover border border-blue-500"
                  />
                  <div>
                    <p className="text-sm font-semibold">{currentUser.name}</p>
                    <p className="text-xs text-blue-400">{currentUser.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNavClick('portal')}
                  className="flex w-full items-center px-3 py-2 text-base font-medium text-blue-400 hover:bg-slate-800 rounded-md"
                >
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Management Panel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-3 py-2 text-base font-medium text-red-400 hover:bg-slate-800 rounded-md"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLoginModal();
                }}
                className="flex w-full justify-center items-center space-x-2 px-4 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-base font-medium text-white shadow-md"
              >
                <UserIcon className="h-5 w-5" />
                <span>Staff Portal Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
