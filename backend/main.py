import logging

from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import EkranKaydi, UcusKaydi, YayinKaydi
from backend.schemas import Ekran, Ucus, Yayin

logger = logging.getLogger(__name__)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_methods=["GET"],
)


@app.exception_handler(OperationalError)
async def veritabani_hatasi(request: Request, error: OperationalError):
    logger.error("Veritabanı okunamadı: %s", request.url.path, exc_info=error)
    return JSONResponse(
        status_code=503,
        content={"detail": "Veritabanı okunamadı. Kurulumu ve sunucu kayıtlarını kontrol et."},
    )


@app.get("/")
def ana_sayfa():
    return {"message": "sunucu çalışıyor", "havalimani": "ESB"}


@app.get("/flights", response_model=list[Ucus])
def ucuslari_getir(db: Session = Depends(get_db)):
    return db.scalars(select(UcusKaydi).order_by(UcusKaydi.id)).all()


@app.get("/screens", response_model=list[Ekran])
def ekranlari_getir(db: Session = Depends(get_db)):
    return db.scalars(select(EkranKaydi).order_by(EkranKaydi.id)).all()


@app.get("/pages", response_model=list[Yayin], response_model_exclude_none=True)
def yayinlari_getir(db: Session = Depends(get_db)):
    return db.scalars(select(YayinKaydi).order_by(YayinKaydi.id)).all()
