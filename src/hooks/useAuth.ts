import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuth } from '../services/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuth((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Login/Logout helpers are thin wrappers over Firebase handlers
  const login = async () => {
    try {
      const mod = await import('../services/firebase');
      await mod.signInWithGoogle();
    } catch {
      // ignore in read-only environments
    }
  };

  const logout = async () => {
    try {
      const mod = await import('../services/firebase');
      await mod.logOut();
    } catch {
      // ignore in read-only environments
    }
  };

  return { user, login, logout };
};
