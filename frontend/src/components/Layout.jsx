import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Rss, 
  MessageSquare, 
  Binary, 
  ClipboardCheck, 
  GitCompare, 
  Settings as SettingsIcon,
  Shield,
  Search,
  Bell,
  User,
  ExternalLink
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Regulatory Feed', href: '/feed', icon: Rss },
  { name: 'Ask Impact', href: '/ask', icon: MessageSquare },
  { name: 'Compliance Twin', href: '/twin', icon: Binary },
  { name: 'Audit Simulator', href: '/audit', icon: ClipboardCheck },
  { name: 'Policy Diff', href: '/diff', icon: GitCompare },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="flex h-screen bg-slate-950 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/40 border-r border-slate-800 flex flex-col justify-between backdrop-blur-md">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Shield className="w-5 h-5 text-indigo-100" />
            </div>
            <span className="font-display font-bold text-lg tracking-wider bg-gradient-to-r from-indigo-200 via-slate-100 to-indigo-100 bg-clip-text text-transparent">
              RIO AGENT
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/25 text-indigo-400 shadow-inner border-l-2 border-indigo-500 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Workspace Info Footer */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/20">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-850/40">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-xs font-semibold text-slate-200 truncate">Workspace Org</h4>
              <p className="text-[10px] text-slate-400 truncate">FinTech Sandbox</p>
            </div>
            <Link to="/settings" className="text-slate-500 hover:text-indigo-400">
              <SettingsIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800/60 bg-slate-900/10 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-3 max-w-md w-72">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search regulations or policies..."
                className="w-full bg-slate-900/60 border border-slate-850 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer text-slate-400 hover:text-slate-200">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></span>
            </div>

            <div className="h-4 w-[1px] bg-slate-800"></div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Compliance Score: 87%
              </span>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
