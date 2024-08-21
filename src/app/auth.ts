// src/components/auth.ts
import Cookies from 'js-cookie';

export const login = (apiKey: string) => {
  Cookies.set('apiKey', apiKey, { expires: 90 }); // Store API key for 90 days
};

export const logout = () => {
  Cookies.remove('apiKey');
};

export const isAuthenticated = () => {
  return !!Cookies.get('apiKey');
};

export const getApiKey = () => {
  return Cookies.get('apiKey');
};