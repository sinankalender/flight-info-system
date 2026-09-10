from fastapi import FastAPI
from pydantic import BaseModel

class Ucus(BaseModel):
    ucusNo: str
    havayolu: str
    yon: str
    hatTipi: str
    sehir: str
    planlanan_saat: str
    tahmini_saat: str
    kapi: str
    durum: str



class Ekran(BaseModel):
    id:int
    name:str
    yayinId:int
    status:str


class Yayin(BaseModel):
    id: int
    name: str
    tip: str

    yon: str | None = None
    hatTipi: str | None = None
    ucusNo: str | None = None
    baslik: str | None = None
    resimYolu: str | None = None
    resimAciklama: str | None = None

app= FastAPI()


ucuslar = [
    {
        "ucusNo": "TK2241",
        "havayolu": "THY",
        "yon": "departure",
        "hatTipi": "domestic",
        "sehir": "Ankara",
        "planlanan_saat": "13:35",
        "tahmini_saat": "14:20",
        "kapi": "2",
        "durum": "Kalktı"
    },

    {
        "ucusNo": "PC2657",
        "havayolu": "PGT",
        "yon": "departure",
        "hatTipi": "domestic",
        "sehir": "İstanbul",
        "planlanan_saat": "17:35",
        "tahmini_saat": "18:00",
        "kapi": "5",
        "durum": "Planlandı"
    },
    {
    "ucusNo": "TK2351",
    "havayolu": "AJT",
    "yon": "departure",
    "hatTipi": "domestic",
    "sehir": "Antalya",
    "planlanan_saat": "16:30",
    "tahmini_saat": "17:00",
    "kapi": "3",
    "durum": "Gecikmeli"
}

]

screens = [
    {
        "id": 1,
        "name": "Gidiş Salonu İç Hatlar",
        "yayinId": 1,
        "status": "online"
    },
    {
        "id": 2,
        "name": "Geliş Salonu İç Hatlar",
        "yayinId": 2,
        "status": "online"
    },
    {
        "id": 3,
        "name": "Gidiş Salonu Dış Hatlar",
        "yayinId": 3,
        "status": "online"
    },
    {
        "id": 4,
        "name": "Geliş Salonu Dış Hatlar",
        "yayinId": 4,
        "status": "online"
    },
    {
        "id": 5,
        "name": "Ana Salon",
        "yayinId": 5,
        "status": "offline"
    },
    {
        "id": 6,
        "name": "Kapı 1 Gidiş",
        "yayinId": 6,
        "status": "online"
    }
]

pages = [
    {
        "id": 1,
        "name": "İç Hatlar Gidiş",
        "tip": "liste",
        "yon": "departure",
        "hatTipi": "domestic"
    },
    {
        "id": 2,
        "name": "İç Hatlar Geliş",
        "tip": "liste",
        "yon": "arrival",
        "hatTipi": "domestic"
    },
    {
        "id": 3,
        "name": "Dış Hatlar Gidiş",
        "tip": "liste",
        "yon": "departure",
        "hatTipi": "international"
    },
    {
        "id": 4,
        "name": "Dış Hatlar Geliş",
        "tip": "liste",
        "yon": "arrival",
        "hatTipi": "international"
    },
    {
        "id": 5,
        "name": "Görsel / Duyuru",
        "tip": "gorsel",
        "baslik": "Esenboğa Havalimanı'na Hoş Geldiniz",
        "resimYolu": "images/hos-geldiniz.svg",
        "resimAciklama": "İyi yolculuklar. Uçuşunuzun güncel saat ve kapı bilgilerini uçuş ekranlarından takip edebilirsiniz."
    },
    {
        "id": 6,
        "name": "Uçuş Bilgisi",
        "tip": "tek-ucus",
        "ucusNo": "PC2657"
    }
]



@app.get("/")
def ana_sayfa():
    return {"message": "sunucu çalışıyor",
            "havalimani": "ESB"}

@app.get("/flights",
response_model=list[Ucus])
def ucuslari_getir():
    return ucuslar

@app.get("/screens", response_model=list[Ekran])
def ekranlari_getir():
    return screens

@app.get(
    "/pages",
    response_model=list[Yayin],
    response_model_exclude_none=True
)
def yayinlari_getir():
    return pages