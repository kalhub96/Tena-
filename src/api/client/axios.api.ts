import axios from 'axios';

export const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.100.97:3000',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// TODO: attach the login token here once you store it
// client.interceptors.request.use((config) => { ... return config; });