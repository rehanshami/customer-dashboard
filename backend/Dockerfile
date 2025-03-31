# backend/Dockerfile
FROM python:3.11-slim

# Set working directory in container
WORKDIR /app

# Install curl
RUN apt-get update && apt-get install -y curl

# Copy the requirements.txt first and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

# Download the wait-for-it.sh script and make it executable
RUN curl -sSLo /wait-for-it.sh https://github.com/vishnubob/wait-for-it/raw/master/wait-for-it.sh && chmod +x /wait-for-it.sh

# Start the application
CMD ["/wait-for-it.sh", "db:5432", "--", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

