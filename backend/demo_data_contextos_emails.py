"""
Load 6 demo email-style memories for ContextOS RAG testing.

These records are designed to answer the question set around:
- factual retrieval
- decisions
- policy
- people and roles
- summarization
- cross-document reasoning
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ai_engine import store_memory


EMAIL_DOCUMENTS = [
    {
        "source_name": "email_onboarding_and_roles",
        "author": "Aisha Khan",
        "date": "2026-03-03",
        "text": (
            "Subject: New hire onboarding plan for March cohort. "
            "Priya Nair is the onboarding buddy for the new employee joining the product engineering team. "
            "Priya Nair is also responsible for the Search and Retrieval overhaul for ContextOS, including retrieval quality reviews and weekly relevance checks. "
            "Daniel Osei is the Security Operations Lead and is the primary escalation contact for engineering security incidents. "
            "For the March cohort, new joiners should finish environment setup by Wednesday and meet Priya for product walkthroughs on Thursday."
        ),
    },
    {
        "source_name": "email_finance_invoice_and_billing",
        "author": "Meera Kapoor",
        "date": "2026-03-04",
        "text": (
            "Subject: March 2026 invoice and account ownership. "
            "The March 2026 Meridian Labs invoice is due on March 28, 2026. "
            "Billing queries for the Meridian Labs account should be handled by Kavya Menon from finance operations. "
            "If Meridian Labs requests payment confirmation, route it to Kavya Menon first and copy Priya Nair for commercial context."
        ),
    },
    {
        "source_name": "email_security_and_data_policy",
        "author": "Daniel Osei",
        "date": "2026-03-05",
        "text": (
            "Subject: Engineering security and privacy policy refresh. "
            "All security incidents must be reported immediately to Daniel Osei through the security hotline Slack channel and by email. "
            "ChromaDB snapshots must be stored only in the encrypted company backups bucket and never on personal drives. "
            "Engineers are expected to work from the office on Tuesdays and Thursdays unless an exception is approved. "
            "If someone violates the data handling policy, their access is suspended pending a security review and manager escalation. "
            "Engineering teams must not move customer data outside approved local or encrypted internal systems."
        ),
    },
    {
        "source_name": "email_release_v1_1",
        "author": "Priya Nair",
        "date": "2026-03-06",
        "text": (
            "Subject: ContextOS v1.1 release notes. "
            "The staging URL for ContextOS v1.1 is https://staging-v1-1.contextos.app. "
            "Version 1.1 introduced the new Ask Hub layout, improved source chips, backend analytics wiring, and the first Memory Hub sync flows. "
            "The Ask Hub layout was changed to reduce scroll depth, make source evidence easier to scan, and improve first-response clarity for operators. "
            "Known issues in v1.1 include occasional stale analytics after sync, duplicate source chips in some edge cases, and a delayed Gmail sync status refresh. "
            "The v1.1 stack continues to run on the FastAPI backend with local Ollama inference."
        ),
    },
    {
        "source_name": "email_q3_roadmap_meeting",
        "author": "Rohan Shah",
        "date": "2026-03-07",
        "text": (
            "Subject: Q3 roadmap meeting summary. "
            "Key decisions from the Q3 roadmap meeting: the ChromaDB re-index will run as a controlled weekend maintenance task rather than during business hours; "
            "multi-user workspace support was approved for phased delivery after permissions and audit logs are complete; "
            "the FastAPI backend remains the foundation for API and orchestration work; "
            "Priya Nair will own the Search and Retrieval overhaul and release readiness coordination. "
            "The team agreed that retrieval quality and workspace collaboration are the top priorities for Q3."
        ),
    },
    {
        "source_name": "email_engineering_execution_plan",
        "author": "Anandam",
        "date": "2026-03-08",
        "text": (
            "Subject: Engineering execution plan for v1.1 and Q3. "
            "Priya Nair has three active tasks: serve as onboarding buddy for the new product engineer, lead the Search and Retrieval overhaul, and coordinate v1.1 release readiness. "
            "The FastAPI backend is referenced in the v1.1 release notes, the Q3 roadmap summary, and the engineering execution plan because it remains our core application layer. "
            "Engineering security and privacy rules still apply in full: keep customer data in approved internal systems, store ChromaDB snapshots only in encrypted backups, and report incidents directly to Daniel Osei. "
            "These controls apply to everyone touching production, search, or analytics pipelines."
        ),
    },
]


def main():
    for item in EMAIL_DOCUMENTS:
        metadata = {
            "source_type": "email",
            "source_name": item["source_name"],
            "date": item["date"],
            "author": item["author"],
            "content_type_label": "Email",
            "type": "company_data",
        }
        store_memory(item["text"], metadata)
        print(f"Stored {item['source_name']}")

    print(f"\nLoaded {len(EMAIL_DOCUMENTS)} demo email memories.")


if __name__ == "__main__":
    main()
