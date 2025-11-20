'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSession } from '@/app/lib/auth-client';

interface AuthContextType {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
  } | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  const value: AuthContextType = {
    user: session?.user
      ? {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.name || undefined,
          image: session.user.image || undefined,
        }
      : null,
    isLoading: isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
