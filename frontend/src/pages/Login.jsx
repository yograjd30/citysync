import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Activity, Sun, Moon, ArrowRight } from 'lucide-react';

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
      {/* Header */}
      <header className="w-full flex items-center justify-between z-10">
        <Badge type="Simulated" />

        <div className="flex items-center gap-0.5 bg-[var(--surface-raised)] border border-[var(--hairline)] rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-1 rounded transition-colors ${
              theme === 'light' ? 'bg-white/10 text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
            title="Light Theme"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-1 rounded transition-colors ${
              theme === 'dark' ? 'bg-white/10 text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
            title="Dark Theme"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md mx-auto my-auto z-10">
        <GlassCard className="p-7 sm:p-8" padding="p-7 sm:p-8">
          {/* Logo & Headline */}
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--surface-raised)] border border-[var(--hairline)] flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
                CitySync
              </h1>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                Infrastructure synchronization &amp; cascade intelligence
              </p>
            </div>
          </div>

          <p className="text-xs text-[var(--text-secondary)] mt-3.5 leading-relaxed">
            Decision-support platform modeling municipal traffic, electricity, and water as a unified, coupled network to preempt cascading infrastructure collapse.
          </p>

          {/* Three Concise Value Points */}
          <div className="my-5 space-y-2.5 pt-1 text-xs text-[var(--text-secondary)]">
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
              <div>
                <strong className="text-[var(--text-primary)] font-medium">Coupled Cascades:</strong> Quantized lags model how substation stress degrades signals and trips booster pumps.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
              <div>
                <strong className="text-[var(--text-primary)] font-medium">Future Fork:</strong> Branch timelines to test counter-measures and compare stability gains.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
              <div>
                <strong className="text-[var(--text-primary)] font-medium">Strict Honesty:</strong> Transparent three-tier badges separating simulation, coupling rules, and trained models.
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-3.5 p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={loginWithGoogle}
              isLoading={isLoading}
            >
              Sign In with Google
            </Button>

            <Button
              variant="secondary"
              size="md"
              className="w-full justify-center font-normal"
              onClick={handleDemoSignIn}
              isLoading={isLoading}
            >
              Evaluator Demo Mode (Instant Access)
            </Button>
          </div>
        </GlassCard>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-2 text-[11px] text-[var(--text-muted)] font-mono z-10">
        CitySync Intelligence • 8 Sectors • 24 Coupled Nodes
      </footer>
    </div>
  );
}
