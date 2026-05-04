# Textvault API Documentation

## Overview

Dokumentasi ini memuat spesifikasi kontrak data untuk integrasi Frontend dan Backend aplikasi **Textvault**. Seluruh *request* ke server dan balasan (*response*) dari server menggunakan format JSON.

* **Base URL (Development):** http://localhost:3000
* **Base URL (Production):** https://textvault.arkanafaisal.my.id *(Prefix /api berlaku untuk rute fungsional)*

---

## 🔒 Authentication & Headers

Sebagian besar *endpoint* bersifat privat dan membutuhkan otentikasi. Backend Textvault menggunakan pendekatan JWT yang dikirimkan langsung melalui Header (bukan format Bearer).

* **Header Key:** accessToken
* **Header Value:** <jwt_token_string>
* **Content-Type:** application/json

**Catatan Refresh Token:**
Selain *access token*, *endpoint* otentikasi (/login, /register) akan mengatur *cookie* refreshToken bertipe httpOnly. Frontend wajib mengizinkan *credentials* (withCredentials: true pada Axios atau credentials: 'include' pada Fetch) agar mekanisme *refresh token* berfungsi.

---

## 🚦 Global Status Codes & Errors

Semua *endpoint* dapat merespons dengan kode status standar berikut:

* **200 OK / 201 Created:** Permintaan berhasil.
* **400 Bad Request:** Validasi Joi gagal atau format data salah. Contoh respons:

    { "error": "password is required" }

* **401 Unauthorized:** *Access token* hilang, kedaluwarsa, atau tidak valid.
* **403 Forbidden:** Berusaha memodifikasi/menghapus data milik *user* lain.
* **404 Not Found:** Data tidak ditemukan.
* **409 Conflict:** Data sudah ada (contoh: email sudah terdaftar).
* **429 Too Many Requests:** Terkena *rate limit*. (Body kosong).
* **500 Internal Server Error:** Gangguan pada server/database.

---

## 1. 🩺 Server Health

### Check Server Health

Mengecek status ketersediaan server, *database*, dan *redis cache*.

* **Method:** GET
* **Path:** /health
* **Auth Required:** No

**Success Response (200 OK):**

    {
      "status": "ok",
      "uptime": 145020,
      "timestamp": 1715012345678,
      "environment": "development",
      "services": {
        "db": "ok",
        "redis": "ok"
      }
    }

---

## 2. 🔐 Authentication ( /api/auth )

### 2.1 Register

Mendaftarkan akun baru. Akan langsung mendapatkan *access token* dan *cookie refresh token*.

* **Method:** POST
* **Path:** /api/auth/register
* **Auth Required:** No
* **Body Payload:**
  * username (string, required): Max 30 char, alphanumeric saja.
  * password (string, required): Min 6, Max 255 char.

**Success Response (201 Created):**

    {
      "accessToken": "eyJhbGciOiJIUz..."
    }

### 2.2 Login

Login menggunakan username atau email.

* **Method:** POST
* **Path:** /api/auth/login
* **Auth Required:** No
* **Body Payload:**
  * identifier (string, required): Bisa diisi email atau username.
  * password (string, required): Kata sandi pengguna.

**Success Response (200 OK):**

    {
      "accessToken": "eyJhbGciOiJIUz..."
    }

### 2.3 Refresh Token

Meminta *access token* baru menggunakan `refreshToken` yang ada di dalam *cookie*.

* **Method:** POST
* **Path:** /api/auth/refresh
* **Auth Required:** No (Membutuhkan Cookie refreshToken)

**Success Response (200 OK):**

    {
      "accessToken": "eyJhbGciOiJIUz..."
    }

### 2.4 Logout

Menghapus sesi *refresh token* di server dan menghapus *cookie* di klien.

* **Method:** POST
* **Path:** /api/auth/logout
* **Auth Required:** No (Membutuhkan Cookie refreshToken)

**Success Response (200 OK):** *(Empty Body)*

### 2.5 Verify Email

Verifikasi email menggunakan token yang dikirimkan via email.

* **Method:** POST
* **Path:** /api/auth/verify-email/:token
* **Auth Required:** No
* **Path Parameters:**
  * token (string, required): 64 char hex string.

**Success Response (200 OK):** *(Empty Body)*

### 2.6 Forgot Password

Meminta tautan *reset password* ke email terdaftar.

* **Method:** POST
* **Path:** /api/auth/forgot-password
* **Auth Required:** No
* **Body Payload:**
  * email (string, required): Email valid pengguna.

**Success Response (200 OK):** *(Empty Body)*

### 2.7 Reset Password

Mengatur ulang *password* menggunakan token *reset*.

* **Method:** POST
* **Path:** /api/auth/reset-password/:token
* **Auth Required:** No
* **Path Parameters:**
  * token (string, required): 64 char hex string.
* **Body Payload:**
  * password (string, required): Password baru (Min 6, Max 255 char).

**Success Response (200 OK):** *(Empty Body)*

---

## 3. 👤 Users ( /api/users )

### 3.1 Get My Profile

Mengambil data profil *user* yang sedang *login*.

* **Method:** GET
* **Path:** /api/users/me
* **Auth Required:** Yes (accessToken di Header)

**Success Response (200 OK):**

    {
      "displayName": "arkana",
      "email": "user@example.com",
      "publicKey": "pub_key_string"
    }

### 3.2 Update Username

Mengubah *username* dan *displayName*.

* **Method:** PATCH
* **Path:** /api/users/me/username
* **Auth Required:** Yes
* **Body Payload:**
  * username (string, required): Max 30 char, alphanumeric.

**Success Response (200 OK):** *(Empty Body)*

### 3.3 Update Public Key

Mengubah *public key* pengguna.

* **Method:** PATCH
* **Path:** /api/users/me/public-key
* **Auth Required:** Yes
* **Body Payload:**
  * publicKey (string, required): Max 255 char.

**Success Response (200 OK):** *(Empty Body)*

### 3.4 Request Email Verification

Meminta pengiriman token verifikasi ke alamat email baru.

* **Method:** PATCH
* **Path:** /api/users/me/email
* **Auth Required:** Yes
* **Body Payload:**
  * email (string, required): Email baru pengguna.

**Success Response (200 OK):** *(Empty Body)*

### 3.5 Update Password

Mengubah kata sandi pengguna (membutuhkan kata sandi lama).

* **Method:** PATCH
* **Path:** /api/users/me/password
* **Auth Required:** Yes
* **Body Payload:**
  * oldPassword (string, required): Kata sandi saat ini.
  * newPassword (string, required): Kata sandi baru (Min 6 char).

**Success Response (200 OK):** *(Empty Body)*

### 3.6 Delete Account

Menghapus akun pengguna beserta semua data yang terkait.

* **Method:** DELETE
* **Path:** /api/users/me
* **Auth Required:** Yes
* **Body Payload:**
  * username (string, required): Konfirmasi username untuk penghapusan.

**Success Response (200 OK):** *(Empty Body)*

---

## 4. 📝 Data Vault ( /api/data )

*Catatan: Seluruh data teks (content) dienkripsi di sisi database, namun secara otomatis didekripsi oleh backend sebelum dikirimkan ke frontend.*

### 4.1 Get My Data (List)

Mengambil daftar catatan milik pengguna. Mendukung pencarian, pengurutan, dan paginasi.

* **Method:** GET
* **Path:** /api/data/me
* **Auth Required:** Yes
* **Query Parameters:**
  * sort (string, optional): 'newest' (default), 'oldest', atau 'updated'.
  * visibility (string, optional): 'private' atau 'public'.
  * search (string, optional): Max 128 char. Mencari pada judul atau tag.
  * page (number, optional): Default 1.

**Success Response (200 OK):**

    [
      {
        "id": 1,
        "title": "Catatan Rahasia",
        "visibility": "private"
      }
    ]

### 4.2 Get Data By ID

Mengambil detail satu catatan secara spesifik.

* **Method:** GET
* **Path:** /api/data/:id
* **Auth Required:** Yes
* **Path Parameters:**
  * id (number, required): ID Data.

**Success Response (200 OK):**

    {
      "id": 1,
      "title": "Catatan Rahasia",
      "content": "Isi catatan teks yang sudah didekripsi...",
      "tags": ["penting", "rahasia"],
      "visibility": "private",
      "updatedAt": "2026-05-04T14:09:55.000Z"
    }

### 4.3 Create Data

Membuat catatan baru di dalam *vault*.

* **Method:** POST
* **Path:** /api/data/
* **Auth Required:** Yes
* **Body Payload:**
  * title (string, required): Max 31 char.
  * content (string, required): Max 1000 char.
  * tags (array of strings, optional): Max 5 item. Masing-masing max 12 char.

**Success Response (201 Created):**

    {
      "id": 5,
      "visibility": "private",
      "title": "Catatan Baru",
      "tags": ["ide"]
    }

### 4.4 Update Data (Common)

Memodifikasi judul, isi, dan/atau *tags* catatan. Minimal salah satu *field* harus dikirim.

* **Method:** PUT
* **Path:** /api/data/:id
* **Auth Required:** Yes
* **Path Parameters:**
  * id (number, required)
* **Body Payload (Kirim yang ingin diubah saja):**
  * title (string, optional)
  * content (string, optional)
  * tags (array, optional)

**Success Response (200 OK):** *(Empty Body)*

### 4.5 Update Visibility Status

Mengubah status catatan menjadi publik atau privat.

* **Method:** PATCH
* **Path:** /api/data/:id/status
* **Auth Required:** Yes
* **Path Parameters:**
  * id (number, required)
* **Body Payload:**
  * visibility (string, required): Harus 'private' atau 'public'.

**Success Response (200 OK):** *(Empty Body)*

### 4.6 Delete Data

Menghapus catatan.

* **Method:** DELETE
* **Path:** /api/data/:id
* **Auth Required:** Yes
* **Path Parameters:**
  * id (number, required)

**Success Response (200 OK):** *(Empty Body)*

---

## 5. 🌍 Public Access ( /api/public )

### 5.1 Get Public Data

Mengambil daftar catatan milik seorang pengguna yang berstatus `public` berdasarkan kecocokan *username* dan *publicKey*.

* **Method:** POST
* **Path:** /api/public/data
* **Auth Required:** No
* **Query Parameters:**
  * page (number, optional): Default 1.
* **Body Payload:**
  * username (string, required): Username target.
  * publicKey (string, required): *Public key* target.

**Success Response (200 OK):**

    [
      {
        "title": "Informasi Publik",
        "content": "Isi teks yang sudah didekripsi...",
        "tags": ["info"]
      }
    ]

---

## 6. 📢 Feedback ( /api/feedback )

### 6.1 Submit Feedback

Mengirimkan pesan *feedback* atau masukan ke sistem.

* **Method:** POST
* **Path:** /api/feedback/
* **Auth Required:** No
* **Body Payload:**
  * message (string, required): Teks masukan (Min 10, Max 300 char).

**Success Response (200 OK):** *(Empty Body)*