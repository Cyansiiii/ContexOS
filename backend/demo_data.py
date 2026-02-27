from ai_engine import store_memory

demo_memories = [
    {
        "text": """
        Board meeting March 2024: We decided to terminate our 
        contract with AgencyX marketing. Reasons: 3 missed 
        deadlines, ROI was only 12% vs promised 40%, 
        CEO Rahul made final call. Alternative considered 
        was AgencyY but budget was the constraint.
        """,
        "metadata": {"source": "meeting_notes", 
                    "date": "2024-03-15", 
                    "type": "decision"}
    },
    {
        "text": """
        Email from CTO Priya - April 2024: We are switching 
        from AWS to Azure because of Microsoft's special 
        startup pricing offer — saving us ₹8 lakhs annually.
        Team was divided but cost won the argument.
        """,
        "metadata": {"source": "email", 
                    "date": "2024-04-02", 
                    "type": "decision"}
    }
]

print("Filling ContextOS with demo data...")
for memory in demo_memories:
    store_memory(memory["text"], memory["metadata"])
print("Done! ContextOS AI brain is ready.")
