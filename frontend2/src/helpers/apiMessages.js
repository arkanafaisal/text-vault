// src/helpers/apiMessages.js

const handleCommonMessages = async (response) => {
  const status = response.status;
  
  if (status === 0) {
    return "Connection failed. Please check your internet connection.";
  }
  if (status >= 500) {
    return "An internal server error occurred. Please try again later.";
  }
  if (status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }
  if (status === 403) {
    return "Forbidden: You do not have permission to perform this action.";
  }
  if (status === 400) {
    const data = await response.clone().json().catch(() => null);
    return data?.error || "Invalid data provided (Bad Request).";
  }
  
  return null;
};

const apiMessages = {
  auth: {
    login: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 200) return "Login successful.";
      if (status === 401 || status === 404) return "Incorrect username/email or password.";
      
      return `Login failed (Code: ${status}).`;
    },
    
    register: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 201 || status === 200) return "Registration successful.";
      if (status === 409) return "Username is already taken."; // Sesuai koreksi Anda
      
      return `Registration failed (Code: ${status}).`;
    },
    
    forgotPassword: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 200) return "Password reset link sent.";
      if (status === 404) return "Email address not found in our system.";
      
      return `Failed to send reset link (Code: ${status}).`;
    },

    resetPassword: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;

      const status = response.status;
      if (status === 200) return "Password has been reset successfully.";
      if (status === 401 || status === 404) return "The reset link is invalid or has expired.";
      
      return `Failed to reset password (Code: ${status}).`;
    },

    verifyEmail: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;

      const status = response.status;
      if (status === 200) return "Email successfully verified.";
      if (status === 400 || status === 404) return "Verification failed. The link might be expired or invalid.";
      
      return `Verification failed (Code: ${status}).`;
    },

    logout: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;

      if (response.status === 200) return "Logged out successfully.";
      return `Logout failed (Code: ${response.status}).`;
    }
  },
  
  users: {
    getMe: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) {
        return common;
      }
      
      const status = response.status;
      if (status === 200) {
        // Parsing JSON secara Async untuk mengambil nama pengguna
        const data = await response.clone().json().catch(() => null);
        const name = data?.displayName || data?.username || "User";
        return `Welcome back, ${name}!`;
      }
      if (status === 404 || status === 401) {
        return "User profile not found. Please log in again.";
      }
      
      return `Failed to load profile (Code: ${status}).`;
    },

    updateUsername: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 200) return "Username updated successfully.";
      if (status === 409) return "Username is already taken.";
      
      return `Failed to update username (Code: ${status}).`;
    },
    
    updateEmail: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 200) return "Verification link sent to your new email.";
      if (status === 409) return "Email is already registered by another user.";
      
      return `Failed to update email (Code: ${status}).`;
    },
    
    updatePassword: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 200) return "Password updated successfully.";
      if (status === 401) return "Incorrect current password.";
      
      return `Failed to update password (Code: ${status}).`;
    },

    updatePublicKey: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;

      const status = response.status;
      if (status === 200) return "Public key updated successfully.";
      
      return `Failed to update public key (Code: ${status}).`;
    }
  },

  data: {
    getAll: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      if (response.status === 200) return "Data loaded successfully.";
      return `Failed to load vault data (Code: ${response.status}).`;
    },

    getById: async (response) => {
      const status = response.status;
      // HANYA 404 (Sesuai instruksi Anda)
      if (status === 404) return "Record not found. It may have been deleted.";

      const common = await handleCommonMessages(response);
      if (common) return common;
      
      if (status === 200) return "Record details loaded.";
      return `Failed to load record details (Code: ${status}).`;
    },

    create: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      if (response.status === 201 || response.status === 200) return "Data added successfully.";
      return `Failed to add new data (Code: ${response.status}).`;
    },
    
    updateCommon: async (response) => {
      const status = response.status;
      // 404 dan 403 ADA DI SINI
      if (status === 404) return "Update failed: Record no longer exists.";
      if (status === 403) return "Update failed: You don't have permission to edit this record.";

      const common = await handleCommonMessages(response);
      if (common) return common;
      
      if (status === 200) return "Information updated successfully.";
      return `Failed to update information (Code: ${status}).`;
    },
    
    updateStatus: async (response) => {
      const status = response.status;
      // 404 dan 403 ADA DI SINI
      if (status === 404) return "Security update failed: Record no longer exists.";
      if (status === 403) return "Security update failed: You don't have permission to modify this record.";

      const common = await handleCommonMessages(response);
      if (common) return common;
      
      if (status === 200) return "Security settings updated successfully.";
      return `Failed to update security settings (Code: ${status}).`;
    },

    delete: async (response) => {
      const status = response.status;
      // HANYA 404 (Sesuai instruksi Anda)
      if (status === 404) return "Deletion failed: Record may have already been deleted.";

      const common = await handleCommonMessages(response);
      if (common) return common;
      
      if (status === 200) return "Record deleted successfully.";
      return `Failed to delete record (Code: ${status}).`;
    }
  },

  public: {
    getData: async (response) => {
      // 400 Bad Request otomatis ditangkap oleh common dan mengembalikan data.error dari backend Anda
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 200) return "Public data retrieved successfully.";
      if (status === 404) return "No public records found or shared by this user.";
      
      return `Failed to load public data (Code: ${status}).`;
    }
  }
};

export default apiMessages;