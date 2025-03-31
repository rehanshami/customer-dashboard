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
# The environment variable DATABASE_URL should be set in Render



# Add a command to run seed.py after the app starts
CMD bash -c "/wait-for-it.sh $(echo $DATABASE_URL | sed -e 's|postgresql://||' -e 's|/.*||'):5432 -- uvicorn main:app --host 0.0.0.0 --port 8000"
