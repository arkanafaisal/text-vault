// src/utils/fetcher.js
import { navigate } from './navigation';

const devUrl = "http://localhost:3001/api/";
const prodUrl = "https://databox.arkanafaisal.my.id/api/";

const isDevelopment = true;
const BASE_URL = isDevelopment ? devUrl : prodUrl;

export async function fetcher(endpoint, options = {}, requireAuth = true) {
  let token = localStorage.getItem('accessToken');
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (requireAuth && token) {
    headers['accesstoken'] = token;
  }

  let body = options.body;
  
  if (body && typeof body === 'object') {
    body = JSON.stringify(body);
  }

  try {
    let response = await fetch(url, { ...options, headers, body });

    // Handle Auto-Refresh Token secara spesifik HANYA jika 401
    if (requireAuth && response.status === 401) {
      console.warn("Access Token tidak valid (401). Mencoba silent refresh...");
      
      const refreshRes = await fetch(`${BASE_URL}auth/refresh`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' 
      });

      if (refreshRes.ok) {
        // Kita terpaksa melakukan parsing mandiri di sini karena butuh token barunya
        const refreshResult = await refreshRes.json().catch(() => null);
        const newToken = refreshResult?.accessToken || (typeof refreshResult === 'string' ? refreshResult : null);

        if (newToken) {
          token = newToken;
          localStorage.setItem('accessToken', token);
          headers['accesstoken'] = token;
          
          // Retry request asli menggunakan token baru
          response = await fetch(url, { ...options, headers, body });
          return response;
        }
      }
      
      // Auto Logout HANYA jika upaya refresh mengembalikan 401 lagi
      if (refreshRes.status === 401) {
        console.error("Refresh Token tidak valid (401). Force Logout.");
        try {
          await fetch(`${BASE_URL}auth/logout`, { method: 'POST', credentials: 'include' });
        } catch (logoutError) {
          // Abaikan error jaringan saat force logout
        }

        localStorage.removeItem('accessToken');
        navigate('/');
      }
    }

    // Mengembalikan response murni, tanpa diotak-atik!
    return response;

  } catch (error) {
    console.error("Network Error:", error);
    // Kembalikan objek tiruan agar UI tidak crash saat membaca response.ok atau response.status
    return { ok: false, status: 0, json: async () => ({}) };
  }
}