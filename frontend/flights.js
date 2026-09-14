let ucuslar = [];
let duzenlenenUcusId = null;
let islemSuruyor = false;

const ucusForm = document.querySelector("#ucus-form");
const formAlanlari = document.querySelector("#ucus-form-alanlari");
const formBaslik = document.querySelector("#ucus-form-baslik");
const kaydetButton = document.querySelector("#ucus-kaydet");
const vazgecButton = document.querySelector("#ucus-vazgec");
const yenileButton = document.querySelector("#ucus-yenile");
const ucusListesi = document.querySelector("#ucus-listesi");
const islemMesaji = document.querySelector("#ucus-islem-mesaji");
const listeMesaji = document.querySelector("#ucus-liste-mesaji");

function islemMesajiGoster(metin, hata = false) {
  islemMesaji.textContent = metin;
  islemMesaji.className = hata ? "mesaj-hata" : "mesaj-basarili";
  islemMesaji.hidden = !metin;
}

function mesgulDurumunuAyarla(mesgul) {
  islemSuruyor = mesgul;
  formAlanlari.disabled = mesgul;
  yenileButton.disabled = mesgul;
  ucusForm.setAttribute("aria-busy", String(mesgul));
  ucusListesi.querySelectorAll("button").forEach(button => {
    button.disabled = mesgul;
  });
}

function formuSifirla() {
  duzenlenenUcusId = null;
  ucusForm.reset();
  formBaslik.textContent = "Uçuş ekle";
  kaydetButton.textContent = "Uçuş ekle";
  vazgecButton.hidden = true;
}

function ucuslariGoster() {
  ucusListesi.replaceChildren();
  listeMesaji.hidden = ucuslar.length > 0;
  listeMesaji.textContent = "Henüz uçuş yok. Yukarıdaki formdan uçuş ekleyebilirsin.";

  ucuslar.forEach(ucus => {
    const satir = document.createElement("tr");
    satir.dataset.ucusId = ucus.id;
    const degerler = [
      ucus.havayolu, ucus.ucusNo, ucus.sehir,
      ucus.yon === "departure" ? "Gidiş" : "Geliş",
      ucus.hatTipi === "domestic" ? "İç hat" : "Dış hat",
      ucus.planlanan_saat, ucus.tahmini_saat, ucus.kapi, ucus.durum,
    ];
    degerler.forEach(deger => {
      const hucre = document.createElement("td");
      // Formdan gelen metni HTML olarak çalıştırmadan göster.
      hucre.textContent = deger;
      satir.append(hucre);
    });
    const islemler = document.createElement("td");
    islemler.className = "ucus-islemleri";
    for (const [islem, metin] of [["duzenle", "Düzenle"], ["sil", "Sil"]]) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.islem = islem;
      button.textContent = metin;
      button.className = islem === "sil" ? "danger" : "secondary";
      button.setAttribute("aria-label", `${ucus.ucusNo} ${metin}`);
      button.disabled = islemSuruyor;
      islemler.append(button);
    }
    satir.append(islemler);
    ucusListesi.append(satir);
  });
}

async function ucuslariYukle() {
  if (islemSuruyor) return;
  mesgulDurumunuAyarla(true);
  listeMesaji.hidden = false;
  listeMesaji.textContent = "Uçuşlar yükleniyor...";
  try {
    ucuslar = await veriGetir("/flights");
    ucuslariGoster();
  } catch (error) {
    listeMesaji.textContent = `Liste güncellenemedi. ${error.message}`;
  } finally {
    mesgulDurumunuAyarla(false);
  }
}

ucusForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (islemSuruyor || !ucusForm.reportValidity()) return;
  // Alanları devre dışı bırakmadan önce formdaki değerleri al.
  const veri = Object.fromEntries(new FormData(ucusForm));
  const id = duzenlenenUcusId;
  mesgulDurumunuAyarla(true);
  islemMesajiGoster("Kaydediliyor...");
  try {
    const kayit = await veriGonder(id === null ? "/flights" : `/flights/${id}`, id === null ? "POST" : "PUT", veri);
    if (id === null) {
      ucuslar.push(kayit);
    } else {
      ucuslar = ucuslar.filter(ucus => ucus.id !== id);
      ucuslar.push(kayit);
    }
    ucuslar.sort((a, b) => a.id - b.id);
    ucuslariGoster();
    formuSifirla();
    islemMesajiGoster(`${kayit.ucusNo} ${id === null ? "eklendi" : "güncellendi"}.`);
  } catch (error) {
    // Hata durumunda kullanıcının doldurduğu alanları koru.
    islemMesajiGoster(error.message, true);
  } finally {
    mesgulDurumunuAyarla(false);
  }
});

ucusListesi.addEventListener("click", async event => {
  const button = event.target.closest("button[data-islem]");
  if (!button || islemSuruyor) return;
  const id = Number(button.closest("tr").dataset.ucusId);
  const ucus = ucuslar.find(kayit => kayit.id === id);
  if (!ucus) return;

  if (button.dataset.islem === "duzenle") {
    duzenlenenUcusId = id;
    for (const [alan, deger] of Object.entries(ucus)) {
      const input = ucusForm.elements.namedItem(alan);
      if (input) input.value = deger;
    }
    formBaslik.textContent = `${ucus.ucusNo} uçuşunu düzenle`;
    kaydetButton.textContent = "Değişiklikleri kaydet";
    vazgecButton.hidden = false;
    islemMesajiGoster("");
    ucusForm.elements.namedItem("ucusNo").focus();
    return;
  }

  if (!window.confirm(`${ucus.ucusNo} uçuşu silinsin mi? Bu uçuşa bağlı tek uçuş yayınları, uçuş bulunamadı mesajı gösterecek.`)) return;
  mesgulDurumunuAyarla(true);
  islemMesajiGoster("Siliniyor...");
  try {
    await veriGetir(`/flights/${id}`, { method: "DELETE" });
    ucuslar = ucuslar.filter(kayit => kayit.id !== id);
    if (duzenlenenUcusId === id) formuSifirla();
    ucuslariGoster();
    islemMesajiGoster(`${ucus.ucusNo} silindi.`);
  } catch (error) {
    islemMesajiGoster(error.message, true);
  } finally {
    mesgulDurumunuAyarla(false);
  }
});

vazgecButton.addEventListener("click", () => {
  formuSifirla();
  islemMesajiGoster("");
  ucusForm.elements.namedItem("ucusNo").focus();
});
yenileButton.addEventListener("click", ucuslariYukle);
ucuslariYukle();
