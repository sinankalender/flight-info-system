"""API yanıtlarının alanları; ORM nesneleri bu şemalarla JSON'a çevrilir."""

from pydantic import BaseModel, ConfigDict


class Ucus(BaseModel):
    model_config = ConfigDict(from_attributes=True)

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
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    yayinId: int
    status: str


class Yayin(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    tip: str
    yon: str | None = None
    hatTipi: str | None = None
    ucusNo: str | None = None
    baslik: str | None = None
    resimYolu: str | None = None
    resimAciklama: str | None = None
