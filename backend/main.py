from fastapi import FastAPI, UploadFile, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from ai_engine import store_memory, search_memory, get_db_stats
from pydantic import BaseModel
from typing import Optional
import json
import platform
import time
from datetime import datetime

# Load environment variables
from dotenv import load_dotenv
import os
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = FastAPI()

# Store recent queries in memory (In production, use a database)
query_history = []

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:3000", 
        "https://contextos.netlify.app"
    ],
    allow_origin_regex=r"https://.*\.netlify\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UploadRequest(BaseModel):
    content: str
    source: str
    date: str

class AskRequest(BaseModel):
    question: str

class GmailSyncRequest(BaseModel):
    max_emails: Optional[int] = 75

# ROUTE 1: Upload any document/email/note
@app.post("/upload")
async def upload_document(req: UploadRequest):
    metadata = {
        "source": req.source,
        "date": req.date,
        "type": "company_data"
    }
    store_memory(req.content, metadata)
    return {"status": "Memory stored successfully"}

# ROUTE 2: Ask a question
@app.post("/ask")
async def ask_question(req: AskRequest):
    answer, sources = search_memory(req.question)
    
    # Track query history
    query_history.insert(0, {
        "q": req.question,
        "time": "Just now", # Frontend can format based on real timestamp if needed
        "author": "User" # hardcoded for demo, could be dynamic
    })
    # Keep only last 10
    if len(query_history) > 10:
        query_history.pop()
        
    return {
        "answer": answer,
        "sources": [doc.metadata for doc in sources]
    }

@app.get("/stats")
def get_stats():
    return {
        "total_memories": get_db_stats(),
        "model": "Phi-3 Mini (Local CPU/NPU)",
        "status": "operational",
        "cloud_calls": 0,
        "recent_activity": query_history
    }

@app.get("/amd-status")
def amd_status():
    """Legacy endpoint — kept for backwards compatibility."""
    return {
        "device": "AMD Ryzen AI NPU",
        "inference": "On-Device (Ollama)",
        "cloud_dependency": "ZERO",
        "privacy": "100% Local",
        "processor": platform.processor()
    }

# ROUTE 3: Health check
@app.get("/")
def home():
    return {"status": "ContextOS is running"}


# ═══════════════════════════════════════════
# AMD HARDWARE + INFERENCE MONITOR
# ═══════════════════════════════════════════

from amd_monitor import (
    get_cached_inference_status,
    get_system_metrics as amd_get_system_metrics,
)


@app.get("/amd/status")
async def amd_full_status():
    """
    Full AMD/hardware inference status.
    Includes Ollama detection, GPU/CPU info, metrics, cloud call count.
    Cached for 3 seconds to avoid hammering psutil.
    """
    return get_cached_inference_status()


@app.get("/amd/metrics")
async def amd_live_metrics():
    """
    Lightweight endpoint — just CPU/RAM metrics.
    No caching, always fresh. Used by frontend for live gauge updates.
    """
    return amd_get_system_metrics()


# ═══════════════════════════════════════════
# GMAIL INTEGRATION ENDPOINTS
# ═══════════════════════════════════════════

from gmail_connector import (
    get_auth_url,
    exchange_code,
    is_connected,
    load_credentials,
    fetch_emails,
    ingest_emails_to_chromadb,
    get_sync_meta,
)


@app.get("/gmail/connect")
async def gmail_connect():
    """
    Returns Google OAuth consent URL.
    If already connected (valid token exists), returns status instead.
    """
    if is_connected():
        return {"status": "already_connected", "auth_url": None}

    auth_url = get_auth_url()
    return {"auth_url": auth_url}


@app.get("/gmail/callback")
async def gmail_callback(code: str, state: str = None):
    """
    Handles the OAuth redirect from Google.
    Exchanges code for token, saves to gmail_token.json,
    then redirects the user back to the frontend.
    """
    try:
        exchange_code(code)
        return RedirectResponse(
            url="http://localhost:5173/memory?gmail=connected"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OAuth exchange failed: {str(e)}")


@app.post("/gmail/sync")
async def gmail_sync(req: GmailSyncRequest):
    """
    Fetches emails from Gmail, then ingests them into ChromaDB.
    Handles token-expired, ollama-offline, and quota errors gracefully.
    """
    # Check if connected
    if not is_connected():
        auth_url = get_auth_url()
        return {
            "success": False,
            "error": "token_expired",
            "auth_url": auth_url,
            "message": "Gmail session expired. Please reconnect.",
        }

    try:
        emails = fetch_emails(max_results=req.max_emails)
    except PermissionError:
        auth_url = get_auth_url()
        return {
            "success": False,
            "error": "token_expired",
            "auth_url": auth_url,
            "message": "Gmail token expired. Please reconnect.",
        }
    except Exception as e:
        error_str = str(e).lower()
        if "quota" in error_str or "rate" in error_str:
            raise HTTPException(
                status_code=429,
                detail={"error": "quota_exceeded", "message": "Gmail API quota exceeded. Try again later."},
            )
        raise HTTPException(status_code=500, detail=f"Gmail fetch error: {str(e)}")

    # Ingest into ChromaDB
    try:
        result = ingest_emails_to_chromadb(emails)
    except ConnectionError:
        raise HTTPException(
            status_code=503,
            detail={"error": "ollama_offline", "message": "Ollama is not running. Start Ollama and try again."},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingest error: {str(e)}")

    return {
        "success": True,
        "synced": result["synced"],
        "skipped": result["skipped"],
        "total_chunks": result["total_chunks"],
        "message": f"Synced {result['synced']} emails from Gmail ({result['skipped']} already existed)",
    }


@app.get("/gmail/status")
async def gmail_status():
    """
    Returns Gmail connection status, last sync time, and email count.
    Used by the frontend GmailCard to poll for connection state.
    """
    connected = is_connected()
    meta = get_sync_meta()
    return {
        "connected": connected,
        "last_sync": meta.get("last_sync"),
        "email_count": meta.get("email_count", 0),
    }


# Run the server
# Command: uvicorn main:app --reload

