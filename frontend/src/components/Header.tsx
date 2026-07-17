import { useState } from 'react';
import { LayoutGrid, Search, ChevronDown, User, Settings as SettingsIcon, LogOut, Menu, X } from 'lucide-react';
import { UserProfile } from '../types';
import UserAvatar from './UserAvatar';

interface HeaderProps {
  user: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSignOut: () => void;
}

export default function Header({ user, activeTab, setActiveTab, onSignOut }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'resources', name: 'Resources' },
    { id: 'reservations', name: 'Reservations' },
    { id: 'schedule', name: 'Schedule' }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/75 backdrop-blur-2xl border-b border-white/40 shadow-[0_8px_32px_0_rgba(120,0,206,0.02)]">
      <div className="flex justify-between items-center px-6 h-20 w-full max-w-7xl mx-auto">
        {/* Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/10">
            <LayoutGrid className="text-white w-5 h-5" />
          </div>
          <span className="font-sans font-black text-2xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            BookWise AI
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-8 items-center h-full">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`h-full border-b-2 px-1 text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center ${activeTab === item.id
                ? 'text-primary border-primary font-bold'
                : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary-fixed'
                }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Search Icon */}
          <button className="text-on-surface-variant hover:bg-black/5 p-2 rounded-xl transition-all duration-200 cursor-pointer hidden md:block">
            <Search className="w-5 h-5" />
          </button>

          {/* Profile & Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 hover:bg-black/5 p-1.5 pr-3 rounded-2xl transition-all duration-200 cursor-pointer select-none"
            >
              <UserAvatar name={user.name} className="w-10 h-10 border-2 border-primary/20 text-sm" />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-on-surface leading-tight">{user.name}</div>
                <div className="text-[10px] text-on-surface-variant leading-none">{user.role}</div>
              </div>
              <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-52 glass-panel rounded-2xl shadow-xl z-20 p-2 border border-white/60 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-3 py-2 border-b border-black/5 md:hidden mb-1">
                    <div className="text-sm font-bold text-on-surface">{user.name}</div>
                    <div className="text-xs text-on-surface-variant">{user.role}</div>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      alert('Profile settings: Simulating navigation');
                    }}
                    className="w-full px-3 py-2 hover:bg-primary-fixed/30 hover:text-primary rounded-xl text-left text-sm text-on-surface flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-primary" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      alert('System configuration settings: Simulating navigation');
                    }}
                    className="w-full px-3 py-2 hover:bg-primary-fixed/30 hover:text-primary rounded-xl text-left text-sm text-on-surface flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <SettingsIcon className="w-4 h-4 text-primary" />
                    <span>Settings</span>
                  </button>
                  <div className="h-px bg-black/5 my-1" />
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onSignOut();
                    }}
                    className="w-full px-3 py-2 hover:bg-error-container/50 text-error rounded-xl text-left text-sm flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-on-surface-variant p-2 rounded-xl hover:bg-black/5 transition-all cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 border-b border-black/5 backdrop-blur-lg animate-in slide-in-from-top duration-200">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-left text-base font-semibold transition-all ${activeTab === item.id ? 'text-primary font-bold px-2 bg-primary-fixed/20 rounded-xl' : 'text-on-surface-variant px-2'
                  }`}
              >
                {item.name}
              </button>
            ))}
            <div className="h-px bg-black/5 my-1" />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSignOut();
              }}
              className="py-2 text-left text-base font-semibold text-error px-2 flex items-center gap-2"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
