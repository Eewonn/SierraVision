# SierraVision

Starter scaffold for the SierraVision NASA Space Apps 2025 project.

Structure

sierravision/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── data/
│       ├── 2000.png
│       └── 2025.png
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── api.js
│   └── package.json
└── README.md

Quick start

1. Backend

Install dependencies into a virtual environment and run:

```bash
cd sierravision/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The backend exposes:
- GET /api/images — returns JSON { images: [...] }
- Static images served at /data/<filename>

2. Frontend

From a separate terminal:

```bash
cd sierravision/frontend
npm install
npm run dev
```

Open http://localhost:5173. The frontend will request the image list from the backend (default http://localhost:8000). You can change the backend URL by setting VITE_BACKEND_URL in a `.env` file inside `frontend`.

Replace the placeholder images in `backend/data` with your actual GeoTIFF-derived PNGs for 2000 and 2025.
