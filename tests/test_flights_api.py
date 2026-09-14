"""Uçuş API testleri; her test ayrı, geçici SQLite veritabanı kullanır."""

import asyncio
from contextlib import closing
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

from backend.database import foreign_key_ac, get_db
from backend.init_db import init_database
from backend.main import app


class FlightAPITests(unittest.TestCase):
    def setUp(self):
        self.folder = tempfile.TemporaryDirectory(prefix="flight-api-test-")
        self.db_path = Path(self.folder.name) / "test.db"
        init_database(self.db_path)
        self.engine = create_engine(
            f"sqlite:///{self.db_path.as_posix()}",
            connect_args={"check_same_thread": False, "timeout": 0.1},
        )
        event.listen(self.engine, "connect", foreign_key_ac)
        self.sessions = sessionmaker(bind=self.engine)

        def test_db():
            with self.sessions() as db:
                yield db

        app.dependency_overrides[get_db] = test_db
        self.flight = {
            "ucusNo": "TEST13", "havayolu": "TEST", "yon": "departure",
            "hatTipi": "domestic", "sehir": "İzmir", "planlanan_saat": "09:05",
            "tahmini_saat": "09:30", "kapi": "9", "durum": "Planlandı",
        }

    def tearDown(self):
        app.dependency_overrides.pop(get_db, None)
        self.engine.dispose()
        assert Path(self.folder.name).resolve().parent == Path(tempfile.gettempdir()).resolve()
        self.folder.cleanup()

    def request(self, method, path, data=None, headers=None):
        async def run():
            messages = []
            body = json.dumps(data).encode() if data is not None else b""

            async def receive():
                return {"type": "http.request", "body": body, "more_body": False}

            async def send(message):
                messages.append(message)

            await app({
                "type": "http", "asgi": {"version": "3.0"}, "http_version": "1.1",
                "method": method, "scheme": "http", "path": path,
                "raw_path": path.encode(), "query_string": b"", "root_path": "",
                "headers": headers or [
                    (b"origin", b"http://127.0.0.1:5500"),
                    (b"content-type", b"application/json"),
                ],
                "client": ("127.0.0.1", 10000), "server": ("127.0.0.1", 8000),
            }, receive, send)
            start = next(m for m in messages if m["type"] == "http.response.start")
            content = b"".join(m.get("body", b"") for m in messages if m["type"] == "http.response.body")
            self.assertEqual(dict(start["headers"]).get(b"access-control-allow-origin"), b"http://127.0.0.1:5500")
            if dict(start["headers"]).get(b"content-type", b"").startswith(b"application/json"):
                content = json.loads(content)
            else:
                content = content.decode() if content else None
            return start["status"], content

        result = asyncio.run(run())
        self.assertEqual(self.engine.pool.checkedout(), 0)
        return result

    def test_create_read_update_delete_and_persistence(self):
        status, created = self.request("POST", "/flights", self.flight)
        self.assertEqual(status, 201)
        flight_id = created["id"]
        self.assertIsInstance(flight_id, int)
        self.engine.dispose()
        self.assertEqual(self.request("GET", f"/flights/{flight_id}"), (200, created))
        edited = {**self.flight, "kapi": "12", "durum": "Gecikmeli"}
        status, updated = self.request("PUT", f"/flights/{flight_id}", edited)
        self.assertEqual(status, 200)
        self.assertEqual(updated["id"], flight_id)
        with closing(sqlite3.connect(self.db_path)) as db:
            self.assertEqual(db.execute("SELECT kapi, durum FROM flights WHERE id=?", (flight_id,)).fetchone(), ("12", "Gecikmeli"))
        self.assertEqual(self.request("DELETE", f"/flights/{flight_id}"), (204, None))
        self.assertEqual(self.request("GET", f"/flights/{flight_id}")[0], 404)
        self.assertEqual(len(self.request("GET", "/flights")[1]), 3)

    def test_normalization_and_duplicate_create(self):
        data = {**self.flight, "ucusNo": "  pc2657 ", "sehir": " İzmir "}
        self.assertEqual(self.request("POST", "/flights", data)[0], 409)
        status, created = self.request("POST", "/flights", {**data, "ucusNo": " test13 "})
        self.assertEqual(status, 201)
        self.assertEqual(created["ucusNo"], "TEST13")
        self.assertEqual(created["sehir"], "İzmir")

    def test_duplicate_update_rolls_back_all_fields(self):
        original = self.request("GET", "/flights/2")[1]
        edit = {key: value for key, value in original.items() if key != "id"}
        edit.update(ucusNo="TK2241", kapi="99")
        self.assertEqual(self.request("PUT", "/flights/2", edit)[0], 409)
        self.assertEqual(self.request("GET", "/flights/2")[1], original)
        self.assertEqual(self.request("GET", "/pages")[1][5]["ucusNo"], "PC2657")

    def test_invalid_fields_are_rejected_without_writes(self):
        for field, value in [
            ("ucusNo", " "), ("sehir", "   "), ("havayolu", ""),
            ("kapi", " "), ("planlanan_saat", "24:00"), ("tahmini_saat", "12:60"),
            ("yon", "wrong"), ("hatTipi", "wrong"), ("durum", "wrong"),
            ("sehir", "a" * 81), ("id", 999),
        ]:
            with self.subTest(field=field, value=value):
                self.assertEqual(self.request("POST", "/flights", {**self.flight, field: value})[0], 422)
        self.assertEqual(self.request("PUT", "/flights/1", {"kapi": "9"})[0], 422)
        self.assertEqual(len(self.request("GET", "/flights")[1]), 3)

    def test_missing_flight(self):
        for method in ("GET", "PUT", "DELETE"):
            with self.subTest(method=method):
                data = self.flight if method == "PUT" else None
                self.assertEqual(self.request(method, "/flights/999", data)[0], 404)

    def test_rename_and_delete_linked_flight(self):
        original = self.request("GET", "/flights/2")[1]
        edit = {key: value for key, value in original.items() if key != "id"}
        edit["ucusNo"] = "PC9999"
        self.assertEqual(self.request("PUT", "/flights/2", edit)[0], 200)
        self.assertEqual(self.request("GET", "/pages")[1][5]["ucusNo"], "PC9999")
        self.assertEqual(self.request("DELETE", "/flights/2"), (204, None))
        self.assertNotIn("ucusNo", self.request("GET", "/pages")[1][5])
        self.assertEqual(len(self.request("GET", "/screens")[1]), 6)
        with closing(sqlite3.connect(self.db_path)) as db:
            self.assertEqual(db.execute("PRAGMA foreign_key_check").fetchall(), [])

    def test_empty_flight_list(self):
        for flight in self.request("GET", "/flights")[1]:
            self.assertEqual(self.request("DELETE", f"/flights/{flight['id']}")[0], 204)
        self.assertEqual(self.request("GET", "/flights"), (200, []))

    def test_browser_cors_preflight(self):
        for method in (b"POST", b"PUT", b"DELETE"):
            status, _ = self.request("OPTIONS", "/flights", headers=[
                (b"origin", b"http://127.0.0.1:5500"),
                (b"access-control-request-method", method),
                (b"access-control-request-headers", b"content-type"),
            ])
            self.assertEqual(status, 200)

    def test_locked_database_returns_actionable_error_and_recovers(self):
        blocker = sqlite3.connect(self.db_path)
        try:
            blocker.execute("BEGIN EXCLUSIVE")
            with self.assertLogs("backend.main", level="ERROR"):
                status, error = self.request("POST", "/flights", self.flight)
            self.assertEqual(status, 503)
            self.assertIn("kilitli", error["detail"])
        finally:
            blocker.rollback()
            blocker.close()
        self.assertEqual(len(self.request("GET", "/flights")[1]), 3)
        self.assertEqual(self.request("POST", "/flights", self.flight)[0], 201)


if __name__ == "__main__":
    unittest.main()
