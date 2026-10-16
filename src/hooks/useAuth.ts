import { useState } from 'react';

export type User = { id: string; name: string; email: string };
type LoginResult = { user?: User; error?: string };

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      // TODO: replace with api/auth/auth.api.ts -> POST /auth/login
      await new Promise((r) => setTimeout(r, 600));
      if (password.length < 6) return { error: 'Invalid email or password' };
      const u: User = { id: '1', name: email.split('@')[0], email };
      setUser(u);
      return { user: u };
    } catch {
      return { error: 'Network error. Please try again.' };
    }
  };

  return { user, login };
}