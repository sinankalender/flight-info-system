"""Duyuru görsellerini frontend'in sunduğu klasöre kaydeder."""

from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Request

router = APIRouter()
IMAGE_DIR = Path(__file__).resolve().parents[1] / "frontend" / "images" / "uploads"
MAX_IMAGE_SIZE = 2 * 1024 * 1024


@router.post("/images", status_code=201)
async def gorsel_yukle(request: Request):
    # İstemcinin dosya adını kullanma; her yükleme yeni bir dosyadır.
    data = bytearray()
    async for chunk in request.stream():
        data.extend(chunk)
        if len(data) > MAX_IMAGE_SIZE:
            raise HTTPException(status_code=413, detail="Görsel en fazla 2 MB olabilir.")
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        extension = ".png"
    elif data.startswith(b"\xff\xd8\xff"):
        extension = ".jpg"
    elif data[:6] in (b"GIF87a", b"GIF89a"):
        extension = ".gif"
    elif data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        extension = ".webp"
    else:
        raise HTTPException(status_code=415, detail="PNG, JPEG, GIF veya WebP görsel seç.")
    filename = uuid4().hex + extension
    try:
        IMAGE_DIR.mkdir(parents=True, exist_ok=True)
        (IMAGE_DIR / filename).write_bytes(data)
    except OSError as error:
        raise HTTPException(status_code=503, detail="Görsel kaydedilemedi. Sunucu klasör izinlerini kontrol et.") from error
    return {"resimYolu": f"images/uploads/{filename}"}
