"""
FactCheckAI Vercel Serverless Gateway
Exports WSGI `app` compatible with Vercel Serverless Functions
"""

import sys
import os

# Include backend in sys.path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
if os.path.exists(backend_path) and backend_path not in sys.path:
    sys.path.insert(0, backend_path)

try:
    from app import create_app
    app = create_app()
except Exception as e:
    # Direct fallback if run in isolated serverless container
    from flask import Flask, jsonify, request
    from flask_cors import CORS

    app = Flask(__name__)
    CORS(app)

    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({'status': 'healthy', 'service': 'FactCheckAI Serverless Gateway'})
