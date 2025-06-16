#!/bin/bash

# Run database population script
python populate_db.py

# Start the API server
exec uvicorn main:app --host 0.0.0.0 --port $PORT

