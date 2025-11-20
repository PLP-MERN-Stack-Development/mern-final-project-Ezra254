import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../../store/authStore';

interface AuthGateProps {
  children: ReactNode;
}

const AuthGate = ({ children }: AuthGateProps) => {
  const initialize = useAuthStore((state) => state.initialize);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (!hasHydrated || isHydrating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">Syncing your profile...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGate;



