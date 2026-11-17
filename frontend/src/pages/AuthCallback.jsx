import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/common/GlassCard';
import { Loader2 } from 'lucide-react';

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { exchangeOneTimeCode } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('Missing authentication exchange code.');
      return;
    }

    // Clean code from browser URL immediately (Safari privacy guideline)
    window.history.replaceState({}, document.title, window.location.pathname);

    exchangeOneTimeCode(code)
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch((err) => {
        setError(err.message || 'Authentication exchange failed.');
      });
  }, [searchParams, exchangeOneTimeCode, navigate]);

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4">
      <GlassCard className="p-8 max-w-md w-full text-center">
        {error ? (
          <div>
            <h2 className="text-lg font-heading font-semibold text-red-400 mb-2">Authentication Failed</h2>
            <p className="text-sm text-slate-300 mb-4">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="text-xs text-teal-400 hover:underline"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
            <h2 className="text-base font-medium text-slate-200">Verifying security token...</h2>
            <p className="text-xs text-slate-400">Completing one-time exchange for Safari and cross-domain access.</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
