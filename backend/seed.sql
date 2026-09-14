PRAGMA foreign_keys = ON;

-- Once ucuslar, sonra yayinlar, en son ekranlar eklenir.
-- Mevcut kayitlari tekrar ekleme veya degistirme.
INSERT INTO flights (
    ucusNo,
    havayolu,
    yon,
    hatTipi,
    sehir,
    planlanan_saat,
    tahmini_saat,
    kapi,
    durum
)
VALUES
    ('TK2241', 'THY', 'departure', 'domestic', 'Ankara', '13:35', '14:20', '2', 'Kalktı'),
    ('PC2657', 'PGT', 'departure', 'domestic', 'İstanbul', '17:35', '18:00', '5', 'Planlandı'),
    ('TK2351', 'AJT', 'departure', 'domestic', 'Antalya', '16:30', '17:00', '3', 'Gecikmeli')
ON CONFLICT(ucusNo) DO NOTHING;

INSERT INTO pages (id, name, tip, yon, hatTipi)
VALUES
    (1, 'İç Hatlar Gidiş', 'liste', 'departure', 'domestic'),
    (2, 'İç Hatlar Geliş', 'liste', 'arrival', 'domestic'),
    (3, 'Dış Hatlar Gidiş', 'liste', 'departure', 'international'),
    (4, 'Dış Hatlar Geliş', 'liste', 'arrival', 'international')
ON CONFLICT(id) DO NOTHING;

INSERT INTO pages (id, name, tip, baslik, resimYolu, resimAciklama)
VALUES (
    5,
    'Görsel / Duyuru',
    'gorsel',
    'Esenboğa Havalimanı''na Hoş Geldiniz',
    'images/hos-geldiniz.svg',
    'İyi yolculuklar. Uçuşunuzun güncel saat ve kapı bilgilerini uçuş ekranlarından takip edebilirsiniz.'
)
ON CONFLICT(id) DO NOTHING;

INSERT INTO pages (id, name, tip, ucusNo)
VALUES (6, 'Uçuş Bilgisi', 'tek-ucus', 'PC2657')
ON CONFLICT(id) DO NOTHING;

INSERT INTO screens (id, name, yayinId, status)
VALUES
    (1, 'Gidiş Salonu İç Hatlar', 1, 'online'),
    (2, 'Geliş Salonu İç Hatlar', 2, 'online'),
    (3, 'Gidiş Salonu Dış Hatlar', 3, 'online'),
    (4, 'Geliş Salonu Dış Hatlar', 4, 'online'),
    (5, 'Ana Salon', 5, 'offline'),
    (6, 'Kapı 1 Gidiş', 6, 'online')
ON CONFLICT(id) DO NOTHING;
