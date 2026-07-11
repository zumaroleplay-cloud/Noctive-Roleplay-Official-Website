const config = require("./config");

async function callGemini({ text, systemInstruction }) {
  const { apiKey, model } = config.gemini;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text }] }],
      systemInstruction: systemInstruction
        ? { role: "system", parts: [{ text: systemInstruction }] }
        : undefined,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || `HTTP ${res.status}`);
  }

  const rawText = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
  if (!rawText) {
    throw new Error("AI tidak mengembalikan jawaban (mungkin diblokir oleh filter keamanan).");
  }
  return rawText;
}

// Tanya bebas ke AI (buat fitur "Ai" di website)
async function askGemini(pertanyaan) {
  return callGemini({ text: pertanyaan, systemInstruction: config.aiSystemInstruction });
}

// Nilai Character Story -> WAJIB balas JSON {verdict, reason?}
async function askGeminiCS(csText) {
  const rawText = await callGemini({ text: csText, systemInstruction: config.cs.systemInstruction });
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Gagal parsing hasil penilaian AI: ${err.message}`);
  }
  if (parsed.verdict !== "accept" && parsed.verdict !== "reject") {
    throw new Error("Format verdict dari AI tidak dikenali.");
  }
  return parsed;
}

module.exports = { askGemini, askGeminiCS };
