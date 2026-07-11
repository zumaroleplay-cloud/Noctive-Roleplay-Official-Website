const mysql = require("mysql2/promise");
const config = require("./config");

// Vercel serverless functions bisa "dingin" (cold start) tiap saat, jadi kita
// simpen pool di variabel global supaya kalau function-nya "hangat" (dipanggil
// lagi dalam waktu dekat), koneksi DB lama dipakai ulang, bukan bikin baru terus.
let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool(config.db);
  }
  return pool;
}

module.exports = { getPool };
