# ADDED FOR DEPLOYMENT — Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (Render/Railway override via $PORT env var)
EXPOSE 8000

# ADDED FOR DEPLOYMENT: use $PORT from environment, default 8000
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
