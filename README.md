# Sudoku Solver

A full-stack web application for solving Sudoku puzzles. The backend API provides puzzles and the frontend allows users to solve them.

## Technology Stack

### Backend
- Python with FastAPI
- SQLite database with SQLAlchemy ORM
- API authentication with API key

### Frontend
- HTML, CSS, JavaScript
- Axios for API requests

## Deployment to Render

This project is configured for deployment on Render using the `render.yaml` file. The application consists of two services:

1. **Backend API**: A FastAPI application that serves puzzles from a database
2. **Frontend**: A static website that consumes the API

### Deployment Steps

1. Sign up for a [Render](https://render.com) account if you don't have one

2. Connect your GitHub repository to Render

3. Create a new Blueprint instance on Render using your repository

4. Set the environment variables in the Render dashboard:
   - `API_KEY`: Your secret API key for authenticating API requests

5. Update the frontend configuration:
   - Edit `front/config.js` to set the correct `apiUrl` value with your actual Render API URL

### Running Locally

#### Backend
```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend
Simply open `front/index.html` in your browser or serve it with a local server:
```bash
cd front
python -m http.server 3000
```

Then visit `http://localhost:3000` in your browser.
