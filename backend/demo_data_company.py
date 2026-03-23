"""
demo_data_company.py - loads realistic demo memories for ContextOS.

Works with both the Chroma vector store path and the JSON fallback path.
"""

import os
import sys

from langchain_text_splitters import RecursiveCharacterTextSplitter

# Ensure the backend directory is on the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ai_engine import VECTORSTORE_AVAILABLE, store_memory, vectorstore


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
            "Decision log - March 2026. We switched from AWS to Railway for "
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
            "Client decision - Acme Corp. Date: January 2026. Decision: "
            "Rejected the Acme Corp deal. Reason: Their budget was Rs. 1.2 "
            "lakh/year which is below our Rs. 1.8 lakh minimum ARR threshold "
            "for the Growth plan. Suggested they start with Starter plan at "
            "Rs. 60,000/year. They declined. Decision made by Anandam."
        ),
    },
    {
        "filename": "team_expertise_map",
        "text": (
            "Team expertise map - ContextOS. "
            "Anandam: payment integration, RAG pipeline, ChromaDB, FastAPI, "
            "AMD hardware integration, LangChain, Mistral deployment. "
            "The whole backend AI stack is owned by Anandam. "
            "Frontend owned by Anandam (React 18, Tailwind, Vite). "
            "Devops and deployment owner: Anandam. We deploy on Railway."
        ),
    },
    {
        "filename": "onboarding_guide",
        "text": (
            "New joiner onboarding guide 2026. Standard onboarding takes 2-3 days, not weeks. "
            "Day 1: Laptop provided, GitHub access granted, added to Slack workspace. "
            "Day 2: Dev environment setup (Python 3.11, Node 18, Ollama). "
            "Day 3: Codebase walkthrough with Anandam. Week 1: First PR submitted. "
            "All internal decisions are searchable via ContextOS - ask it anything about why we built things the way we did."
        ),
    },
    {
        "filename": "pricing_rationale",
        "text": (
            "Pricing rationale document. Our pricing plans are Starter Rs. 4,999/month for teams up to 15, "
            "Growth Rs. 19,999/month for teams up to 100, and Enterprise Rs. 75,000+/month for 100+ with SLA. "
            "Nearest competitor Glean charges Rs. 16 lakh+/year. "
            "We are 10x cheaper because we have zero server costs and run on customer hardware. "
            "DPDP Act 2023 compliance is built in by design: data never leaves the customer machine."
        ),
    },
]


def main():
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
            "author": "Anandam",
            "content_type_label": "Document",
        }

        if VECTORSTORE_AVAILABLE and vectorstore is not None:
            vectorstore.add_texts(
                texts=chunks,
                metadatas=[metadata] * len(chunks),
            )
        else:
            store_memory(text, metadata)

        total_chunks += len(chunks)
        print(f"  Ingesting {filename}... done ({len(chunks)} chunks)")

    if VECTORSTORE_AVAILABLE and vectorstore is not None:
        try:
            vectorstore.persist()
        except Exception:
            pass

    print(f"\nDemo data loaded: {len(DOCUMENTS)} documents, {total_chunks} total chunks")


if __name__ == "__main__":
    print("=" * 50)
    print("  ContextOS - Loading Company Demo Data")
    print("=" * 50)
    main()
