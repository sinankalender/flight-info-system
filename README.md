# Havalimanı Uçuş Bilgi Sistemi

Seçilen havalimanına ait gelen ve giden uçuşları listeleyen, filtreleme ve arama yapılabilen responsive web uygulaması.

> **Durum:** Geliştirme aşamasında (Gün 1 / 15)
> Bu proje DHMİ staj çalışması kapsamında geliştirilmektedir.

---

## Projenin amacı

Bu projenin öncelikli amacı hızlıca çalışan bir ürün ortaya çıkarmak değil, **web geliştirmenin temel mantığını uçtan uca öğrenmektir.**

Bu nedenle proje bilinçli olarak:

- Framework kullanmadan (React, Vue vb. olmadan) saf HTML/CSS/JavaScript ile başlatılmıştır
- Katman katman geliştirilmektedir (statik arayüz → dinamik veri → API → veritabanı)
- Gereksiz teknoloji ve karmaşık mimariden kaçınmaktadır

Öğrenilmesi hedeflenen konular:

**Frontend:** DOM, event, array metotları (`filter`, `map`, `forEach`), `fetch()`, `async`/`await`, HTTP istek mantığı

**Backend:** HTTP, REST API, endpoint, request/response, JSON, HTTP status kodları, query parametreleri

**Veritabanı:** Temel SQL (`CREATE TABLE`, `SELECT`, `INSERT`, `UPDATE`, `DELETE`), SQLAlchemy ile ORM mantığı

---

## Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, FastAPI |
| Veritabanı | SQLite, SQLAlchemy |

<!-- Bootstrap kullanmaya karar verirsen bu tabloya ekle -->

---

## Desteklenen havalimanları

| Kod | Havalimanı |
|-----|-----------|
| ESB | Ankara Esenboğa Havalimanı |
| IST | İstanbul Havalimanı |
| SAW | İstanbul Sabiha Gökçen Havalimanı |
| AYT | Antalya Havalimanı |
| ADB | İzmir Adnan Menderes Havalimanı |

---

## Özellikler

Tamamlandıkça işaretlenecek.

- [ ] Uçuşları listeleme
- [ ] Gelen / giden uçuş ayrımı
- [ ] Havalimanına göre filtreleme
- [ ] Uçuş durumuna göre filtreleme
- [ ] Uçuş numarası veya havayoluna göre arama
- [ ] Günlük istatistikler (toplam / gelen / giden / gecikmeli)
- [ ] Responsive tasarım (masaüstü, tablet, mobil)
- [ ] REST API ile veri sunumu
- [ ] Veritabanı entegrasyonu
- [ ] CRUD işlemleri

### Uçuş durumları

Planlandı · Uçağa Alım · Gecikmeli · İndi · Kalktı · İptal Edildi

---

## Veri stratejisi

Proje gerçek kurum verisine bağımlı değildir. Tüm geliştirme, gerçekçi biçimde hazırlanmış **örnek uçuş verileri** ile yapılmaktadır (örn. TK2123, PC4634, VF3005).

Projenin sonlarına doğru zaman kalırsa gerçek bir uçuş API'si entegrasyonu denenecektir. Bu entegrasyon opsiyoneldir; sistem dış API olmadan da tam çalışır durumda olmalıdır.

---

## Klasör yapısı

```text
airport-flight-system/
├── frontend/
│   └── index.html
└── README.md
```

<!-- Proje büyüdükçe bu ağacı güncelle. 
     Yeni dosya eklediğin gün burayı da güncellemeyi alışkanlık haline getir. -->

---

## Kurulum

### Frontend

`frontend/index.html` dosyasını tarayıcıda açmak yeterlidir.

### Backend

<!-- Gün 7'de doldurulacak.
     Şunları yazacaksın:
     - Python sürümü
     - Sanal ortam oluşturma komutu
     - Bağımlılıkların kurulumu
     - Sunucuyu başlatma komutu
     - Swagger arayüzünün adresi -->

_Backend henüz geliştirilmedi._

---

## API Endpointleri

<!-- Gün 8'den itibaren doldurulacak.
     Her endpoint için: metot, yol, ne yaptığı, varsa query parametreleri -->

_API henüz geliştirilmedi._

| Metot | Endpoint | Açıklama |
|-------|----------|----------|
| — | — | — |

---

## Mimari

<!-- Gün 15'te tamamlanacak.
     Basit bir akış şeması yeterli:
     Tarayıcı → FastAPI → SQLite -->

_Geliştirme tamamlandığında eklenecek._

---

## Ekran görüntüleri

<!-- Gün 2-3'ten sonra masaüstü ve mobil ekran görüntüsü ekle -->

---

## Kapsam dışı

Aşağıdaki konular bu projenin kapsamına **bilinçli olarak dahil edilmemiştir.** Amaç, sınırlı sürede temel konuları sağlam öğrenmektir.

Makine öğrenmesi ve yapay zekâ özellikleri · uçuş gecikme tahmini · canlı uçak haritası ve konum takibi · pist ve gate yönetimi · admin paneli · kullanıcı girişi (authentication) · native mobil uygulama · mikroservis mimarisi · Kubernetes ve karmaşık deployment yapıları

---

## Geliştirme günlüğü

Her gün sonunda 2-3 satır not. Sunum hazırlığında bu bölüm işini çok kolaylaştıracak.

**Yazarken şunlara cevap ver:** Ne yaptım? Yeni ne öğrendim? Nerede takıldım, nasıl çözdüm?



### Gün 1 — 21.08.2026
HTML iskeletini kurdum ve tablo yapısını yazdım. CSS ile tabloya basit stil verdim. sonrasında tabloya örnek uçuş verilerini ekledim. 

---

## Lisans

Bu proje staj çalışması kapsamında eğitim amaçlı geliştirilmiştir.
