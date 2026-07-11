// Format wajib nama IC: Nama_Belakang, tiap bagian diawali huruf kapital lalu huruf kecil
// Contoh valid: Hisma_Roizu, John_Doe | Contoh salah: hisma_roizu, Hisma123, HismaRoizu
function isValidNamaIC(name) {
  return /^[A-Z][a-z]+_[A-Z][a-z]+$/.test(name);
}

function normalizeCsText(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Pecah teks jadi "shingles" (potongan N kata berturutan) buat deteksi kemiripan
function getShingles(text, n = 5) {
  const words = normalizeCsText(text).split(" ").filter(Boolean);
  const shingles = new Set();
  for (let i = 0; i <= words.length - n; i++) {
    shingles.add(words.slice(i, i + n).join(" "));
  }
  return shingles;
}

// Similarity Jaccard antar 2 set shingle (0 = beda total, 1 = identik)
function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

module.exports = { isValidNamaIC, normalizeCsText, getShingles, jaccardSimilarity, countWords };
