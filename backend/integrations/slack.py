from slack_sdk import WebClient
import os
import sys

# Add parent dir to path so we can import ai_engine
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ai_engine import store_memory

def fetch_slack_messages(token, channel_id):
    if not token or not channel_id:
        print("No Slack token/channel provided. Skipping real integration for demo.")
        return
        
    client = WebClient(token=token)
    
    # Get messages from channel
    result = client.conversations_history(channel=channel_id)
    
    for message in result.get('messages', []):
        if 'text' in message:
            store_memory(
                text=message['text'],
                metadata={
                    "source": "slack",
                    "date": message.get('ts', 'unknown'),
                    "user": message.get('user', 'unknown'),
                    "type": "slack_message"
                }
            )
