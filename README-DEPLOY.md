# Cara Deploy ke Vercel

## 1. Siapkan database
Jalankan isi `database-web.sql` di database MySQL kamu (sekali aja), lewat phpMyAdmin/HeidiSQL/dsb. Ini bikin 2 tabel baru: `wl_web_submissions` dan `cs_web_submissions`. Tabel `accounts` (buat set Pin Code) harus sudah ada duluan di database kamu.

## 2. Deploy lewat Vercel CLI (paling gampang)
```bash
npm install -g vercel
cd nama-folder-project-ini
vercel login
vercel
```
Ikuti instruksinya (pilih project baru, dsb).

## 3. Deploy lewat GitHub (kalau mau auto-deploy tiap update)
1. Push folder ini ke repo GitHub (**JANGAN commit file `.env` asli kalau ada, cuma `.env.example`**).
2. Buka [vercel.com](https://vercel.com) → New Project → import repo GitHub kamu.
3. Sebelum klik Deploy, buka bagian **Environment Variables**, isi SEMUA variabel yang ada di `.env.example` (`DB_HOST`, `DB_PASSWORD`, `SFTP_PASSWORD`, `GEMINI_API_KEY`, dst) dengan value asli kamu.
4. Klik Deploy.

## 4. Kenapa harus isi Environment Variables?
File `lib/config.js` punya nilai default (fallback) supaya bisa dites lokal, TAPI kalau repo-nya publik di GitHub, siapa aja bisa lihat password database & SFTP kamu langsung di kode. Isi Environment Variables di Vercel Dashboard supaya value ASLI-nya nggak pernah nongol di kode/repo.

## 5. Setelah deploy
- Buka `https://nama-project-kamu.vercel.app`
- Klik ☰ (hamburger) → coba menu **Whitelist**, **Character Story**, **Ai**
- Kalau ada error, cek log-nya di Vercel Dashboard → Project kamu → tab **Logs**

## Catatan penting
- Fitur website ini **terpisah** dari bot WhatsApp kamu. Bot WA tetap harus jalan sendiri di VPS/Pterodactyl seperti biasa (buat welcome, antilink, dsb) — itu nggak bisa dipindah ke Vercel karena butuh koneksi yang nyala terus-menerus.
- SFTP upload & query database dari fungsi Vercel butuh hosting/database kamu bisa diakses dari internet (bukan cuma localhost/IP tertentu). Kalau firewall database/SFTP kamu whitelist IP, kamu perlu buka akses buat IP Vercel (Vercel pakai IP dinamis, jadi biasanya harus dibuka untuk semua IP `0.0.0.0/0` atau minimal region tertentu).
