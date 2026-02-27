from fastapi import FastAPI, UploadFile, Body
from fastapi.middleware.cors import CORSMiddleware
from ai_engine import store_memory, search_memory
from pydantic import BaseModel
import json

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
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
    return {
        "answer": answer,
        "sources": [doc.metadata for doc in sources]
    }

# ROUTE 3: Health check
@app.get("/")
def home():
    return {"status": "ContextOS is running"}

# Run the server
# Command: uvicorn main:app --reload
