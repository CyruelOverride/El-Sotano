import { useSyncExternalStore } from 'react';
import { subscribe, getSessionEmail, login, logout } from '../services/authService';

export function useAuth() {
  const email = useSyncExternalStore(subscribe, getSessionEmail);
  return { isAdmin: !!email, email, login, logout };
}
