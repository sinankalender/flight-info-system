from fastapi import FastAPI

app= FastAPI()

@app.get("/")
def ana_sayfa():
    return {"message": "sunucu çalışıyor",
            "havalimani": "ESB"}