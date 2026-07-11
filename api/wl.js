const config = require("../lib/config");
const { getPool } = require("../lib/db");
const { uploadWhitelistIni, fmtDate } = require("../lib/sftp");
const { isValidNamaIC } = require("../lib/csUtils");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method tidak diizinkan." });
  }

  try {
    const { namaIC } = req.body || {};

    if (!namaIC || typeof namaIC !== "string") {
      return res.status(400).json({ success: false, message: "Nama IC wajib diisi." });
    }

    const trimmed = namaIC.trim();

    if (!isValidNamaIC(trimmed)) {
      return res.status(400).json({
        success: false,
        message: "Format nama IC salah. Wajib format Nama_Belakang (contoh: Hisma_Roizu).",
      });
    }

    const pool = getPool();

    // Cek apakah nama IC ini sudah pernah whitelist sebelumnya
    const [existing] = await pool.query(
      "SELECT id FROM wl_web_submissions WHERE nama_ic = ? LIMIT 1",
      [trimmed]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Nama IC ini sudah pernah whitelist sebelumnya. Hubungi admin kalau ini keliru.",
      });
    }

    // Upload file .ini ke hosting via SFTP
    await uploadWhitelistIni(trimmed);

    // Generate Pin Code random 1-999999
    const pinCode = Math.floor(Math.random() * 999999) + 1;

    // Set Pin Code ke tabel akun player
    try {
      const { table, nameColumn, pincodeColumn } = config.accountsTable;
      await pool.query(
        `UPDATE \`${table}\` SET \`${pincodeColumn}\` = ? WHERE \`${nameColumn}\` = ?`,
        [pinCode, trimmed]
      );
    } catch (dbErr) {
      console.error("Gagal set Pin Code ke database:", dbErr.message);
    }

    // Catat submission (biar gak bisa didaftarin dobel)
    await pool.query(
      "INSERT INTO wl_web_submissions (nama_ic, pin_code) VALUES (?, ?)",
      [trimmed, pinCode]
    );

    return res.status(200).json({
      success: true,
      namaIC: trimmed,
      serverIp: config.serverIp,
      serverName: config.serverName,
      botCreator: config.botCreator,
      serverCreator: config.serverCreator,
      pinCode,
      tanggal: fmtDate(new Date()),
    });
  } catch (err) {
    console.error("Error !wl web:", err);
    return res.status(500).json({ success: false, message: err.message || "Terjadi kesalahan di server." });
  }
};
