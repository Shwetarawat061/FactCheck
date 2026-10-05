import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-factcheckai')
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
    PORT = int(os.environ.get('PORT', 5000))
    DEBUG = os.environ.get('FLASK_ENV', 'development') == 'development'
