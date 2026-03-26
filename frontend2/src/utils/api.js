// ==========================================
// src/utils/api.js
// ==========================================
import { navigate } from './navigation';

const devUrl = "http://localhost:3001/api/";
const prodUrl = "https://databox.arkanafaisal.my.id/api/";

const isDevelopment = true;
const BASE_URL = isDevelopment ? devUrl : prodUrl;

// ==========================================
// 1. FUNGSI FETCH TERPUSAT
// ==========================================
const coreFetch = async (endpoint, options = {}, requireAuth = true) => {
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
    // credentials: 'include' DIHAPUS dari default, akan diambil dari ...options jika ada
    let response = await fetch(url, { ...options, headers, body });
    let result = await response.json().catch(() => {
      return { success: false, message: 'Format response tidak valid dari server.' };
    });

    if (requireAuth) {
      if (response.status === 401) {
        console.warn("Access Token tidak valid (401). Mencoba silent refresh...");
        
        // Endpoint /refresh WAJIB pakai credentials: 'include' untuk mengirim cookie
        const refreshRes = await fetch(`${BASE_URL}auth/refresh`, {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include' 
        });

        if (refreshRes.ok) {
          const refreshResult = await refreshRes.json();
          
          if (refreshResult.success && refreshResult.data) {
            token = refreshResult.data;
            localStorage.setItem('accessToken', token);
            
            headers['accesstoken'] = token;
            // Retry request asli setelah refresh sukses
            response = await fetch(url, { ...options, headers, body });
            result = await response.json().catch(() => {
              return {};
            });
            return { response, result };
          }
        }
        
        response = { ...response, status: 403 }; 
      }

      if (response.status === 403) {
        console.error("Refresh Token tidak valid (403). Force Logout.");
        
        // --- IMPLEMENTASI FORCE LOGOUT KE BACKEND ---
        try {
          await fetch(`${BASE_URL}auth/logout`, {
            method: 'POST',
            credentials: 'include' // Wajib include agar backend bisa menghapus cookie refresh token
          });
        } catch (logoutError) {
          console.error("Gagal menembak API logout saat force logout:", logoutError);
        }
        // --------------------------------------------

        localStorage.removeItem('accessToken');
        navigate('/');
        return { response, result };
      }
    }

    if (response.status >= 500) {
      alert("Terjadi masalah pada server kami. Mohon coba lagi dalam beberapa menit.");
    }
    
    if (response.status === 429) {
      alert("Anda melakukan permintaan terlalu cepat. Mohon tunggu sebentar lalu coba lagi.");
    }

    return { response, result };

  } catch (error) {
    console.error("Network Error:", error);
    alert("Koneksi gagal. Pastikan Anda terhubung ke internet dan backend aktif.");
    return { response: { ok: false, status: 0 }, result: { success: false, message: 'Gagal terhubung ke server.' } };
  }
};

// ==========================================
// 2. OBJEK API
// ==========================================
const api = {
  auth: {
    // WAJIB credentials: 'include' agar browser menyimpan cookie dari server
    login: ({ identifier, password }) => coreFetch('auth/login', { 
      method: 'POST', 
      body: { identifier, password },
      credentials: 'include' 
    }, false),
    
    register: ({ username, password }) => coreFetch('auth/register', { 
      method: 'POST', 
      body: { username, password },
      credentials: 'include' 
    }, false),
    
    // WAJIB credentials: 'include' agar server bisa menghapus cookie
    logout: () => coreFetch('auth/logout', { 
      method: 'POST',
      credentials: 'include'
    }, true),
    
    // Fitur reset/verify tidak berhubungan dengan cookie sesi, jadi tidak perlu include
    verifyEmail: (token) => coreFetch(`auth/verify-email/${token}`, { method: 'POST' }, false),
    resetPassword: (token, { password }) => coreFetch(`auth/reset-password/${token}`, { method: 'POST', body: { password } }, false),
    forgotPassword: ({ email }) => coreFetch('auth/forgot-password', { method: 'POST', body: { email } }, false),
  },
  
  users: {
    // Request biasa sekarang BERSIH dari pengiriman cookie yang tidak perlu
    getMe: () => coreFetch('users/me', { method: 'GET' }),
    updateUsername: ({ username }) => coreFetch('users/me/username', { method: 'PATCH', body: { username } }),
    updateEmail: ({ email }) => coreFetch('users/me/email', { method: 'PATCH', body: { email } }),
    updatePassword: ({ oldPassword, newPassword }) => coreFetch('users/me/password', { method: 'PATCH', body: { oldPassword, newPassword } }),
    updatePublicKey: ({ publicKey }) => coreFetch('users/me/public-key', { method: 'PATCH', body: { publicKey } }),

    getMyDatas: () => coreFetch('/datas/me', { method: 'GET' }),
  },
  
  public: {
    // Ruang untuk endpoint data publik nanti
  }
};

export default api;