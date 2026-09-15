let ucuslar = [];
let pages = [];
let screens = [];

const tbody = document.querySelector("tbody");
const table = document.querySelector("table");
const tekUcusAlani = document.querySelector("#tek-ucus");
const gorselAlani = document.querySelector("#gorsel-yayin");
const gorselBaslik = document.querySelector("#gorsel-baslik");
const gorselResim = document.querySelector("#gorsel-resim");
const baslik = document.querySelector("#yayin-baslik");
const mesaj = document.querySelector("#ekran-mesaj");
const tamEkranButton = document.querySelector("#tam-ekran");
const baglantiDurumu = document.querySelector("#baglanti-durumu");
const YENILEME_ARALIGI = 5000;
let sonVeri = "";
let sonBasariliSaat = "";
let yenilemeZamanlayicisi;
let ekranKapandi = false;
let yenilemeSuruyor = false;

const params = new URLSearchParams(window.location.search);
if (params.get("onizleme") === "1") document.documentElement.classList.add("onizleme");

// Parametre verilmezse ilk ekranı aç.
const screenId = Number(params.get("id") ?? "1");

function durumSinifi(durum) {
  if (durum === "Kalktı" || durum === "İndi") {
    return "durum-basarili";
  } else if (durum === "Planlandı") {
    return "durum-notr";
  } else if (durum === "Gecikmeli") {
    return "durum-uyari";
  } else if (durum === "İptal" || durum === "İptal Edildi") {
    return "durum-iptal";
  } else {
    return "durum-notr";
  }
}

function mesajGoster(metin) {
  mesaj.textContent = metin;
  mesaj.hidden = false;
}

function renderYayin() {
  tbody.innerHTML = "";
  mesaj.textContent = "";
  mesaj.hidden = true;
  table.hidden = true;
  tekUcusAlani.hidden = true;
  gorselAlani.hidden = true;
  gorselResim.hidden = true;
  gorselResim.removeAttribute("src");

  const screen = screens.find(function(screen) {
    return screen.id === screenId;
  });

  if (!screen) {
    baslik.textContent = "Ekran bulunamadı";
    mesajGoster("URL içindeki ekran id değerini kontrol et.");
    return;
  }

  const page = pages.find(function(page) {
    return page.id === screen.yayinId;
  });

  if (!page) {
    baslik.textContent = "Yayın bulunamadı";
    mesajGoster("Ana sayfadan bu ekrana geçerli bir yayın ata.");
    return;
  }

  baslik.textContent = page.name;
  document.title = `${screen.name} — ${page.name}`;

  if (page.tip === "tek-ucus") {
    const ucus = ucuslar.find(function(ucus) {
      return ucus.ucusNo === page.ucusNo;
    });

    if (!ucus) {
      mesajGoster("Bu yayına bağlı uçuş bulunamadı.");
      return;
    }

    document.querySelector("#tek-havayolu").textContent = ucus.havayolu;
    document.querySelector("#tek-ucus-no").textContent = ucus.ucusNo;
    document.querySelector("#tek-sehir").textContent = ucus.sehir;
    document.querySelector("#tek-planlanan").textContent = ucus.planlanan_saat;
    document.querySelector("#tek-tahmini").textContent = ucus.tahmini_saat;
    document.querySelector("#tek-kapi").textContent = ucus.kapi;

    const durumAlani = document.querySelector("#tek-durum");
    durumAlani.textContent = ucus.durum;
    durumAlani.className = durumSinifi(ucus.durum);

    tekUcusAlani.hidden = false;
    return;
  }

  if (page.tip === "gorsel") {
    if (!page.resimYolu) {
      mesajGoster("Bu yayına bir görsel atanmamış.");
      return;
    }

    gorselBaslik.textContent = page.baslik || page.name;
    document.querySelector("#gorsel-aciklama").textContent = page.resimAciklama || "";
    gorselResim.alt = page.resimAciklama || gorselBaslik.textContent;
    gorselAlani.hidden = false;
    gorselResim.src = page.resimYolu;
    return;
  }

  if (page.tip !== "liste") {
    mesajGoster("Bu yayın tipi desteklenmiyor.");
    return;
  }

  table.hidden = false;

  // Ana uçuş dizisini değiştirmeden uygun uçuşları seç.
  const filtreliUcuslar = ucuslar.filter(function(ucus) {
    return (
      ucus.yon === page.yon &&
      ucus.hatTipi === page.hatTipi
    );
  });

  if (filtreliUcuslar.length === 0) {
    mesajGoster("Bu yayına uygun uçuş bulunmuyor.");
    return;
  }

  filtreliUcuslar.forEach(function(ucus) {
    const satir = document.createElement("tr");
    const alanlar = ["havayolu", "ucusNo", "sehir", "planlanan_saat", "tahmini_saat", "kapi", "durum"];
    alanlar.forEach(function(alan) {
      const hucre = document.createElement("td");
      hucre.textContent = ucus[alan];
      if (alan === "durum") hucre.className = durumSinifi(ucus.durum);
      satir.append(hucre);
    });
    tbody.append(satir);
  });
}

gorselResim.addEventListener("load", function() {
  if (!gorselAlani.hidden) {
    gorselResim.hidden = false;
  }
});

gorselResim.addEventListener("error", function() {
  if (!gorselAlani.hidden) {
    gorselResim.hidden = true;
    mesajGoster("Görsel yüklenemedi. Yayının resim yolunu kontrol et.");
  }
});

tamEkranButton.addEventListener("click", async function() {
  try {
    await document.documentElement.requestFullscreen();
  } catch (error) {
    mesajGoster(
      "Tam ekran açılamadı. Tarayıcının F11 tuşunu deneyebilirsin."
    );
  }
});

document.addEventListener("fullscreenchange", function() {
  // Tam ekranda düğmeyi gizle; tam ekrandan çıkınca göster.
  tamEkranButton.hidden = Boolean(document.fullscreenElement);
});

async function ekraniBaslat() {
  if (yenilemeSuruyor) return;
  yenilemeSuruyor = true;
  try {
    const sonuclar = await Promise.allSettled([
      veriGetir("/pages"), veriGetir("/screens"), veriGetir("/flights"),
    ]);
    const hata = sonuclar.find(sonuc => sonuc.status === "rejected");
    if (hata) throw hata.reason;
    const veriler = sonuclar.map(sonuc => sonuc.value);
    const yeniVeri = JSON.stringify(veriler);
    // Değişiklik yoksa DOM'u ve görseli tekrar oluşturma.
    if (yeniVeri !== sonVeri || (!gorselAlani.hidden && gorselResim.complete && !gorselResim.naturalWidth)) {
      [pages, screens, ucuslar] = veriler;
      renderYayin();
      sonVeri = yeniVeri;
    }
    sonBasariliSaat = new Date().toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul" });
    baglantiDurumu.textContent = `Son güncelleme: ${sonBasariliSaat}`;
    baglantiDurumu.className = "";
  } catch (error) {
    if (!sonVeri) {
      baslik.textContent = "Yayın yüklenemedi";
      mesajGoster("Veri bekleniyor. Bağlantı gelince yayın otomatik açılacak.");
    }
    const eskiVeriUyarisi = sonVeri ? `Gösterilen bilgiler güncel olmayabilir. Son başarılı güncelleme: ${sonBasariliSaat}. ` : "";
    baglantiDurumu.className = "baglanti-hatasi";
    baglantiDurumu.textContent = `${eskiVeriUyarisi}${error.message} Otomatik olarak tekrar denenecek.`;
  } finally {
    yenilemeSuruyor = false;
    // Bir tur bitince yenisini planla; yavaş istekler üst üste binmez.
    if (!ekranKapandi) yenilemeZamanlayicisi = setTimeout(ekraniBaslat, YENILEME_ARALIGI);
  }
}

window.addEventListener("pagehide", () => {
  ekranKapandi = true;
  clearTimeout(yenilemeZamanlayicisi);
});
window.addEventListener("pageshow", event => {
  if (event.persisted) {
    ekranKapandi = false;
    ekraniBaslat();
  }
});

baslik.textContent = "Yayın yükleniyor...";
mesajGoster("Veriler alınıyor...");
ekraniBaslat();
