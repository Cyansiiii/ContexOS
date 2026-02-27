import os
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.llms import Ollama
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Use precise absolute path if needed, or relative path ensuring it runs correctly
DB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "database", "chroma_db")

try:
    # This is the AI brain
    llm = Ollama(model="mistral")  # Local AI, no internet needed
    embeddings = OllamaEmbeddings(model="nomic-embed-text")

    # This is the memory storage
    vectorstore = Chroma(
        persist_directory=DB_DIR,
        embedding_function=embeddings
    )
except Exception as e:
    print(f"⚠️ Ollama or ChromaDB not configured correctly: {e}")
    print("Start Ollama with: ollama serve")
    llm = None
    embeddings = None
    vectorstore = None

def store_memory(text, metadata):
    """Save any piece of information into memory"""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500, 
        chunk_overlap=50
    )
    chunks = splitter.split_text(text)
    if vectorstore is not None:
        vectorstore.add_texts(
            texts=chunks,
            metadatas=[metadata] * len(chunks)
        )
        vectorstore.persist()

def search_memory(question):
    """Search memory and get AI answer"""
    if vectorstore is None or llm is None:
        return "ContextOS is not ready. Please ensure Ollama is running and ChromaDB is accessible.", []
        
    # Find relevant stored memories
    relevant_docs = vectorstore.similarity_search(question, k=5)
    
    # Build context from memories
    context = "\n".join([doc.page_content for doc in relevant_docs])
    
    # Ask AI to answer using that context
    prompt = f"""
    You are ContextOS, a company memory assistant.
    Based on this company data: {context}
    Answer this question: {question}
    Give specific details about decisions, people involved, and dates.
    """
    
    answer = llm.invoke(prompt)
    return answer, relevant_docs

def get_db_stats():
    """Return stats about the vector database"""
    if vectorstore is None:
        return 0
    try:
        count = vectorstore.get()
        return len(count['ids']) if count and 'ids' in count else 0
    except Exception:
        return 0
