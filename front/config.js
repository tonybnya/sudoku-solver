// Configuration for the frontend
const config = {
  // API URL (change this when deployed)
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://your-render-api-url.onrender.com/api' 
    : 'http://localhost:8000/api',
  
  // API Key
  apiKey: '438f7c88057ac8f4162df40444c8d3b0c6fc6138f21d5a52743a2a1f620bb287'
};

