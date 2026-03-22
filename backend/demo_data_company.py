"""
demo_data_company.py — Pre-loads a realistic fake company knowledge base
into ChromaDB when run directly: python demo_data_company.py

Uses the same chunking + embedding pipeline as real emails.
"""

import sys
import os

# Ensure the backend directory is on the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ai_engine import store_memory, vectorstore
from langchain_text_splitters import RecursiveCharacterTextSplitter

# ═══════════════════════════════════════════
# 7 realistic company documents
# ═══════════════════════════════════════════

DOCUMENTS = [
    {
        "filename": "board_meeting_q3",
        "text": (
            "Board meeting Q3 2026. Attendees: Anandam (CEO), Priya (CFO). "
            "Decision: Enterprise discount approved at 20% for deals above "
            "Rs. 5 lakh ARR. SMB pricing held at Rs. 999/month through Q4. "
            "Pricing review scheduled for January 2027. AWS migration budget "
            "approved at Rs. 2.4 lakh."
        ),
    },
    {
        "filename": "why_we_left_aws",
        "text": (
            "Decision log — March 2026. We switched from AWS to Railway for "
            "all deployments. Reason: Railway is 68% cheaper for our workload "
            "and deploys in under 30 seconds vs 8 minutes on AWS. AWS was "
            "rejected due to complexity, cold start times, and billing "
            "unpredictability. Decision made by Anandam. Approved by board."
        ),
    },
    {
        "filename": "payment_integration",
        "text": (
            "Payment integration notes. Owner: Anandam. Stack: Razorpay v2 "
            "API. Webhook handler at /api/payments/webhook. Test mode key in "
            ".env as RAZORPAY_TEST_KEY. Subscription plans created manually "
            "in Razorpay dashboard. Refund flow documented in Notion under "
            "Finance > Refunds. Last updated: Feb 2026."
        ),
    },
    {
        "filename": "client_acme_rejection",
        "text": (
            "Client decision — Acme Corp. Date: January 2026. Decision: "
            "Rejected the Acme Corp deal. Reason: Their budget was Rs. 1.2 "
            "lakh/year which is below our Rs. 1.8 lakh minimum ARR threshold "
            "for the Growth plan. Suggested they start with Starter plan at "
            "Rs. 60,000/year. They declined. Decision made by Anandam."
        ),
    },
    {
        "filename": "team_expertise_map",
        "text": (
            "Team expertise map — ContextOS. "
            "Anandam: payment integration, RAG pipeline, ChromaDB, FastAPI, "
            "AMD hardware integration, LangChain, Mistral deployment. "
            "The whole backend AI stack is owned by Anandam. "
            "Frontend owned by Anandam (React 18, Tailwind, Vite). "
            "Devops/deployment: Anandam (Railway, Vercel, Netlify)."
        ),
    },
    {
        "filename": "onboarding_guide",
        "text": (
            "New joiner onboarding guide 2026. Day 1: Laptop provided, "
            "GitHub access granted, added to Slack workspace. Day 2: Dev "
            "environment setup (Python 3.11, Node 18, Ollama). Day 3: "
            "Codebase walkthrough with Anandam. Week 1: First PR submitted. "
            "All internal decisions searchable via ContextOS — ask it "
            "anything about why we built things the way we did."
        ),
    },
    {
        "filename": "pricing_rationale",
        "text": (
            "Pricing rationale document. Starter Rs. 4,999/month for teams "
            "up to 15. Growth Rs. 19,999/month for teams up to 100. "
            "Enterprise Rs. 75,000+/month for 100+ with SLA. Nearest "
            "competitor Glean charges Rs. 16 lakh+/year. We are 10x cheaper "
            "because we have zero server costs — runs on customer hardware. "
            "DPDP Act 2023 compliance is built-in by design: data never "
            "leaves the customer machine."
        ),
    },
]


def main():
    if vectorstore is None:
        print(
            "❌ ChromaDB or Ollama is not available.\n"
            "   Make sure Ollama is running: ollama serve\n"
            "   And nomic-embed-text is pulled: ollama pull nomic-embed-text"
        )
        return

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
    )

    total_chunks = 0

    for doc in DOCUMENTS:
        filename = doc["filename"]
        text = doc["text"]

        chunks = splitter.split_text(text)
        metadata = {
            "source_type": "document",
            "source_name": filename,
            "date": "2026-03-01",
        }

        vectorstore.add_texts(
            texts=chunks,
            metadatas=[metadata] * len(chunks),
        )

        total_chunks += len(chunks)
        print(f"  Ingesting {filename}... done ({len(chunks)} chunks)")

    # Persist
    try:
        vectorstore.persist()
    except Exception:
        pass  # Newer ChromaDB versions auto-persist

    print(f"\n✅ Demo data loaded: {len(DOCUMENTS)} documents, {total_chunks} total chunks")


if __name__ == "__main__":
    print("═" * 50)
    print("  ContextOS — Loading Company Demo Data")
    print("═" * 50)
    main()
