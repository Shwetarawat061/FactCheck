"""
backend/app/routes/factcheck_routes.py
POST /api/fact-check  ->  real result | inconclusive | failed
"""
import ipaddress
import logging
import socket
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse

import requests
from flask import Blueprint, jsonify, request

from app.services.verification_pipeline import verify_claim

bp = Blueprint("factcheck", __name__)
log = logging.getLogger("factcheck")
MAX_CLAIM = 1000


def _fail(code: str, message: str, http: int):
    return jsonify({"status": "failed", "code": code, "message": message}), http


def _is_public_http_url(url: str) -> bool:
    try:
        p = urlparse(url)
        if p.scheme not in ("http", "https") or not p.hostname:
            return False
        for info in socket.getaddrinfo(p.hostname, None):
            ip = ipaddress.ip_address(info[4][0])
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved:
                return False  # SSRF guard
        return True
    except Exception:
        return False


def _reachable(url: str) -> bool:
    if not _is_public_http_url(url):
        return False
    headers = {"User-Agent": "FactCheckAI-LinkCheck/1.0"}
    try:
        r = requests.head(url, headers=headers, timeout=5, allow_redirects=True)
        if r.status_code in (403, 405, 501):  # some sites reject HEAD
            r = requests.get(url, headers=headers, timeout=5, stream=True)
            r.close()
        return r.status_code < 400
    except Exception:
        return False


def _annotate_links(result: dict) -> None:
    ev = result.get("evidence", [])
    if not ev:
        return
    with ThreadPoolExecutor(max_workers=6) as pool:
        flags = list(pool.map(lambda e: _reachable(e["url"]), ev))
    for e, ok in zip(ev, flags):
        e["urlReachable"] = ok  # shown in UI; never silently hidden


@bp.route("/api/fact-check", methods=["POST"])
@bp.route("/api/fact-check/", methods=["POST"])
def fact_check():
    body = request.get_json(silent=True)
    claim = body.get("claim") if isinstance(body, dict) else None
    if not isinstance(claim, str) or not claim.strip():
        return _fail("INVALID_CLAIM", "Claim string cannot be empty.", 400)
    claim = claim.strip()
    if len(claim) > MAX_CLAIM:
        return _fail("CLAIM_TOO_LONG", f"Claim must be at most {MAX_CLAIM} characters.", 400)

    try:
        result = verify_claim(claim)
    except KeyError as e:
        log.error("missing env var: %s", e)
        return _fail("SERVER_MISCONFIGURED", "Verification service is not configured.", 503)
    except requests.RequestException:
        log.exception("search provider failed")
        return _fail("SEARCH_UNAVAILABLE", "Evidence search failed. No result was produced.", 502)
    except Exception:
        log.exception("verification failed")
        return _fail("VERIFICATION_FAILED", "Verification failed. No result was produced.", 502)

    _annotate_links(result)
    if result.get("verdict") == "INCONCLUSIVE":
        result["verdict"] = "UNVERIFIED"
    result["status"] = "inconclusive" if result.get("verdict") == "UNVERIFIED" else "ok"
    result["checkedAt"] = __import__("datetime").datetime.utcnow().isoformat() + "Z"
    return jsonify(result), 200
