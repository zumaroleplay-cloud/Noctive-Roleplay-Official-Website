/**
 * Config untuk Vercel Serverless Functions (Whitelist, Character Story, AI).
 *
 * PENTING SOAL KEAMANAN:
 * Semua kredensial (password DB, password SFTP, API key Gemini) di bawah ini
 * SEHARUSNYA diisi lewat Environment Variables di dashboard Vercel
 * (Project Settings -> Environment Variables), BUKAN ditulis langsung di
 * file ini kalau repo-nya bakal di-push ke GitHub publik.
 *
 * Fallback value di bawah cuma buat testing lokal (npm run dev / vercel dev).
 * Kalau kamu deploy ke Vercel dan sudah set Environment Variables di
 * dashboard, fallback ini otomatis nggak kepake.
 */
module.exports = {
  db: {
    host: process.env.DB_HOST || "139.162.57.187",
    user: process.env.DB_USER || "u19_xwFajRYptV",
    password: process.env.DB_PASSWORD || "wT3Sc^FmctxNDZT!Q=1pd4d=",
    database: process.env.DB_NAME || "s19_Panjul",
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 5,
  },

  accountsTable: {
    table: process.env.WL_TABLE || "accounts",
    nameColumn: process.env.WL_NAME_COLUMN || "name",
    pincodeColumn: process.env.WL_PINCODE_COLUMN || "pPincode",
  },

  sftp: {
    host: process.env.SFTP_HOST || "palay.antiddos.qzz.io",
    port: Number(process.env.SFTP_PORT) || 2022,
    username: process.env.SFTP_USERNAME || "panjulll.7c92d6ef",
    password: process.env.SFTP_PASSWORD || "Sukir",
    remotePath: process.env.SFTP_REMOTE_PATH || "/scriptfiles/Whitelist",
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "AQ.Ab8RN6KU0p2f1oENoawpku5Y3g0WRBfodNhvImwymqklvCbHQA",
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  },

  cs: {
    minWords: Number(process.env.CS_MIN_WORDS) || 200,
    plagiarismThreshold: Number(process.env.CS_PLAGIARISM_THRESHOLD) || 0.45,
    systemInstruction:
      "Kamu adalah admin penilai Character Story (backstory karakter) untuk server GTA Roleplay bernama Noctive Roleplay. " +
      "Tugas kamu HANYA menilai apakah Character Story yang diberikan layak di-ACCEPT atau harus di-REJECT, bukan untuk ngobrol atau menjawab pertanyaan apapun. " +
      "Kriteria layak ACCEPT: ceritanya masuk akal buat dunia Roleplay GTA (bukan fantasi/sihir/superhero), alur ceritanya jelas dan koheren, bukan cuma tempelan kata acak, ditulis dengan usaha (bukan asal generate/spam huruf), dan tidak menyalahi norma umum (SARA, pornografi, dsb). " +
      'Balas HANYA dalam format JSON murni tanpa markdown/backticks, persis seperti ini: {"verdict":"accept"} atau {"verdict":"reject","reason":"alasan singkat kenapa ditolak, dalam Bahasa Indonesia"}.',
  },

  aiSystemInstruction:
    "Kamu adalah asisten AI di website Noctive Roleplay. Jawab singkat, jelas, dan pakai Bahasa Indonesia santai kecuali diminta bahasa lain.",

  serverName: "Noctive Roleplay",
  serverIp: process.env.SERVER_IP || "139.162.57.187:7010",
  botCreator: "Panjulll",
  serverCreator: "Panjulll",

  // Template isi file .ini yang di-upload ke hosting (SESUAIKAN kalau format
  // yang dibaca gamemode kamu beda)
  iniTemplate: (data) => {
    return `[WHITELIST]
Name = ${data.namaIC}
Whitelisted = 1
AddedBy = WEBSITE
Date = ${data.date}
`;
  },
};
