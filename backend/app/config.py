import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-factcheckai')
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
    PORT = int(os.environ.get('PORT', 5000))
    # Debugger must be opted into explicitly; FLASK_ENV often defaults to
    # development in local shells and should not expose the interactive console.
    DEBUG = os.environ.get('FLASK_DEBUG', '0').strip().lower() in {'1', 'true', 'yes'}
