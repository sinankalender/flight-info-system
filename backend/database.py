"""SQLite bağlantısı ve her API isteğine özel veritabanı oturumu."""

from pathlib import Path

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

DB_PATH = Path(__file__).resolve().parent / "flight_info.db"

engine = create_engine(
    f"sqlite:///{DB_PATH.as_posix()}",
    connect_args={"check_same_thread": False},
)


@event.listens_for(engine, "connect")
def foreign_key_ac(dbapi_connection, connection_record):
    # SQLite'ta foreign key kontrolü her yeni bağlantıda açılmalıdır.
    cursor = dbapi_connection.cursor()
    try:
        cursor.execute("PRAGMA foreign_keys = ON")
    finally:
        cursor.close()


SessionLocal = sessionmaker(bind=engine)


def get_db():
    # yield oturumu endpointe verir; istek bitince with oturumu kapatır.
    with SessionLocal() as db:
        yield db
