import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Activity,
  Layers,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export function Login() {
  const { loginWithGoogle, loginAsDemo, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [error, setError] = useState(null);

  const handleDemoSignIn = async () => {
    try {
      setError(null);
      await loginAsDemo();
    } catch (err) {
      setError('Unable to authenticate demo session. Please try again.');
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-between p-4 sm:p-6 md:p-10 relative">
      {/* Top Header Bar */}
      <header className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Badge type="Simulated">Simulated City Data</Badge>
        </div>

        {/* Theme Switcher Toggle */}
        <div className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-full p-1">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-1.5 rounded-full transition-all ${
              theme === 'light' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Light Theme"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-1.5 rounded-full transition-all ${
              theme === 'dark' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Dark Theme"
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-1.5 rounded-full transition-all ${
              theme === 'system' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="System Theme"
          >
            <Laptop className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Glass Card Center */}
      <main className="w-full max-w-lg mx-auto my-auto z-10">
        <GlassCard className="p-8 sm:p-10 shadow-2xl relative overflow-hidden" highlight={true}>
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 shadow-inner">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                CitySync
              </h1>
              <p className="text-xs sm:text-sm text-teal-400 font-mono tracking-wide">
                See the chain reaction before it happens.
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-300 mt-4 leading-relaxed">
            A decision-support control platform for urban operators modeling traffic, electricity, and water as one living, interconnected network.
          </p>

          {/* Three Feature Value Bullets */}
          <div className="my-6 space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm text-slate-300">
                <strong className="text-slate-100 font-medium">Coupling Propagation:</strong> Trace how heat and substation strain trigger traffic signal degradation and water pump failures.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm text-slate-300">
                <strong className="text-slate-100 font-medium">Future Fork & Scenarios:</strong> Branch timelines, test counter-interventions, and measure residents protected before taking action.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm text-slate-300">
                <strong className="text-slate-100 font-medium">Strict Data Honesty:</strong> Transparent distinction between simulated physics, rule-based alerts, and trained machine learning models.
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center text-sm font-semibold shadow-lg shadow-teal-900/40"
              onClick={loginWithGoogle}
              isLoading={isLoading}
            >
              Continue with Google
            </Button>

            {/* Quick Demo Mode Bypass for Judges & Hackathon Evaluators */}
            <Button
              variant="glass"
              size="md"
              className="w-full justify-center text-xs sm:text-sm text-slate-300 border-slate-700/60 hover:text-white"
              onClick={handleDemoSignIn}
              isLoading={isLoading}
              icon={Sparkles}
            >
              Enter as Evaluator (Quick Demo Mode)
            </Button>
          </div>
        </GlassCard>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-2 text-xs text-slate-500 font-mono z-10">
        CitySync Urban Intelligence System &bull; 8 Zones &bull; 24 Nodes
      </footer>
    </div>
  );
}
