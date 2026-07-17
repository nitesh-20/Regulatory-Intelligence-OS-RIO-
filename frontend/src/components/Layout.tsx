import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Rss, 
  MessageSquare, 
  Binary, 
  GitCompare, 
  Settings as SettingsIcon,
  Shield,
  Search,
  Bell,
  User,
  Cpu,
  CornerDownLeft,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Assistant', href: '/chat', icon: MessageSquare },
  { name: 'Agents Console', href: '/agents', icon: Cpu },
  { name: 'Compliance Twin', href: '/twin', icon: Binary },
  { name: 'Policy Diff', href: '/diff', icon: GitCompare },
  { name: 'Regulatory Feed', href: '/feed', icon: Rss },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Command Palette State
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Toggle Command Palette on Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredNavigation = navigation.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Keyboard navigation inside Command Palette
  const handleCommandPaletteKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredNavigation.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredNavigation.length) % filteredNavigation.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredNavigation[selectedIndex]) {
        navigate(filteredNavigation[selectedIndex].href);
        setIsOpen(false);
        setSearchQuery('');
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#08080a] text-zinc-100 font-sans antialiased overflow-hidden select-none">
      
      {/* Linear-Style Minimal Sidebar */}
      <aside className="w-56 bg-[#09090b] border-r border-zinc-800/80 flex flex-col justify-between relative z-20">
        <div>
          {/* Logo Header */}
          <div className="h-14 flex items-center px-4 border-b border-zinc-900">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-6.5 h-6.5 rounded bg-zinc-100 flex items-center justify-center border border-zinc-200">
                <Shield className="w-3.5 h-3.5 text-zinc-900" />
              </div>
              <span className="font-semibold text-xs tracking-tight text-zinc-150">
                RIO Compliance
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-2 space-y-0.5 mt-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[11px] font-medium relative group transition-colors ${
                    isActive ? 'text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {/* Floating active nav slide background */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-zinc-800/50 rounded-md border border-zinc-700/30 -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-150' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer Panel */}
        <div className="p-3 border-t border-zinc-900">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/70 transition-colors">
            <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-[10px] font-semibold text-zinc-200 truncate">Regulatory Sandbox</h4>
              <p className="text-[8.5px] text-zinc-500 truncate">FinTech Suite</p>
            </div>
            <kbd className="text-[9px] text-zinc-500 font-bold px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 tracking-tighter shadow-inner pointer-events-none">
              ⌘K
            </kbd>
          </div>
        </div>
      </aside>

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Sleek Vercel-Style Top Header */}
        <header className="h-14 border-b border-zinc-800/80 bg-[#08080a] flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-3">
            {/* Search Trigger (⌘K prompt indicator) */}
            <div 
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-zinc-900/40 border border-zinc-800/80 text-[10.5px] text-zinc-450 hover:bg-zinc-900 hover:border-zinc-750 transition-all cursor-pointer w-60"
            >
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span>Search platform...</span>
              <kbd className="ml-auto text-[8.5px] font-bold px-1 py-0.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-500 select-none">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Notifications */}
            <div className="relative cursor-pointer text-zinc-400 hover:text-zinc-200 p-1">
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            </div>

            <div className="h-4 w-[1px] bg-zinc-800"></div>

            {/* Platform Score */}
            <div className="flex items-center gap-2">
              <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Compliance Score: 87%
              </span>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto bg-[#08080a] p-8 relative glow-spotlight">
          <div className="max-w-[1600px] w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* COMMAND PALETTE MODAL */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-28 px-4">
            {/* Overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="w-full max-w-lg bg-[#0c0c0e] border border-zinc-850/80 rounded-xl shadow-2xl overflow-hidden relative z-50 flex flex-col"
              onKeyDown={handleCommandPaletteKey}
            >
              {/* Input header */}
              <div className="p-3.5 border-b border-zinc-850/60 flex items-center gap-3">
                <Search className="w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type a command or page to navigate..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="flex-1 bg-transparent border-none text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none"
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Items List */}
              <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
                {filteredNavigation.length === 0 ? (
                  <p className="text-[10px] text-zinc-500 py-6 text-center">No commands or pages match your search.</p>
                ) : (
                  filteredNavigation.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={item.name}
                        onClick={() => {
                          navigate(item.href);
                          setIsOpen(false);
                          setSearchQuery('');
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'bg-zinc-800/80 text-zinc-100' : 'text-zinc-450 hover:bg-zinc-900/40 hover:text-zinc-250'
                        }`}
                      >
                        <item.icon className={`w-3.5 h-3.5 ${isSelected ? 'text-zinc-200' : 'text-zinc-500'}`} />
                        <span className="text-[11px] font-medium">{item.name}</span>
                        {isSelected && (
                          <span className="ml-auto text-[9px] text-zinc-500 flex items-center gap-1">
                            Go to
                            <CornerDownLeft className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Help */}
              <div className="p-2 border-t border-zinc-850/60 bg-zinc-900/10 flex items-center justify-between text-[8px] font-semibold text-zinc-500 px-4 select-none">
                <span className="flex items-center gap-2">
                  <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800">↑↓</kbd> to navigate
                  <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800">enter</kbd> to select
                </span>
                <span>ESC to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
