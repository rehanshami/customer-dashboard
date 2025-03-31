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

# Use the environment variable for the database host
# Assume that the environment variable DATABASE_HOST is set correctly in Render
# The default for database host is 'db' if not set, but you may want to modify it
CMD ["/wait-for-it.sh", "postgresql://postgres_data_ibla_user:ZPA4bDYPYgTrVoj7clC3mQ0ZWt3zYjY2@dpg-cvl0901r0fns7387p1ig-a/postgres_data_ibla:5432", "--", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
