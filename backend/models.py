"""schema.sql içindeki tabloların SQLAlchemy karşılıkları."""

from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class UcusKaydi(Base):
    __tablename__ = "flights"

    id: Mapped[int] = mapped_column(primary_key=True)
    ucusNo: Mapped[str] = mapped_column(Text, unique=True)
    havayolu: Mapped[str] = mapped_column(Text)
    yon: Mapped[str] = mapped_column(Text)
    hatTipi: Mapped[str] = mapped_column(Text)
    sehir: Mapped[str] = mapped_column(Text)
    planlanan_saat: Mapped[str] = mapped_column(Text)
    tahmini_saat: Mapped[str] = mapped_column(Text)
    kapi: Mapped[str] = mapped_column(Text)
    durum: Mapped[str] = mapped_column(Text)


class YayinKaydi(Base):
    __tablename__ = "pages"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(Text)
    tip: Mapped[str] = mapped_column(Text)
    yon: Mapped[str | None] = mapped_column(Text)
    hatTipi: Mapped[str | None] = mapped_column(Text)
    ucusNo: Mapped[str | None] = mapped_column(
        Text,
        ForeignKey("flights.ucusNo", onupdate="CASCADE", ondelete="SET NULL"),
    )
    baslik: Mapped[str | None] = mapped_column(Text)
    resimYolu: Mapped[str | None] = mapped_column(Text)
    resimAciklama: Mapped[str | None] = mapped_column(Text)

    ucus: Mapped[UcusKaydi | None] = relationship()


class EkranKaydi(Base):
    __tablename__ = "screens"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(Text)
    yayinId: Mapped[int] = mapped_column(
        ForeignKey("pages.id", onupdate="CASCADE", ondelete="RESTRICT")
    )
    status: Mapped[str] = mapped_column(Text)

    yayin: Mapped[YayinKaydi] = relationship()
