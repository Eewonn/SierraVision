from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

app = FastAPI(title="SierraVision Backend")

# Allow only the Vite dev server origin during development
origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).parent / "data"


@app.get("/api/images")
def list_images():
    """Return a JSON list of image filenames found in the data directory."""
    files = []
    if DATA_DIR.exists():
        for p in sorted(DATA_DIR.iterdir()):
            if p.is_file():
                files.append(p.name)
    return {"images": files}


# Serve image/static files at /data/<filename>
app.mount("/data", StaticFiles(directory=DATA_DIR), name="data")
