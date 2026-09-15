const API_URL = "http://127.0.0.1:8000";

async function veriGetir(endpoint, options = {}) {
  const controller = new AbortController();
  const zamanAsimi = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(API_URL + endpoint, {
      cache: "no-store", ...options, signal: controller.signal,
    });
    if (!response.ok) {
      const hata = await response.json().catch(() => ({}));
      if (typeof hata.detail === "string") throw new Error(hata.detail);
      if (Array.isArray(hata.detail)) {
        const alanlar = {
          ucusNo: "Uçuş no", havayolu: "Havayolu", yon: "Yön",
          hatTipi: "Hat tipi", sehir: "Şehir", planlanan_saat: "Planlanan saat",
          tahmini_saat: "Tahmini saat", kapi: "Kapı", durum: "Durum", yayinId: "Yayın",
          name: "Yayın adı", baslik: "Duyuru başlığı", resimYolu: "Görsel adresi", resimAciklama: "Açıklama",
        };
        const hataliAlanlar = hata.detail.map(item => alanlar[item.loc?.at(-1)] || "Form");
        throw new Error(`Geçersiz veya eksik alan: ${[...new Set(hataliAlanlar)].join(", ")}. Bilgileri kontrol et.`);
      }
      throw new Error(`İstek başarısız: ${response.status}`);
    }
    // DELETE başarılı olduğunda yanıt gövdesi yoktur.
    return response.status === 204 ? null : await response.json();
  } catch (error) {
    if (error.name === "AbortError" || error instanceof TypeError) {
      const neden = error.name === "AbortError" ? "Sunucu zamanında yanıt vermedi." : "Sunucuya ulaşılamadı.";
      const kontrol = options.method && options.method !== "GET"
        ? " Kayıt işlemini tekrar göndermeden önce listeyi yenile."
        : "";
      throw new Error(`${neden} Bağlantıyı kontrol et.${kontrol}`);
    }
    throw error;
  } finally {
    clearTimeout(zamanAsimi);
  }
}

function veriGonder(endpoint, method, veri) {
  return veriGetir(endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(veri),
  });
}
