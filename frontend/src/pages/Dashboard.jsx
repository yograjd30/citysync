import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Activity, LogOut, Sun, Moon, Laptop, Shield } from 'lucide-react';

export function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-[100dvh] w-full flex flex-col p-4 sm:p-6 md:p-8">
      {/* Top Navigation Bar */}
      <header className="w-full flex items-center justify-between pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold tracking-tight text-white flex items-center gap-2">
              CitySync <Badge type="Simulated" />
            </h1>
            <p className="text-xs text-teal-400 font-mono">Operations Command Center</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme switcher */}
          <div className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-full p-1">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-full transition-all ${
                theme === 'light' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-full transition-all ${
                theme === 'dark' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center gap-3 pl-2">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-teal-400/40 object-cover"
              />
            )}
            <div className="hidden sm:block text-left text-xs">
              <div className="font-medium text-slate-200">{user?.name}</div>
              <div className="text-slate-400 font-mono text-[11px]">{user?.email}</div>
            </div>
            <Button
              variant="glass"
              size="sm"
              icon={LogOut}
              onClick={logout}
              title="Sign Out"
            >
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Body Skeleton */}
      <main className="flex-1 flex flex-col gap-6 py-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-semibold text-white">System Skeleton Initialized</h2>
              <p className="text-xs text-slate-300 mt-1">
                Google OAuth, Evaluator Demo Session, Living Glass Design Tokens, and Safari compatibility active.
              </p>
            </div>
            <Badge variant="normal">Ready for Step 2</Badge>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
