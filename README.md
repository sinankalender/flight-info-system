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
- [x] Uçuş listesi görüntüleme
- [x] Uçuş ekleme
- [x] Uçuş düzenleme
- [x] Uçuş silme

**Altyapı**
- [x] REST API ile veri sunumu
- [x] Veritabanı entegrasyonu
- [x] Uçuşlar için tam CRUD işlemleri

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
flight-info-system/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   ├── schema.sql
│   ├── seed.sql
│   ├── exercises.sql
│   └── init_db.py
├── frontend/
│   ├── index.html
│   ├── ekran.html
│   ├── api.js
│   ├── app.js
│   ├── flights.js
│   ├── script.js
│   ├── css/
│   │   ├── panel.css
│   │   └── ekran.css
│   └── images/
│       └── hos-geldiniz.svg
├── tests/
│   └── test_flights_api.py
├── baslat.bat
└── README.md
```

---

## Kurulum

### Frontend

Önce aşağıdaki Backend bölümündeki kurulumu tamamla ve `baslat.bat` ile API'yi çalıştır.
Ardından projenin ana klasöründe ikinci bir terminal aç:

```powershell
.\.venv\Scripts\python.exe -m http.server 5500 --bind 127.0.0.1 --directory frontend
```

- Panel: http://127.0.0.1:5500/index.html
- Liste yayını: http://127.0.0.1:5500/ekran.html?id=1
- Tek uçuş yayını: http://127.0.0.1:5500/ekran.html?id=6
- Görsel yayını: http://127.0.0.1:5500/ekran.html?id=5

İki sunucu da açık kalmalı. HTML dosyalarını HTTP adreslerinden aç.
`5500` portu sayfaları, `8000` portu API verilerini sunar; backend'de `/index.html` adresi yoktur.
CORS ayarı `http://127.0.0.1:5500` kaynağına izin verdiği için bu adresi kullan.

Panelin kartları ve yayın ekranı verileri API'den alınır. Backend'e ulaşılamazsa açıklayıcı
bir hata mesajı gösterilir; backend'i yeniden başlatıp sayfayı yenileyerek tekrar deneyebilirsin.
Yayın seçimi henüz backend'e kaydedilmez; panelden açılan ekranın URL'sine aktarılır.
Panel yenilenince başlangıç atamaları geri gelir. Açık yayın ekranının otomatik yenilenmesi Gün 14'te eklenecek.

### Backend

Python 3.13.5 ile geliştirildi.

Projenin ana klasöründe sanal ortamı oluştur ve paketleri kur:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend/requirements.txt
.\.venv\Scripts\python.exe backend/init_db.py
```

Sunucuyu başlatmak için `baslat.bat` dosyasını çalıştır.

- API: http://127.0.0.1:8000/
- Swagger: http://127.0.0.1:8000/docs

Sunucuyu durdurmak için terminalde Ctrl+C kullan.

### SQLite veritabanı (Gün 11)

Projenin ana klasöründe çalıştır:

```powershell
.\.venv\Scripts\python.exe backend/init_db.py
```

Komut `backend/flight_info.db` dosyasında tabloları oluşturur ve eksik örnek kayıtları ekler.
Temiz kurulumda 3 uçuş, 6 yayın ve 6 ekran bulunur. Tekrar çalıştırmak mevcut kayıtları
değiştirmez veya çoğaltmaz. Yol script'in konumundan belirlendiği için veritabanı hep
`backend` klasöründe oluşturulur. DB Browser'da bekleyen yazma işlemi varsa önce onu
kaydet veya geri al; açık bir yazma işlemi kurulum sırasında kilit hatasına neden olabilir.

| Dosya | Görevi |
|-------|--------|
| `schema.sql` | Tablolar, primary key, unique ve foreign key tanımları |
| `seed.sql` | Örnek uçuş, yayın ve ekran kayıtları |
| `init_db.py` | İki SQL dosyasını tek transaction içinde uygulayan kurulum komutu |
| `exercises.sql` | SELECT, WHERE, JOIN, UPDATE, DELETE ve geri alma alıştırmaları |

SQLite dosyası ve günlük dosyaları Git'e eklenmez; kurulum SQL dosyalarından tekrarlanabilir.
Tablo sırası `flights`, `pages`, `screens` şeklindedir. `screens.yayinId`, `pages.id` alanına;
`pages.ucusNo`, `flights.ucusNo` alanına bağlıdır. Ekrana atanmış yayın silinemez.
Bir uçuş silinirse ona bağlı yayının `ucusNo` alanı NULL olur; uçuş numarası değişirse
yayındaki bağlantı da güncellenir. Bu örnek model uçuş numarasını benzersiz kabul eder.

DB Browser for SQLite ile `backend/flight_info.db` dosyasını açıp Execute SQL sekmesinde
`exercises.sql` içindeki blokları sırayla çalıştırabilirsin. Her yeni bağlantıda, transaction
başlatmadan önce `PRAGMA foreign_keys = ON;` çalıştırılmalıdır.
`SAVEPOINT` geri dönülebilecek bir nokta belirler; `ROLLBACK TO` değişiklikleri geri alır,
`RELEASE` bu noktayı kaldırır. Alıştırmaları sonuna kadar çalıştırınca mevcut veriler korunur.
Kalıcı yazma işlemlerinde transaction `COMMIT` ile tamamlanır; kurulum komutu bunu kendisi yapar.

### SQLAlchemy bağlantısı (Gün 12)

API artık Python listeleri yerine `backend/flight_info.db` dosyasını okur.
`GET /flights`, `/pages` ve `/screens` her istekte veritabanını sorgular;
yanıtların alan adları ve yayınlardaki boş alanları gizleme davranışı korunur.

| Dosya | Görevi |
|-------|--------|
| `database.py` | Engine, her bağlantıda foreign key kontrolü ve istek başına Session |
| `models.py` | Tabloları Python sınıflarına eşleyen ORM modelleri ve ilişkiler |
| `schemas.py` | API yanıt alanlarını belirleyen Pydantic modelleri |
| `main.py` | Session üzerinden okuma ve yazma işlemlerini çalıştıran endpointler |

Engine veritabanına bağlanmayı sağlar. Session bir isteğin veritabanı işlemlerini
yürütür; `get_db` içindeki `yield` ile endpointe verilir ve istek bitince kapatılır.
ORM modeli tabloyu temsil eder; Pydantic modeli dışarıya dönen JSON'u tanımlar.
`from_attributes=True`, Pydantic'in ORM nesnesindeki alanları okuyabilmesini sağlar.

DB Browser'da bir uçuşun kapısını veya durumunu düzenleyip **Değişiklikleri Kaydet**
düğmesine bastıktan sonra `/flights` adresini ve yayın ekranını yenileyerek sonucu
görebilirsin. API'yi yeniden başlatmak gerekmez. Kaydedilmemiş değişiklikler ayrı
bağlantı kullanan API'ye yansımaz; açık ekranlar henüz kendiliğinden yenilenmez.

Veritabanı kurulmamışsa veya okunamıyorsa veri endpointleri `503` döndürür ve
sunucu terminaline hata ayrıntısı yazılır. İlk kurulumda `init_db.py` çalıştırılmalıdır;
API başlarken otomatik örnek kayıt eklemez. `/` yalnızca sunucu mesajıdır,
veritabanı bağlantısını kontrol etmek için `/flights` adresini kullan.

### Panelden uçuş yönetimi (Gün 13)

`index.html` sayfasında uçuş ekleme formu ve veritabanından yüklenen uçuş tablosu bulunur.
`flights.js` bu formu ve tabloyu yönetir; `app.js` ekran kartlarını yönetmeye devam eder.

- **Uçuş ekle:** Tüm alanları doldurup kaydet. Uçuş numarası büyük harfe çevrilir ve benzersiz olmalıdır.
- **Düzenle:** Satırdaki düğme, uçuşu forma doldurur. Değişiklikleri kaydet veya **Vazgeç** ile düzenlemeyi bırak.
- **Sil:** Onaydan sonra kayıt silinir. Bağlı tek uçuş yayını silinmez; yenilendiğinde uçuş bulunamadı mesajı gösterir.
- **Listeyi yenile:** Başka bir yerde kaydedilen değişiklikleri alır. Yayın ekranları henüz elle yenilenir.

API yanıtlarına sabit kayıt kimliği olan `id` eklendi. Düzenleme ve silme bu kimlikle yapılır;
uçuş numarası değişirse bağlı yayındaki numara da foreign key kuralıyla güncellenir.
`POST` yeni kayıt ekler, `PUT` uçuşun dokuz alanının tamamını günceller, `DELETE` kaydı siler.
Başarılı yazma işlemleri `commit()` ile kalıcı kaydedilir; hata durumunda oturum geri alınır.

Saatler `HH:MM` biçiminde olmalıdır. Boş alanlar, geçersiz yön/hat/durum ve uzunluk sınırını
aşan metinler reddedilir. Aynı numara için `409`, bulunamayan kayıt için `404`, geçersiz
girdi için `422` döner. Veritabanı kilidinde `503` ile DB Browser/SQLite bağlantılarını
kapatmayı anlatan mesaj gösterilir. Kaydetme hatasında formdaki bilgiler korunur.

Panelden yazmak için DB Browser açmak gerekmez. SQLite terminali veya DB Browser'da
bekleyen işlem bırakma; kaydetme başarılı olduktan sonra bağlantıyı kapat.
Panelden kalıcı yayın atama ve otomatik yenileme Gün 14'te tamamlanacak.

### Gün 13 testleri

Otomatik API testleri her test için ayrı geçici veritabanı oluşturur; kendi kayıtlarına dokunmaz:

```powershell
.\.venv\Scripts\python.exe -B -m unittest discover -s tests -v
```

Elle denemek için panelden benzersiz numaralı bir deneme uçuşu ekle; sayfayı yenileyip
kaydın kaldığını gör. Kapısını düzenle, yeniden yenile, ardından deneme uçuşunu sil.
Aynı numarayla ikinci uçuş eklemeyi ve düzenlerken **Vazgeç** düğmesini de dene.
Gidiş/iç hat seçtiysen liste yayınını (`ekran.html?id=1`) yenileyerek sonucu görebilirsin.

---

## API Endpointleri

| Metot | Endpoint | Açıklama |
|-------|----------|----------|
| GET | / | Sunucu mesajını ve havalimanı kodunu döndürür |
| GET | /flights | Uçuş listesini döndürür |
| GET | /flights/{ucus_id} | Tek uçuşu kayıt kimliğiyle getirir |
| POST | /flights | Uçuş ekler; 201 döndürür |
| PUT | /flights/{ucus_id} | Uçuşun tüm alanlarını günceller |
| DELETE | /flights/{ucus_id} | Uçuşu siler; gövdesiz 204 döndürür |
| GET | /screens | Ekran listesini döndürür |
| GET | /pages | Yayın listesini döndürür |

---

## Mimari

<!-- Gün 14'te tamamlanacak.
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

### Gün 1 
HTML iskeletini kurdum ve tablo yapısını yazdım. CSS ile tabloya basit stil verdim. sonrasında tabloya örnek uçuş verilerini ekledim.

### Gün 2 
CSS değişkenleriyle renk sistemi kurdum, header'ı Flexbox ile hizaladım, section'ları kart görünümüne getirdim ve durum renklerini ekledim.

### Gün 3 
Uçuş verisini array içine taşıdım, tabloyu artık forEach ile diziden üretiyorum. Template literal (backtick) ile HTML satırı oluşturmayı öğrendim, durum bilgisine göre CSS class döndüren durumSinifi() fonksiyonunu yazdım.

### Gün 4 
ekran.html ve css/ekran.css dosyalarını ayırarak yayın ekranını panelden bağımsız hale getirdim, arama/istatistik bölümlerini çıkardım. Koyu tema için ayrı bir renk paleti kurdum, vh biriminin ekrana göre orantılı büyüdüğünü öğrendim ve kullandım.

### Gün 5 
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

### Gün 9
Uçuş, ekran ve yayın verilerini Python listelerine taşıdım.
Pydantic modelleriyle yanıt alanlarını tanımladım; yayınlar için isteğe bağlı alanlar kullandım.
GET /flights, /screens ve /pages endpointlerini ekledim.

### Gün 10
Paneli ve yayın ekranını ortak api.js dosyasındaki fetch fonksiyonuyla backend'e bağladım.
async/await ile verilerin gelmesini bekledim; HTTP hatalarını kontrol edip try/catch ile hata mesajları gösterdim.
Frontend'deki sabit verileri kaldırdım, CORS ayarını ve iki sunucuyla çalıştırma adımlarını tamamladım.

### Gün 11
SQLite'ta flights, pages ve screens tablolarını oluşturdum; primary key ve foreign key ilişkileriyle örnek verileri ekledim.
SELECT, WHERE ve JOIN sorgularını; UPDATE ve DELETE işlemlerini SAVEPOINT ve ROLLBACK ile denedim.
Tekrarlanabilir veritabanı kurulum komutunu hazırladım; kayıtların korunmasını ve foreign key kurallarını kontrol ettim.

### Gün 12
SQLAlchemy engine ve istek başına Session ile API'yi mevcut SQLite veritabanına bağladım.
ORM tablo modellerini ve Pydantic yanıt şemalarını ayırdım; üç GET endpointindeki sabit listeleri SELECT sorgularıyla değiştirdim.
Yanıt uyumluluğunu, kayıt değişikliklerinin yeni isteklere yansımasını ve veritabanı hata durumunu kontrol ettim.

### Gün 13
Uçuş ekleme, düzenleme ve silme endpointlerini; panelde form, uçuş tablosu ve silme onayını ekledim.
Girdi doğrulamasını, benzersiz uçuş numarasını, hata mesajlarını ve commit/rollback ile kalıcı kayıt işlemlerini öğrendim.
Geçici veritabanında CRUD, bağlı yayınlar ve kilit hatasını test ettim; panelde girilen metinleri güvenli biçimde gösterdim.

---



## Lisans

Bu proje staj çalışması kapsamında eğitim amaçlı geliştirilmiştir.
