import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import create_db
from routers import community, reports, messaging


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()
    yield


app = FastAPI(
    title="Observatorio del Derecho a la Alimentación",
    description="API para el mapeo de alimentos nutritivos por región en Colombia – CINDE/ICBF",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(community.router)
app.include_router(reports.router)
app.include_router(messaging.router)


@app.get("/health")
def health():
    return {"status": "healthy"}


# Sirve el frontend compilado — debe ir al final para no interceptar rutas /api
DIST = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

if os.path.isdir(DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def spa(full_path: str):
        return FileResponse(os.path.join(DIST, "index.html"))
