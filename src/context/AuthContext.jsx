import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import {
  customerLogin,
  customerSignup,
  customerLogout,
  getCustomer,
  getShopifyCustomerId,
} from '../services/shopify';

const AuthContext = createContext(null);

const TOKEN_COOKIE = 'smb_token';
const COOKIE_OPTS = { expires: 7, sameSite: 'Strict', secure: location.protocol === 'https:' };

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCustomer = useCallback(async (token) => {
    try {
      const c = await getCustomer(token);
      if (c) {
        setCustomer(c);
        setCustomerId(getShopifyCustomerId(c.id));
      } else {
        Cookies.remove(TOKEN_COOKIE);
      }
    } catch {
      Cookies.remove(TOKEN_COOKIE);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get(TOKEN_COOKIE);
    if (token) {
      loadCustomer(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [loadCustomer]);

  const login = async (email, password) => {
    const tokenObj = await customerLogin(email, password);
    Cookies.set(TOKEN_COOKIE, tokenObj.accessToken, COOKIE_OPTS);
    await loadCustomer(tokenObj.accessToken);
  };

  const signup = async (firstName, lastName, email, password) => {
    await customerSignup(firstName, lastName, email, password);
    await login(email, password);
  };

  const logout = async () => {
    const token = Cookies.get(TOKEN_COOKIE);
    if (token) {
      try { await customerLogout(token); } catch { /* ignore */ }
    }
    Cookies.remove(TOKEN_COOKIE);
    setCustomer(null);
    setCustomerId(null);
  };

  const getToken = () => Cookies.get(TOKEN_COOKIE) || null;

  return (
    <AuthContext.Provider value={{ customer, customerId, loading, login, signup, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
