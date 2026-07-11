const config = require("../lib/config");
const { getPool } = require("../lib/db");
const { getShingles, jaccardSimilarity, countWords } = require("../lib/csUtils");
const { askGeminiCS } = require("../lib/gemini");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method tidak diizinkan." });
  }

  try {
    const { namaIC, text } = req.body || {};

    if (!text || typeof text !== "string") {
      return res.status(400).json({ success: false, message: "Character Story wajib diisi." });
    }

    const csText = text.trim();
    const wordCount = countWords(csText);

    if (wordCount < config.cs.minWords) {
      return res.status(400).json({
        success: false,
        message: `Minimal ${config.cs.minWords} kata. Punya kamu baru ${wordCount} kata.`,
      });
    }

    const pool = getPool();

    // 1) Cek plagiat dulu (lokal, cepat, gratis) sebelum panggil AI
    const [rows] = await pool.query("SELECT story_text FROM cs_web_submissions");
    const newShingles = getShingles(csText);
    let bestSimilarity = 0;
    for (const row of rows) {
      const sim = jaccardSimilarity(newShingles, getShingles(row.story_text));
      if (sim > bestSimilarity) bestSimilarity = sim;
    }

    if (bestSimilarity >= config.cs.plagiarismThreshold) {
      return res.status(200).json({
        success: false,
        verdict: "plagiarism",
        message: "❌Character Story Kamu Di Tolak Karena Plagiat Character Story orang lain/sudah pernah di buat oleh orang lain",
      });
    }

    // 2) Kalau lolos cek plagiat, baru nilai kelayakannya pakai AI
    const verdict = await askGeminiCS(csText);

    if (verdict.verdict === "accept") {
      await pool.query(
        "INSERT INTO cs_web_submissions (nama_ic, story_text) VALUES (?, ?)",
        [namaIC ? String(namaIC).trim() : null, csText]
      );
      return res.status(200).json({ success: true, verdict: "accept", message: "✅ Character Story Kamu Di Accept" });
    }

    return res.status(200).json({
      success: false,
      verdict: "reject",
      message: `❌ Character Story Kamu Di Tolak\nAlasan: ${verdict.reason || "Tidak memenuhi kriteria Character Story."}`,
    });
  } catch (err) {
    console.error("Error !cs web:", err);
    return res.status(500).json({ success: false, message: err.message || "Terjadi kesalahan di server." });
  }
};
