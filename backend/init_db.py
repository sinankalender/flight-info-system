"""SQL dosyalarindan veritabanini ve eksik ornek kayitlari olusturur."""

import argparse
import sqlite3
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parent
TABLES = ("flights", "pages", "screens")


def init_database(database_path: Path) -> dict[str, int]:
    schema = (BACKEND_DIR / "schema.sql").read_text(encoding="utf-8")
    seed = (BACKEND_DIR / "seed.sql").read_text(encoding="utf-8")
    connection = sqlite3.connect(database_path)

    try:
        # Foreign key denetimi her baglantida, transaction oncesinde acilir.
        connection.execute("PRAGMA foreign_keys = ON")
        connection.executescript("BEGIN;\n" + schema + "\n" + seed)

        if connection.execute("PRAGMA foreign_key_check").fetchall():
            raise ValueError("Veritabaninda gecersiz tablo iliskileri var.")

        counts = {
            table: connection.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
            for table in TABLES
        }
        connection.commit()
        return counts
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--db", type=Path, default=BACKEND_DIR / "flight_info.db",
        help="Olusturulacak SQLite dosyasinin yolu",
    )
    database_path = parser.parse_args().db.resolve()
    counts = init_database(database_path)
    print(f"Veritabani hazir: {database_path}")
    for table, count in counts.items():
        print(f"{table}: {count} kayit")
