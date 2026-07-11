const { askGemini } = require("../lib/gemini");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method tidak diizinkan." });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ success: false, message: "Pertanyaan wajib diisi." });
    }

    const answer = await askGemini(message.trim());
    return res.status(200).json({ success: true, answer });
  } catch (err) {
    console.error("Error !ai web:", err);
    return res.status(500).json({ success: false, message: err.message || "Terjadi kesalahan di server." });
  }
};
