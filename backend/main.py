import logging
import sqlite3

from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, OperationalError
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import EkranKaydi, UcusKaydi, YayinKaydi
from backend.schemas import Ekran, Ucus, UcusYaz, Yayin

logger = logging.getLogger(__name__)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(OperationalError)
async def veritabani_hatasi(request: Request, error: OperationalError):
    logger.error("Veritabanı okunamadı: %s", request.url.path, exc_info=error)
    kod = getattr(error.orig, "sqlite_errorcode", 0) & 0xFF
    mesaj = "Veritabanı işlemi tamamlanamadı. Kurulumu ve sunucu kayıtlarını kontrol et."
    if kod in (sqlite3.SQLITE_BUSY, sqlite3.SQLITE_LOCKED):
        mesaj = (
            "Veritabanı kilitli. DB Browser ve SQLite terminalindeki işlemleri "
            "tamamlayıp bağlantıları kapat, ardından tekrar dene."
        )
    return JSONResponse(
        status_code=503,
        content={"detail": mesaj},
    )


@app.get("/")
def ana_sayfa():
    return {"message": "sunucu çalışıyor", "havalimani": "ESB"}


@app.get("/flights", response_model=list[Ucus])
def ucuslari_getir(db: Session = Depends(get_db)):
    return db.scalars(select(UcusKaydi).order_by(UcusKaydi.id)).all()


def ucusu_bul(ucus_id: int, db: Session):
    ucus = db.get(UcusKaydi, ucus_id)
    if ucus is None:
        raise HTTPException(status_code=404, detail="Uçuş bulunamadı. Listeyi yenile.")
    return ucus


def degisiklikleri_kaydet(db: Session):
    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        if getattr(error.orig, "sqlite_errorcode", None) == sqlite3.SQLITE_CONSTRAINT_UNIQUE:
            raise HTTPException(
                status_code=409, detail="Bu uçuş numarası zaten kayıtlı. Farklı bir numara gir."
            ) from error
        raise


@app.get("/flights/{ucus_id}", response_model=Ucus)
def ucusu_getir(ucus_id: int, db: Session = Depends(get_db)):
    return ucusu_bul(ucus_id, db)


@app.post("/flights", response_model=Ucus, status_code=201)
def ucus_ekle(veri: UcusYaz, db: Session = Depends(get_db)):
    ucus = UcusKaydi(**veri.model_dump())
    db.add(ucus)
    degisiklikleri_kaydet(db)
    db.refresh(ucus)
    return ucus


@app.put("/flights/{ucus_id}", response_model=Ucus)
def ucus_duzenle(ucus_id: int, veri: UcusYaz, db: Session = Depends(get_db)):
    ucus = ucusu_bul(ucus_id, db)
    for alan, deger in veri.model_dump().items():
        setattr(ucus, alan, deger)
    degisiklikleri_kaydet(db)
    db.refresh(ucus)
    return ucus


@app.delete("/flights/{ucus_id}", status_code=204)
def ucus_sil(ucus_id: int, db: Session = Depends(get_db)):
    ucus = ucusu_bul(ucus_id, db)
    db.delete(ucus)
    degisiklikleri_kaydet(db)
    return Response(status_code=204)


@app.get("/screens", response_model=list[Ekran])
def ekranlari_getir(db: Session = Depends(get_db)):
    return db.scalars(select(EkranKaydi).order_by(EkranKaydi.id)).all()


@app.get("/pages", response_model=list[Yayin], response_model_exclude_none=True)
def yayinlari_getir(db: Session = Depends(get_db)):
    return db.scalars(select(YayinKaydi).order_by(YayinKaydi.id)).all()
