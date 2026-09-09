const pages = [
  {
    id: 1,
    name: "İç Hatlar Gidiş",
    tip: "liste",
    yon: "departure",
    hatTipi: "domestic"
  },
  {
    id: 2,
    name: "İç Hatlar Geliş",
    tip: "liste",
    yon: "arrival",
    hatTipi: "domestic"
  },
  {
    id: 3,
    name: "Dış Hatlar Gidiş",
    tip: "liste",
    yon: "departure",
    hatTipi: "international"
  },
  {
    id: 4,
    name: "Dış Hatlar Geliş",
    tip: "liste",
    yon: "arrival",
    hatTipi: "international"
  },
  {
    id: 5,
    name: "Görsel / Duyuru",
    tip: "gorsel",
    baslik: "Esenboğa Havalimanı'na Hoş Geldiniz",
    resimYolu: "images/hos-geldiniz.svg",
    resimAciklama: "İyi yolculuklar. Uçuşunuzun güncel saat ve kapı bilgilerini uçuş ekranlarından takip edebilirsiniz."
  },
  {
    id: 6,
    name: "Uçuş Bilgisi",
    tip: "tek-ucus",
    ucusNo: "PC2657"
  }
];

const screens = [
  {
    id: 1,
    name: "Gidiş Salonu İç Hatlar",
    yayinId: 1,
    status: "online"
  },
  {
    id: 2,
    name: "Geliş Salonu İç Hatlar",
    yayinId: 2,
    status: "online"
  },
  {
    id: 3,
    name: "Gidiş Salonu Dış Hatlar",
    yayinId: 3,
    status: "online"
  },
  {
    id: 4,
    name: "Geliş Salonu Dış Hatlar",
    yayinId: 4,
    status: "online"
  },
  {
    id: 5,
    name: "Ana Salon",
    yayinId: 5,
    status: "offline"
  },
  {
    id: 6,
    name: "Kapı 1 Gidiş",
    yayinId: 6,
    status: "online"
  }
];
