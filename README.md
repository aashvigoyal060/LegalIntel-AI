
# LegalIntel AI - Contract Intelligence Platform

A production-grade AI-powered Legal Intelligence Platform that transforms contract analysis and deal closure readiness assessment.

## Features

- ✅ **Executive Dashboard**
  - Deal Readiness Score
  - Risk severity counters (Critical, High, Medium)
  - AI-extracted clause display with confidence scores
  - Visual risk heatmap
  - Contract timeline with key dates

✅ **AI-Powered Analysis**
  - Automated clause extraction
  - Risk identification and severity assessment
  - Missing clause detection
  - AI insights with negotiation points

✅ **Interactive Chat Assistant**
  - Natural language queries about contracts
  - Document-linked responses with citations
  - Context-aware answers

✅ **Modern UI/UX**
  - Glassmorphism design
  - Smooth animations
  - Dark theme friendly
  - Fully responsive
  - Drag-and-drop document upload

## Architecture

- **Frontend**: Next.js 16 + React + Tailwind CSS
- **Backend**: FastAPI + Uvicorn
- **Key Dependencies**: Framer Motion, Lucide React, React Dropzone, Date-fns

## Getting Started

### Backend Setup

1. Navigate to the backend directory:

```bash
cd BACKEND
```

2. Create and activate virtual environment:

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the backend server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd Frontend/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Deploying to Production

### Frontend to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Deploy!

### Backend to Railway

1. Push your code to GitHub
2. Go to https://railway.app/new
3. Deploy from repo
4. Configure environment variables (if any)
5. Deploy!

## Project Structure

```
CONTRACT/
├── BACKEND/
│   ├── main.py              # FastAPI backend
│   ├── requirements.txt     # Python dependencies
│   └── venv/           # Virtual environment (git ignored)
├── Frontend/
│   └── frontend/
│       ├── app/           # Next.js app router
│       ├── components/    # React components
│       ├── types/       # TypeScript types
│       └── ...
└── README.md
```

## License

MIT
