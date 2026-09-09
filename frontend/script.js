const ucuslar = [
  {
    ucusNo: "TK2241",
    havayolu: "THY",
    yon: "departure",
    hatTipi: "domestic",
    sehir: "Ankara",
    planlanan_saat: "13:35",
    tahmini_saat: "14:20",
    kapi: "2",
    durum: "Kalktı"
  },
  {
    ucusNo: "PC2657",
    havayolu: "PGT",
    yon: "departure",
    hatTipi: "domestic",
    sehir: "İstanbul",
    planlanan_saat: "17:35",
    tahmini_saat: "18:00",
    kapi: "5",
    durum: "Planlandı"
  },
  {
    ucusNo: "TK2351",
    havayolu: "AJT",
    yon: "departure",
    hatTipi: "domestic",
    sehir: "Antalya",
    planlanan_saat: "16:30",
    tahmini_saat: "17:00",
    kapi: "3",
    durum: "Gecikmeli"
  }
];

const tbody = document.querySelector("tbody");
const table = document.querySelector("table");
const tekUcusAlani = document.querySelector("#tek-ucus");
const gorselAlani = document.querySelector("#gorsel-yayin");
const gorselBaslik = document.querySelector("#gorsel-baslik");
const gorselResim = document.querySelector("#gorsel-resim");
const baslik = document.querySelector("#yayin-baslik");
const mesaj = document.querySelector("#ekran-mesaj");
const tamEkranButton = document.querySelector("#tam-ekran");

const params = new URLSearchParams(window.location.search);

// Parametre verilmezse ilk ekranı aç.
const screenId = Number(params.get("id") ?? "1");

function durumSinifi(durum) {
  if (durum === "Kalktı" || durum === "İndi") {
    return "durum-basarili";
  } else if (durum === "Planlandı") {
    return "durum-notr";
  } else if (durum === "Gecikmeli") {
    return "durum-uyari";
  } else if (durum === "İptal") {
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

  // Panelden gelindiyse seçilen yayını URL'den al.
  // Sadece ?id=3 yazıldıysa ekranın başlangıç atamasını kullan.
  const yayinId = params.has("yayinId")
    ? Number(params.get("yayinId"))
    : screen.yayinId;

  const page = pages.find(function(page) {
    return page.id === yayinId;
  });

  if (!page) {
    baslik.textContent = "Yayın bulunamadı";
    mesajGoster("URL içindeki yayın id değerini kontrol et.");
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
    tbody.innerHTML += `
      <tr>
        <td>${ucus.havayolu}</td>
        <td>${ucus.ucusNo}</td>
        <td>${ucus.sehir}</td>
        <td>${ucus.planlanan_saat}</td>
        <td>${ucus.tahmini_saat}</td>
        <td>${ucus.kapi}</td>
        <td class="${durumSinifi(ucus.durum)}">
          ${ucus.durum}
        </td>
      </tr>
    `;
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

renderYayin();
