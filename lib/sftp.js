const SftpClient = require("ssh2-sftp-client");
const config = require("./config");

function fmtDate(d) {
  return new Date(d).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
}

// Upload file .ini whitelist ke hosting server via SFTP
async function uploadWhitelistIni(namaIC) {
  if (
    !config.sftp.host ||
    config.sftp.host.startsWith("ISI_") ||
    !config.sftp.username ||
    config.sftp.username.startsWith("ISI_")
  ) {
    throw new Error(
      "Konfigurasi SFTP belum diisi (host/username masih placeholder). Isi Environment Variables SFTP_HOST/SFTP_USERNAME/SFTP_PASSWORD di Vercel."
    );
  }

  const sftp = new SftpClient();
  const content = config.iniTemplate({ namaIC, date: fmtDate(new Date()) });

  sftp.client?.on?.("error", (e) => console.error("[SFTP socket error]", e.message));

  try {
    await sftp.connect({
      host: config.sftp.host,
      port: config.sftp.port,
      username: config.sftp.username,
      password: config.sftp.password,
      readyTimeout: 15000,
    });

    const remoteFile = `${config.sftp.remotePath.replace(/\/+$/, "")}/${namaIC}.ini`;
    await sftp.put(Buffer.from(content, "utf-8"), remoteFile);
    return { success: true, remoteFile };
  } catch (err) {
    if (err.code === "ETIMEDOUT" || /timed?out/i.test(err.message)) {
      throw new Error(
        `Tidak bisa connect ke SFTP host "${config.sftp.host}:${config.sftp.port}" (timeout). Cek host/port SFTP dan firewall hosting.`
      );
    }
    throw err;
  } finally {
    try {
      await sftp.end();
    } catch {
      /* diamkan error saat nutup koneksi */
    }
  }
}

module.exports = { uploadWhitelistIni, fmtDate };
