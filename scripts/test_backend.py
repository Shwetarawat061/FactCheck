#!/usr/bin/env python3
"""
scripts/test_backend.py

Sends a POST request to 'http://localhost:5000/api/fact-check' with a sample claim,
prints the HTTP status, headers, raw response text, and verifies if the response
is valid JSON to identify the exact cause of 'Malformed server response' errors.

Usage:
    python3 scripts/test_backend.py
    python3 scripts/test_backend.py [optional_custom_url]
"""

import sys
import json
import urllib.request
import urllib.error

# Default target endpoint as specified
DEFAULT_URL = "http://localhost:5000/api/fact-check"
FALLBACK_PORT_3000 = "http://localhost:3000/api/fact-check"

TARGET_URL = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_URL

SAMPLE_PAYLOAD = {
    "claim": "Water boils at 100C at sea level"
}

def test_endpoint(url: str) -> None:
    print("=" * 64)
    print(" FactCheckAI Backend Diagnostics")
    print(f" Target Endpoint: {url}")
    print(f" Sample Payload:  {json.dumps(SAMPLE_PAYLOAD)}")
    print("=" * 64)

    req_data = json.dumps(SAMPLE_PAYLOAD).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=req_data,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "FactCheckAI-DiagnosticTool/1.0",
        },
        method="POST"
    )

    response_status = None
    response_headers = None
    raw_text = ""

    try:
        with urllib.request.urlopen(req, timeout=90) as response:
            response_status = response.status
            response_headers = dict(response.headers)
            raw_text = response.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        response_status = e.code
        response_headers = dict(e.headers)
        raw_text = e.read().decode("utf-8", errors="replace")
        print(f"\n[HTTP Error Code]: {e.code} ({e.reason})")
    except urllib.error.URLError as e:
        print(f"\n[Connection Error]: Could not connect to {url}")
        print(f"Reason: {e.reason}")
        if url == DEFAULT_URL:
            print(f"\n[Tip] Port 5000 might not be running. Testing port 3000 (Express dev server)...")
            test_endpoint(FALLBACK_PORT_3000)
        return
    except Exception as e:
        print(f"\n[Unexpected Error]: {str(e)}")
        return

    print(f"\n--- HTTP Response Info ---")
    print(f"Status Code:   {response_status}")
    print(f"Content-Type:  {response_headers.get('Content-Type') or response_headers.get('content-type', 'Not specified')}")
    print(f"Content-Length: {len(raw_text)} bytes")

    print(f"\n--- Raw Response Text ---")
    print(raw_text if len(raw_text) <= 2000 else raw_text[:2000] + "\n... [truncated]")

    print(f"\n--- JSON Validation ---")
    # Check if raw text starts with HTML tag (common reason for 'Malformed server response')
    stripped = raw_text.strip()
    if stripped.startswith("<!doctype html>") or stripped.startswith("<!DOCTYPE html>") or stripped.startswith("<html"):
        print(" [FAIL] Response is HTML (Vite / Express SPA fallback page).")
        print("        This happens when the API path does not match or a redirect converted POST to GET.")
        print("        Result in frontend: SyntaxError during JSON parsing -> 'Malformed server response'.")
        return

    try:
        parsed_json = json.loads(raw_text)
        print(" [PASS] Response is valid JSON!")

        if isinstance(parsed_json, dict):
            print(" [PASS] Root response is a JSON Object (dict).")
            print(f" Top-level keys: {list(parsed_json.keys())}")
            
            # Check schema indicators
            if "status" in parsed_json:
                print(f" status: {parsed_json.get('status')}")
            if "verdict" in parsed_json:
                print(f" verdict: {parsed_json.get('verdict')}")
            if "confidence" in parsed_json:
                print(f" confidence: {parsed_json.get('confidence')}%")
            if "evidence" in parsed_json and isinstance(parsed_json["evidence"], list):
                print(f" evidence count: {len(parsed_json['evidence'])} sources")
            if "message" in parsed_json:
                print(f" message: {parsed_json.get('message')}")
            if "code" in parsed_json:
                print(f" error code: {parsed_json.get('code')}")
        else:
            print(f" [FAIL] Response is valid JSON, but type is {type(parsed_json).__name__} instead of object (dict).")
            print("        This will trigger 'Malformed server response (not an object)'.")

    except json.JSONDecodeError as err:
        print(f" [FAIL] Response is NOT valid JSON: {err}")
        print("        This is the direct trigger for 'Malformed server response' in the frontend.")

if __name__ == "__main__":
    test_endpoint(TARGET_URL)
