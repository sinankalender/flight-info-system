# Havalimanı Uçuş Bilgi Ekranı Yönetim Sistemi

Ankara Esenboğa Havalimanı (ESB) için uçuş bilgi ekranlarını yöneten web tabanlı bir sistem. Terminaldeki monitörlerde hangi içeriğin görüneceği tek bir panelden belirlenir.

---

## Projenin amacı

Bu projenin öncelikli amacı hızlıca çalışan bir ürün ortaya çıkarmak değil, **web geliştirmenin temel mantığını uçtan uca öğrenmektir.**

Bu nedenle proje bilinçli olarak:

- Framework kullanmadan (React, Vue vb. olmadan) saf HTML/CSS/JavaScript ile geliştirilmektedir
- Katman katman ilerlemektedir (statik arayüz → dinamik veri → API → veritabanı)
- Gereksiz teknoloji ve karmaşık mimariden kaçınmaktadır

Öğrenilmesi hedeflenen konular:

**Frontend:** DOM, event, array metotları (`filter`, `map`, `forEach`), uygulama durumu (state) yönetimi, `fetch()`, `async`/`await`, HTTP istek mantığı

**Backend:** HTTP, REST API, endpoint, request/response, JSON, HTTP status kodları, path parametreleri

**Veritabanı:** Temel SQL (`CREATE TABLE`, `SELECT`, `INSERT`, `UPDATE`, `DELETE`), foreign key, SQLAlchemy ile ORM mantığı

---

## Sistem nasıl çalışıyor

Sistem iki ayrı arayüzden oluşur:

**Yayın ekranı** — Monitörde görünen sayfa. Tam ekran, koyu zemin, büyük yazı, hiç etkileşim yok. Her monitör kendi adresini açar (`ekran.html?id=3` gibi). Gerçek havalimanı tabelalarında da mantık budur: monitörün arkasındaki bilgisayar tam ekran bir tarayıcıda o adresi gösterir.

**Yönetim paneli** — Operatörün kullandığı sayfa. Ekranların listesi, hangi ekranda ne yayınlandığı, ekranlara yayın atama ve uçuş verisi girişi buradan yapılır.

### Çekirdek kavramlar

Sistemin tamamı bu üç kavramın birbirinden ayrı tutulmasına dayanır.

| Kavram | Nedir | Örnek |
|--------|-------|-------|
| **Uçuş** | Ham veri | VF4304, Van, 14:25, Kapı Kapandı |
| **Yayın** | İçerik tanımı (tip + filtre) | "İç Hatlar Gidiş" = liste + giden + iç hat |
| **Ekran** | Fiziksel monitör + o an gösterdiği yayın | "Gidiş Salonu Sol" → İç Hatlar Gidiş |

Bir yayın birden fazla ekranda gösterilebilir. Bir ekranın yayınını değiştirmek, tek bir alanı güncellemektir.

### Ekran tipleri

| Tip | Ne gösterir |
|-----|-------------|
| Liste | Çok satırlı uçuş tabelası (gelen/giden, iç hat/dış hat filtreli) |
| Tek uçuş | Kapı veya kontuar ekranı — tek uçuşun büyük gösterimi |
| Görsel | Başlık ve duyuru görseli |

---

## Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, FastAPI |
| Veritabanı | SQLite, SQLAlchemy |

---

## Özellikler

Tamamlandıkça işaretlenecek.

**Yayın ekranı**
- [ ] Uçuş listesi ekranı (gelen / giden)
- [ ] İç hat / dış hat ayrımı
- [ ] Tek uçuş ekranı (kapı / kontuar)
- [ ] Görsel ve duyuru ekranı
- [ ] Tam ekran görünüm
- [ ] Otomatik yenileme

**Yönetim paneli**
- [ ] Ekran listesi ve durum göstergesi
- [ ] Ekrana yayın atama
- [ ] Uçuş listesi görüntüleme
- [ ] Uçuş ekleme
- [ ] Uçuş düzenleme
- [ ] Uçuş silme

**Altyapı**
- [ ] REST API ile veri sunumu
- [ ] Veritabanı entegrasyonu
- [ ] Tam CRUD işlemleri

### Uçuş durumları

Planlandı · Kontuar Açık · Kapı Kapandı · Gecikmeli · İndi · Kalktı · İptal Edildi

<!-- Gün 3'te veri modelini kesinleştirirken bu listeyi de kesinleştir.
     Fotoğraflardaki gerçek ekranlarda hangi durumlar geçiyor, ona bak. -->

---

## Veri stratejisi

Proje gerçek kurum verisine bağımlı değildir. Tüm geliştirme, gerçekçi biçimde hazırlanmış **örnek uçuş verileri** ile yapılmaktadır. Uçuş numaraları ve havayolu kodları gerçek ESB trafiğine uygun seçilmiştir (TK, PC, VF, XQ).

---

## Klasör yapısı

```text
airport-flight-system/
├── frontend/
│   ├── index.html
│   └── style.css
└── README.md
```

<!-- Gün 4-5'te iki ayrı sayfaya ayrılacak: ekran.html ve panel.html
     Yeni dosya eklediğin gün bu ağacı güncellemeyi alışkanlık haline getir. -->

---

## Kurulum

### Frontend

`frontend/index.html` dosyasını tarayıcıda açmak yeterlidir.

### Backend

Python 3.13.5 ile geliştirildi.

Projenin ana klasöründe sanal ortamı oluştur ve paketleri kur:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend/requirements.txt
```

Sunucuyu başlatmak için `baslat.bat` dosyasını çalıştır.

- API: http://127.0.0.1:8000/
- Swagger: http://127.0.0.1:8000/docs

Sunucuyu durdurmak için terminalde Ctrl+C kullan.
---

## API Endpointleri

<!-- Gün 9'dan itibaren doldurulacak.
     Her endpoint için: metot, yol, ne yaptığı, varsa parametreleri -->

_API henüz geliştirilmedi._

| Metot | Endpoint | Açıklama |
|-------|----------|----------|
| — | — | — |

---

## Mimari

<!-- Gün 15'te tamamlanacak.
     Basit bir akış şeması yeterli:
     Yayın ekranı + Panel → FastAPI → SQLite -->

_Geliştirme tamamlandığında eklenecek._

---

## Ekran görüntüleri

<!-- Gün 4'ten sonra yayın ekranının, Gün 5'ten sonra panelin görüntüsünü ekle -->

---

## Kapsam dışı

Aşağıdaki konular bu projenin kapsamına **bilinçli olarak dahil edilmemiştir.** Amaç, sınırlı sürede temel konuları sağlam öğrenmektir.

Çoklu havalimanı desteği · kullanıcıya yönelik arama ve filtre arayüzü · kullanıcı girişi (authentication) · gerçek monitör donanımı entegrasyonu · mobil öncelikli tasarım · makine öğrenmesi ve yapay zekâ özellikleri · uçuş gecikme tahmini · canlı uçak takibi · pist yönetimi · mikroservis mimarisi · Kubernetes ve karmaşık deployment yapıları

**Ayrıca bilinçli olarak sadeleştirilenler:**

- Panelde `iframe` ile canlı önizleme yerine bilgi kartları kullanılmaktadır
- CSS'te animasyon ve geçiş efektleri kullanılmamaktadır

---

## Geliştirme günlüğü

Her gün sonunda 2-3 satır not.

**Yazarken şunlara cevap ver:** Ne yaptım? Yeni ne öğrendim? Nerede takıldım, nasıl çözdüm?

### Gün 1 — 21.08.2026
HTML iskeletini kurdum ve tablo yapısını yazdım. CSS ile tabloya basit stil verdim. sonrasında tabloya örnek uçuş verilerini ekledim.

### Gün 2 — 24.08.2026
CSS değişkenleriyle renk sistemi kurdum, header'ı Flexbox ile hizaladım, section'ları kart görünümüne getirdim ve durum renklerini ekledim.

### Gün 3 — 25.08.2026
Uçuş verisini array içine taşıdım, tabloyu artık forEach ile diziden üretiyorum. Template literal (backtick) ile HTML satırı oluşturmayı öğrendim, durum bilgisine göre CSS class döndüren durumSinifi() fonksiyonunu yazdım.

### Gün 4 — 27.08.2026
ekran.html ve css/ekran.css dosyalarını ayırarak yayın ekranını panelden bağımsız hale getirdim, arama/istatistik bölümlerini çıkardım. Koyu tema için ayrı bir renk paleti kurdum, vh biriminin ekrana göre orantılı büyüdüğünü öğrendim ve kullandım.

### Gün 5 — 28.08.2026
Panelde ekran kartı listesini kurdum. screens dizisini oluşturdum, CSS Grid ile 3 sütunlu kart düzeni yaptım, aspect-ratio ile kart oranlarını sabitledim. Durum göstergesi (online/offline) için statusClass() fonksiyonu yazdım, noktanın rengini kart durumuna göre değiştirdim.

### Gün 6
Yayınları pages dizisinde tanımladım ve ekranlarla yayinId üzerinden ilişkilendirdim. Seçim değişince kartları yeniden çizdirdim; URL parametreleri ve filter ile yayın ekranında uygun uçuşları gösterdim. Fullscreen API ile düğmeden tam ekran açmayı ekledim.

### Gün 7
Tek uçuş yayınına ucusNo ekledim; find ile bulunan uçuşu büyük yazılarla gösterdim.
Görsel yayınına başlık, resim yolu ve alternatif metin ekledim; yerel bir SVG duyuru görseli hazırladım.
Yayın tipine göre ilgili alanı açıp diğerlerini gizledim; bulunamayan uçuş ve yüklenemeyen görsel için hata mesajı ekledim.

### Gün 8
Python sanal ortamını hazırladım, FastAPI ve Uvicorn kurdum.
İlk GET endpointini yazdım; sunucu mesajını ve havalimanı bilgisini JSON olarak döndürdüm.
Paket sürümlerini requirements.txt dosyasına kaydettim ve baslat.bat ile başlatmayı kolaylaştırdım.

---



## Lisans

Bu proje staj çalışması kapsamında eğitim amaçlı geliştirilmiştir.
