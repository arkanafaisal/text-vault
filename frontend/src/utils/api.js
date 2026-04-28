import { fetcher } from "./fetcher";
import apiMessages from "../helpers/apiMessages";

const api = {
  auth: {
    login: async ({ identifier, password }) => {
      const response = await fetcher('auth/login', { 
        method: 'POST', 
        body: { identifier, password },
        credentials: 'include' 
      }, false);
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.auth.login(response);
      
      let data = null;
      if (success) {
        // Ekstraksi JSON (accessToken) langsung di sini
        data = await response.clone().json().catch(() => null);
      }
      
      return { success, message, data, httpCode };
    },
    
    register: async ({ username, password }) => {
      const response = await fetcher('auth/register', { 
        method: 'POST', 
        body: { username, password },
        credentials: 'include' 
      }, false);
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.auth.register(response);
      
      let data = null;
      if (success) {
        data = await response.clone().json().catch(() => null);
      }
      return { success, message, data, httpCode };
    },
    
    logout: async () => {
      const response = await fetcher('auth/logout', { 
        method: 'POST',
        credentials: 'include'
      }, true);
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.auth.logout(response);
      
      return { success, message, data: null, httpCode };
    },
    
    verifyEmail: async (token) => {
      const response = await fetcher(`auth/verify-email/${token}`, { method: 'POST' }, false);
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.auth.verifyEmail(response);
      
      let data = null;
      if (success) {
        data = await response.clone().json().catch(() => null);
      }
      
      return { success, message, data, httpCode };
    },
    resetPassword: async (token, { password }) => {
      const response = await fetcher(`auth/reset-password/${token}`, { 
        method: 'POST', 
        body: { password } 
      }, false);
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.auth.resetPassword(response);
      
      let data = null;
      if (success) {
        data = await response.clone().json().catch(() => null);
      }
      
      return { success, message, data, httpCode };
    },
    forgotPassword: async ({ email }) => {
      const response = await fetcher('auth/forgot-password', { 
        method: 'POST', 
        body: { email } 
      }, false);
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.auth.forgotPassword(response);
      
      let data = null;
      if (success) {
        data = await response.clone().json().catch(() => null);
      }
      return { success, message, data, httpCode };
    },  
  },
  
  users: {
    getMe: async () => {
      const response = await fetcher('users/me', { method: 'GET' });
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.users.getMe(response);
      
      // Ekstrak data JSON HANYA jika request sukses
      let data = null;
      if (success) {
        data = await response.clone().json().catch(() => null);
      }
      
      // Kembalikan objek yang konsisten dan rapi
      return { success, message, data, httpCode };
    },
    
    updateUsername: async ({ username }) => {
      const response = await fetcher('users/me/username', { method: 'PATCH', body: { username } });
      const success = response.ok;
      const message = await apiMessages.users.updateUsername(response);
      let data = null;
      if (success) data = await response.clone().json().catch(() => null);
      return { success, message, data, httpCode: response.status };
    },
    
    updateEmail: async ({ email }) => {
      const response = await fetcher('users/me/email', { method: 'PATCH', body: { email } });
      const success = response.ok;
      const message = await apiMessages.users.updateEmail(response);
      let data = null;
      if (success) data = await response.clone().json().catch(() => null);
      return { success, message, data, httpCode: response.status };
    },
    
    updatePassword: async ({ oldPassword, newPassword }) => {
      const response = await fetcher('users/me/password', { method: 'PATCH', body: { oldPassword, newPassword } });
      const success = response.ok;
      const message = await apiMessages.users.updatePassword(response);
      let data = null;
      if (success) data = await response.clone().json().catch(() => null);
      return { success, message, data, httpCode: response.status };
    },

    updatePublicKey: async ({ publicKey }) => {
      const response = await fetcher('users/me/public-key', { method: 'PATCH', body: { publicKey } });
      const success = response.ok;
      const message = await apiMessages.users.updatePublicKey(response);
      let data = null;
      if (success) data = await response.clone().json().catch(() => null);
      return { success, message, data, httpCode: response.status };
    },
    deleteMe: async ({ username }) => {
      const response = await fetcher('users/me', { 
        method: 'DELETE', 
        body: { username } 
      }); // Parameter ketiga kosong = true (otomatis menyertakan cookies/token)
      
      const httpCode = response.status;
      const success = response.ok;
      const responseMessage = await apiMessages.users.deleteMe(response);
      
      return { success, message: responseMessage, data: null, httpCode };
    }
  },

  data: {
    getAll: async (paramsObj = {}) => {
      const { search, visibility, sort, page } = paramsObj;
      const params = new URLSearchParams();

      if (search) params.append('search', search);
      // Pengecekan ketat agar string kosong tidak terkirim, namun boolean/string 'true'/'false' tetap masuk
      if (visibility) params.append('visibility', visibility);
      if (sort) params.append('sort', sort);
      if (page) params.append('page', page);

      const queryString = params.toString();
      const endpoint = queryString ? `data/me?${queryString}` : 'data/me';

      const response = await fetcher(endpoint, { method: 'GET' });
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.data.getAll(response);
      
      let data = [];
      if (success) {
        const parsedData = await response.clone().json().catch(() => []);
        data = Array.isArray(parsedData) ? parsedData : [];
      }
      
      return { success, message, data, httpCode };
    },
    getById: async (id) => {
      const response = await fetcher(`data/${id}`, { method: 'GET' });
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.data.getById(response);
      
      let data = null;
      if (success) {
        data = await response.clone().json().catch(() => null);
      }
      
      return { success, message, data, httpCode };
    },
    create: async ({ title, content, tags }) => {
      const response = await fetcher('data', { 
        method: 'POST', 
        body: { title, content, tags } 
      });
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.data.create(response);
      
      let data = null;
      if (success) {
        data = await response.clone().json().catch(() => null);
      }
      
      return { success, message, data, httpCode };
    },
    updateCommon: async (id, { title, content, tags }) => {
      const response = await fetcher(`data/${id}`, { 
        method: 'PUT', 
        body: { title, content, tags } 
      });
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.data.updateCommon(response);
      
      let data = null;
      if (success) {
        data = await response.clone().json().catch(() => null);
      }
      
      return { success, message, data, httpCode };
    },
    updateStatus: async (id, { visibility }) => { // Parameter diubah dari isLocked
      const response = await fetcher(`data/${id}/status`, { 
        method: 'PATCH', 
        body: { visibility } // Payload dikirim sebagai visibility
      });
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.data.updateStatus(response);
      
      let data = null;
      if (success) {
        data = await response.clone().json().catch(() => null);
      }
      
      return { success, message, data, httpCode };
    },
    delete: async (id) => {
      const response = await fetcher(`data/${id}`, { method: 'DELETE' });
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.data.delete(response);
      
      return { success, message, data: null, httpCode };
    },
  },
  
  public: {
    getData: async ({ username, publicKey, page = 1 }) => {
      // Hanya kirim query ?page=X jika halaman lebih dari 1
      const url = page > 1 ? `public/data?page=${page}` : 'public/data';
      
      const response = await fetcher(url, { 
        method: 'POST', 
        body: { username, publicKey } 
      }, false);
      
      const httpCode = response.status;
      const success = response.ok;
      const message = await apiMessages.public.getData(response);
      
      let data = [];
      if (success) {
        const parsedData = await response.clone().json().catch(() => null);
        data = Array.isArray(parsedData) ? parsedData : (parsedData?.data || []);
      }
      
      return { success, message, data, httpCode };
    }
  },
  
  feedback: {
    send: async ({ message }) => {
      const response = await fetcher('feedback/', { 
        method: 'POST', 
        body: { message } 
      }, false); // <-- false: Mengirim tanpa token (akses publik)
      
      const httpCode = response.status;
      const success = response.ok;
      const responseMessage = await apiMessages.feedback.send(response);
      
      return { success, message: responseMessage, data: null, httpCode };
    }
  }
};

export default api;