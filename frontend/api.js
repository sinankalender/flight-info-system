const API_URL = "http://127.0.0.1:8000";

async function veriGetir(endpoint, options = {}) {
  let response;
  try {
    response = await fetch(API_URL + endpoint, options);
  } catch (error) {
    throw new Error("Sunucuya ulaşılamadı. Bağlantıyı kontrol et; kayıt işlemi yaptıysan tekrar göndermeden önce listeyi yenile.");
  }

  if (!response.ok) {
    const hata = await response.json().catch(() => ({}));
    if (typeof hata.detail === "string") {
      throw new Error(hata.detail);
    }
    if (Array.isArray(hata.detail)) {
      const alanlar = {
        ucusNo: "Uçuş no", havayolu: "Havayolu", yon: "Yön",
        hatTipi: "Hat tipi", sehir: "Şehir", planlanan_saat: "Planlanan saat",
        tahmini_saat: "Tahmini saat", kapi: "Kapı", durum: "Durum",
      };
      const hataliAlanlar = hata.detail.map(item => {
        const alan = item.loc?.at(-1);
        return alanlar[alan] || "Form";
      });
      throw new Error(`Geçersiz veya eksik alan: ${[...new Set(hataliAlanlar)].join(", ")}. Bilgileri kontrol et.`);
    }
    throw new Error(`İstek başarısız: ${response.status}`);
  }

  // DELETE başarılı olduğunda yanıt gövdesi yoktur.
  if (response.status === 204) {
    return null;
  }

  const veri = await response.json();
  return veri;
}

function veriGonder(endpoint, method, veri) {
  return veriGetir(endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(veri),
  });
}
