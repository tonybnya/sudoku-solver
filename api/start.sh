#!/bin/bash

# Get the PORT from environment variable or default to 8000
PORT=${PORT:-8000}

# Start the application with the correct host and port
uvicorn main:app --host 0.0.0.0 --port $PORT

