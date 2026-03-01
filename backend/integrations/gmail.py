from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import os
import sys

# Add parent dir to path so we can import ai_engine
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ai_engine import store_memory

def extract_email_text(email_data):
    # Simplified extraction for demo purposes
    snippet = email_data.get('snippet', '')
    return snippet

def fetch_and_store_emails(credentials_path):
    # Load credentials if they exist (requires actual setup)
    if not os.path.exists(credentials_path):
        print("No Gmail credentials found. Skipping real integration for demo.")
        return
        
    creds = Credentials.from_authorized_user_file(credentials_path)
    service = build('gmail', 'v1', credentials=creds)
    
    # Get last 100 emails
    messages = service.users().messages().list(
        userId='me', maxResults=100
    ).execute()
    
    for msg in messages.get('messages', []):
        email_data = service.users().messages().get(
            userId='me', id=msg['id']
        ).execute()
        
        # Extract email content
        email_text = extract_email_text(email_data)
        
        # Store in ContextOS memory
        store_memory(
            text=email_text,
            metadata={
                "source": "gmail",
                "date": email_data.get('internalDate', 'unknown'),
                "type": "email"
            }
        )
