FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

# Create virtual environment and install dependencies
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Run the application
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
