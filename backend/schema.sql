-- Bu ayar her yeni veritabani baglantisinda etkinlestirilmelidir.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS flights (
    id INTEGER PRIMARY KEY,
    ucusNo TEXT NOT NULL UNIQUE,
    havayolu TEXT NOT NULL,
    yon TEXT NOT NULL,
    hatTipi TEXT NOT NULL,
    sehir TEXT NOT NULL,
    planlanan_saat TEXT NOT NULL,
    tahmini_saat TEXT NOT NULL,
    kapi TEXT NOT NULL,
    durum TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    tip TEXT NOT NULL,
    yon TEXT,
    hatTipi TEXT,
    ucusNo TEXT,
    baslik TEXT,
    resimYolu TEXT,
    resimAciklama TEXT,
    FOREIGN KEY (ucusNo) REFERENCES flights(ucusNo)
        ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS screens (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    yayinId INTEGER NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (yayinId) REFERENCES pages(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);
