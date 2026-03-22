"""
F-15: Structured Error Handling for ContextOS
Provides consistent JSON error shapes across all endpoints.
"""


# ── Error codes ──────────────────────────────────────────
ERROR_CODES = {
    "OLLAMA_OFFLINE": {
        "error_message": "Ollama is not running. Start it with: ollama serve",
        "user_message": "AI engine is offline. Please start Ollama.",
        "recoverable": True,
        "recovery_action": "start_ollama",
    },
    "OLLAMA_NO_MODEL": {
        "error_message": "Ollama is running but the required model is not loaded.",
        "user_message": "AI model not found. Run: ollama pull phi3:mini",
        "recoverable": True,
        "recovery_action": "pull_model",
    },
    "CHROMADB_EMPTY": {
        "error_message": "No memories in ChromaDB yet.",
        "user_message": "No memories yet. Add some documents to get started.",
        "recoverable": True,
        "recovery_action": "add_memory",
    },
    "CHROMADB_ERROR": {
        "error_message": "ChromaDB read/write failure.",
        "user_message": "Memory database error. Try restarting ContextOS.",
        "recoverable": True,
        "recovery_action": "restart",
    },
    "EMBEDDING_FAILED": {
        "error_message": "nomic-embed-text embedding call failed.",
        "user_message": "Embedding generation failed. Check Ollama is running.",
        "recoverable": True,
        "recovery_action": "start_ollama",
    },
    "GMAIL_TOKEN_EXPIRED": {
        "error_message": "Gmail OAuth token needs refresh.",
        "user_message": "Gmail session expired. Reconnect Gmail.",
        "recoverable": True,
        "recovery_action": "reconnect_gmail",
    },
    "INVALID_INPUT": {
        "error_message": "Request body missing required fields.",
        "user_message": "Please fill in all required fields.",
        "recoverable": True,
        "recovery_action": "fix_input",
    },
    "RATE_LIMITED": {
        "error_message": "Too many requests.",
        "user_message": "Slow down! Too many requests. Try again shortly.",
        "recoverable": True,
        "recovery_action": "wait",
    },
}


def make_error(error_code: str, detail: str = None) -> dict:
    """
    Build a structured error response dict.
    """
    defaults = ERROR_CODES.get(error_code, {
        "error_message": detail or "Unknown error.",
        "user_message": detail or "Something went wrong.",
        "recoverable": False,
        "recovery_action": None,
    })

    return {
        "error": True,
        "error_code": error_code,
        "error_message": detail or defaults["error_message"],
        "user_message": defaults["user_message"],
        "recoverable": defaults["recoverable"],
        "recovery_action": defaults["recovery_action"],
    }
