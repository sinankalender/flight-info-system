-- DB Browser: Execute SQL sekmesinde bloklari sirayla calistir.
-- SAVEPOINT ile baslayan bir denemeyi ROLLBACK TO ve RELEASE ile bitir.
PRAGMA foreign_keys = ON;

-- SELECT: Istenen sutunlari oku.
SELECT id, ucusNo, sehir, kapi FROM flights ORDER BY id;

-- WHERE: Yalnizca kosula uyan kayitlari getir.
SELECT ucusNo, sehir FROM flights WHERE durum = 'Gecikmeli';

-- JOIN: Ekran ile atanmis yayinin adini birlikte getir.
SELECT screens.name AS ekran, pages.name AS yayin
FROM screens
JOIN pages ON screens.yayinId = pages.id
ORDER BY screens.id;

-- UPDATE: Bir ekranin yayinini degistir, sonucu gor, sonra geri al.
SAVEPOINT yayin_deneme;

UPDATE screens SET yayinId = 3 WHERE id = 1;
SELECT id, name, yayinId FROM screens WHERE id = 1;

ROLLBACK TO yayin_deneme;
RELEASE yayin_deneme;

SELECT id, name, yayinId FROM screens WHERE id = 1;

-- DELETE: Bu denemede eklenen tek kaydi sil.
SAVEPOINT silme_deneme;

INSERT INTO screens (name, yayinId, status)
VALUES ('SQL Deneme Ekrani', 1, 'offline');

-- last_insert_rowid(): Bu baglantida en son eklenen satirin kimligi.
SELECT id, name FROM screens WHERE id = last_insert_rowid();

DELETE FROM screens WHERE id = last_insert_rowid();
SELECT COUNT(*) AS kalan_deneme_kaydi
FROM screens WHERE id = last_insert_rowid();

ROLLBACK TO silme_deneme;
RELEASE silme_deneme;

-- Denemeler sonunda baslangictaki kayitlar korunur.
SELECT COUNT(*) AS ekran_sayisi FROM screens;
PRAGMA foreign_key_check;
