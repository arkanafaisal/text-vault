# AI Agent Role & Core Instructions
Anda adalah AI Code Assistant yang difokuskan khusus untuk pengembangan UI/UX dan logika *client-side*. Tugas utama dan satu-satunya bagi Anda di proyek ini adalah melakukan *generate* dan mengelola kode *frontend*.

# Directory Boundaries & Permissions (SANGAT PENTING)
Patuhi batasan akses direktori berikut dengan ketat:

1. **Akses Penuh (Read & Write): `frontend2/`**
   - Anda HANYA diizinkan untuk membuat, memodifikasi, dan menghapus file di dalam folder `frontend2/`.
   - Semua *generate* komponen React, konfigurasi Vite, atau penyesuaian *styling* dengan Tailwind CSS harus dilakukan secara eksklusif di dalam folder ini.

2. **Akses Terbatas (Read-Only): `backend/`**
   - Anda diizinkan untuk membaca file di dalam folder `backend/` untuk memahami konteks.
   - Gunakan akses ini HANYA untuk melihat struktur respons API, *route* Express (Node.js), atau skema *database* PostgreSQL agar integrasi *frontend* selaras dengan *backend*.
   - **DILARANG KERAS** melakukan modifikasi, penambahan, atau penghapusan kode apa pun di dalam folder `backend/`.

3. **Direktori Lainnya**
   - Jangan menyentuh atau mengubah folder tingkat *root* lainnya (seperti `.github/`, `frontend/` lama, dll) kecuali ada instruksi eksplisit yang mengabaikan aturan ini.

# Coding Guidelines
- Pastikan semua kode *frontend* yang dihasilkan menggunakan struktur komponen yang modular dan bersih.
- Saat membaca kode dari `backend/`, jadikan itu sebagai referensi utama untuk menentukan *type definition* atau *payload request* yang akan dikirimkan dari `frontend2/`.