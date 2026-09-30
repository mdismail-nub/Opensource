import React, { useState } from 'react';
import { ViewType, UserProfile } from '../../types';
import { GitBranch, Menu, X, CheckCircle2, Key, Search, Bell, ExternalLink } from 'lucide-react';

interface NavbarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  currentUser: UserProfile;
  isSignedIn: boolean;
  onToggleSignIn: () => void;
  onOpenTokenModal?: () => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  isSignedIn,
  onToggleSignIn,
  onOpenTokenModal,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const navLinks: { label: string; view: ViewType }[] = [
    { label: 'Explore', view: 'explore' },
    { label: 'Issues', view: 'issues' },
    { label: 'Roadmap', view: 'roadmap' },
    { label: 'Dashboard', view: 'dashboard' },
    { label: 'How It Works', view: 'how-it-works' },
  ];

  const handleNavClick = (view: ViewType) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const handleSearchClick = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      onNavigate('explore');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[var(--border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Wordmark */}
        <button
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
        >
          <div className="w-7.5 h-7.5 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-[var(--primary)] transition-colors">
            <GitBranch className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" />
          </div>
          <span className="text-[17px] font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
            OpenSourcePath
          </span>
        </button>

        {/* Center: Main Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`px-3 py-1.5 text-[14px] font-medium rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-[var(--primary)] bg-blue-50/80 font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Zone: Search, Notifications, Token, Profile (Desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            onClick={handleSearchClick}
            className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-neutral-500 bg-neutral-100 hover:bg-neutral-200/80 hover:text-neutral-900 rounded-lg transition-colors border border-transparent hover:border-neutral-300"
            title="Search repositories & issues"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden lg:inline text-neutral-400 font-mono text-[11px]">Search...</span>
            <kbd className="hidden lg:inline text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-neutral-400">⌘K</kbd>
          </button>

          {/* GitHub Token Config Key */}
          {onOpenTokenModal && (
            <button
              onClick={onOpenTokenModal}
              title="Configure GitHub API Token (Optional 5,000 req/hr rate limit)"
              className="p-2 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Key className="w-4 h-4" />
            </button>
          )}

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationToast(!showNotificationToast)}
              title="Notifications"
              className="p-2 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full" />
            </button>

            {showNotificationToast && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[var(--border)] rounded-xl shadow-lg p-3 z-50 text-[13px]">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <span className="font-semibold text-neutral-800">Notifications</span>
                  <span className="text-[11px] text-blue-600 font-medium">Live</span>
                </div>
                <div className="py-2.5 space-y-2">
                  <div className="flex items-start gap-2 text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-800 text-[12px]">Ready to contribute</p>
                      <p className="text-[11px] text-neutral-500">Search and analyze real repositories to build your learning path.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-neutral-200 mx-1" />

          {/* User Profile / Dashboard Link */}
          {isSignedIn ? (
            <button
              onClick={() => handleNavClick('dashboard')}
              title="View your dashboard"
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors text-left ${
                currentView === 'dashboard' ? 'bg-blue-50/80 ring-1 ring-blue-300' : 'hover:bg-neutral-100'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[12px] font-semibold ring-1 ring-blue-300">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-[13px] font-medium text-neutral-800 hidden lg:inline">
                {currentUser.name}
              </span>
            </button>
          ) : (
            <button
              onClick={onToggleSignIn}
              className="text-[13px] font-medium text-neutral-600 hover:text-neutral-900 px-3 py-1.5 transition-colors"
            >
              Sign in
            </button>
          )}

          <button
            onClick={() => handleNavClick('explore')}
            className="px-3.5 py-1.5 text-[13px] font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg shadow-xs hover:shadow transition-all active:scale-[0.98] whitespace-nowrap"
          >
            Explore Projects
          </button>
        </div>

        {/* Mobile: Search Icon + Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-1">
          <button
            onClick={handleSearchClick}
            title="Search"
            aria-label="Search"
            className="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
          >
            <Search className="w-5 h-5" />
          </button>

          {onOpenTokenModal && (
            <button
              onClick={onOpenTokenModal}
              title="GitHub Token"
              aria-label="GitHub Token"
              className="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
            >
              <Key className="w-4.5 h-4.5" />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`px-3 py-2.5 text-left text-[14px] font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-[var(--primary)] bg-blue-50 font-semibold'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="w-full py-2.5 px-3 text-left text-[14px] font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg flex items-center justify-between"
            >
              <span>Dashboard ({currentUser.name})</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </button>

            <button
              onClick={() => handleNavClick('explore')}
              className="w-full py-2.5 text-center text-[14px] font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg shadow-xs"
            >
              Explore Projects
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
