"""API yanıtlarının alanları; ORM nesneleri bu şemalarla JSON'a çevrilir."""

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class UcusYaz(BaseModel):
    """Ekleme ve düzenleme için tüm uçuş alanları zorunludur."""

    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    ucusNo: str = Field(min_length=2, max_length=12, pattern=r"^[A-Z0-9]+$")
    havayolu: str = Field(min_length=1, max_length=60)
    yon: Literal["departure", "arrival"]
    hatTipi: Literal["domestic", "international"]
    sehir: str = Field(min_length=1, max_length=80)
    planlanan_saat: str = Field(pattern=r"^([01][0-9]|2[0-3]):[0-5][0-9]$")
    tahmini_saat: str = Field(pattern=r"^([01][0-9]|2[0-3]):[0-5][0-9]$")
    kapi: str = Field(min_length=1, max_length=12)
    durum: Literal[
        "Planlandı", "Kontuar Açık", "Kapı Kapandı", "Gecikmeli",
        "İndi", "Kalktı", "İptal Edildi",
    ]

    @field_validator("ucusNo", mode="before")
    @classmethod
    def ucus_numarasini_duzenle(cls, value):
        return value.strip().upper() if isinstance(value, str) else value


class Ucus(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
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
