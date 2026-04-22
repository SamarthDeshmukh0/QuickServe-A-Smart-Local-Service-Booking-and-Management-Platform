# # ============================================================
# # FILE: app.py
# # ============================================================

# """
# QuickServe Recommendation Microservice
# ----------------------------------------
# Flask REST API that receives provider data from Spring Boot,
# scores each provider using the recommendation algorithm,
# and returns a ranked list.

# Port  : 5001
# Endpoint: POST /recommend
# Health  : GET  /health
# """

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from scorer import rank_providers

# # ── App setup ───────────────────────────────────────────────
# app = Flask(__name__)
# CORS(app)   # allow cross-origin requests from Spring Boot


# # ── Health check ────────────────────────────────────────────
# @app.route("/health", methods=["GET"])
# def health():
#     """Simple health check endpoint."""
#     return jsonify({
#         "status":  "UP",
#         "service": "QuickServe Recommendation Engine",
#         "version": "1.0.0"
#     }), 200


# # ── Recommend endpoint ───────────────────────────────────────
# @app.route("/recommend", methods=["POST"])
# def recommend():
#     """
#     Receive provider list from Spring Boot and return ranked providers.

#     Expected JSON body:
#     {
#         "customer_city": "Bangalore",
#         "service_type":  "Plumber",
#         "providers": [
#             {
#                 "id":               1,
#                 "name":             "Ravi Kumar",
#                 "city":             "Bangalore",
#                 "avg_rating":       4.5,
#                 "years_experience": 8,
#                 "total_jobs":       45
#             },
#             ...
#         ]
#     }

#     Returns:
#     {
#         "ranked_providers": [
#             {
#                 "id":                   1,
#                 "name":                 "Ravi Kumar",
#                 "recommendation_score": 4.68,
#                 "is_top_pick":          true
#             },
#             ...
#         ],
#         "customer_city":  "Bangalore",
#         "service_type":   "Plumber",
#         "total_providers": 3
#     }
#     """
#     # ── Validate request ─────────────────────────────────────
#     if not request.is_json:
#         return jsonify({"error": "Request must be JSON"}), 400

#     data = request.get_json()

#     customer_city = data.get("customer_city", "")
#     service_type  = data.get("service_type", "")
#     providers     = data.get("providers", [])

#     if not customer_city:
#         return jsonify({"error": "customer_city is required"}), 400

#     if not isinstance(providers, list):
#         return jsonify({"error": "providers must be a list"}), 400

#     # ── Score and rank ───────────────────────────────────────
#     ranked = rank_providers(providers, customer_city)

#     # ── Build response ───────────────────────────────────────
#     return jsonify({
#         "ranked_providers":  ranked,
#         "customer_city":     customer_city,
#         "service_type":      service_type,
#         "total_providers":   len(ranked),
#     }), 200


# # ── Score single provider (utility endpoint) ─────────────────
# @app.route("/score", methods=["POST"])
# def score_single():
#     """
#     Score a single provider for quick testing.

#     Expected JSON body:
#     {
#         "customer_city": "Bangalore",
#         "provider": {
#             "id": 1,
#             "name": "Ravi Kumar",
#             "city": "Bangalore",
#             "avg_rating": 4.5,
#             "years_experience": 8
#         }
#     }
#     """
#     if not request.is_json:
#         return jsonify({"error": "Request must be JSON"}), 400

#     data          = request.get_json()
#     customer_city = data.get("customer_city", "")
#     provider      = data.get("provider", {})

#     if not customer_city or not provider:
#         return jsonify({"error": "customer_city and provider are required"}), 400

#     from scorer import calculate_score
#     score = calculate_score(provider, customer_city)

#     return jsonify({
#         "provider_id":          provider.get("id"),
#         "provider_name":        provider.get("name"),
#         "recommendation_score": score,
#         "breakdown": {
#             "rating_score":     round(float(provider.get("avg_rating", 0)) * 0.40, 3),
#             "experience_score": round(min(float(provider.get("years_experience", 0)) / 10.0, 1.0) * 5.0 * 0.35, 3),
#             "proximity_score":  round((5.0 if str(provider.get("city","")).lower() == customer_city.lower() else 0.0) * 0.25, 3),
#         }
#     }), 200


# # ── Error handlers ───────────────────────────────────────────
# @app.errorhandler(404)
# def not_found(e):
#     return jsonify({"error": "Endpoint not found"}), 404


# @app.errorhandler(405)
# def method_not_allowed(e):
#     return jsonify({"error": "Method not allowed"}), 405


# @app.errorhandler(500)
# def internal_error(e):
#     return jsonify({"error": "Internal server error", "details": str(e)}), 500


# # ── Entry point ──────────────────────────────────────────────
# if __name__ == "__main__":
#     print("=" * 55)
#     print("  QuickServe Recommendation Microservice")
#     print("  Running on http://localhost:5001")
#     print("  Endpoints:")
#     print("    GET  /health     → health check")
#     print("    POST /recommend  → rank provider list")
#     print("    POST /score      → score single provider")
#     print("=" * 55)
#     app.run(host="0.0.0.0", port=5001, debug=True)



# ============================================================
# FILE: app.py  (FULL REPLACEMENT)
# All existing endpoints preserved exactly.    version1 for estimator.
# /estimate endpoint added at the bottom.
# ============================================================

# """
# QuickServe Recommendation Microservice
# ----------------------------------------
# Flask REST API that receives provider data from Spring Boot,
# scores each provider using the recommendation algorithm,
# and returns a ranked list.

# Port    : 5001
# Endpoints:
#   GET  /health    → health check
#   POST /recommend → rank provider list
#   POST /score     → score single provider
#   POST /estimate  → smart price estimator  ← NEW
# """

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from scorer import rank_providers, estimate_price

# # ── App setup ───────────────────────────────────────────────
# app = Flask(__name__)
# CORS(app)


# # ── Health check (unchanged) ────────────────────────────────
# @app.route("/health", methods=["GET"])
# def health():
#     return jsonify({
#         "status":  "UP",
#         "service": "QuickServe Recommendation Engine",
#         "version": "1.1.0",
#     }), 200


# # ── Recommend endpoint (unchanged) ──────────────────────────
# @app.route("/recommend", methods=["POST"])
# def recommend():
#     if not request.is_json:
#         return jsonify({"error": "Request must be JSON"}), 400

#     data          = request.get_json()
#     customer_city = data.get("customer_city", "")
#     service_type  = data.get("service_type", "")
#     providers     = data.get("providers", [])

#     if not customer_city:
#         return jsonify({"error": "customer_city is required"}), 400
#     if not isinstance(providers, list):
#         return jsonify({"error": "providers must be a list"}), 400

#     ranked = rank_providers(providers, customer_city)

#     return jsonify({
#         "ranked_providers": ranked,
#         "customer_city":    customer_city,
#         "service_type":     service_type,
#         "total_providers":  len(ranked),
#     }), 200


# # ── Score single provider (unchanged) ───────────────────────
# @app.route("/score", methods=["POST"])
# def score_single():
#     if not request.is_json:
#         return jsonify({"error": "Request must be JSON"}), 400

#     data          = request.get_json()
#     customer_city = data.get("customer_city", "")
#     provider      = data.get("provider", {})

#     if not customer_city or not provider:
#         return jsonify({"error": "customer_city and provider are required"}), 400

#     from scorer import calculate_score
#     score = calculate_score(provider, customer_city)

#     return jsonify({
#         "provider_id":          provider.get("id"),
#         "provider_name":        provider.get("name"),
#         "recommendation_score": score,
#         "breakdown": {
#             "rating_score":     round(float(provider.get("avg_rating", 0)) * 0.40, 3),
#             "experience_score": round(min(float(provider.get("years_experience", 0)) / 10.0, 1.0) * 5.0 * 0.35, 3),
#             "proximity_score":  round((5.0 if str(provider.get("city", "")).lower() == customer_city.lower() else 0.0) * 0.25, 3),
#         },
#     }), 200


# # ════════════════════════════════════════════════════════════
# # NEW ENDPOINT: POST /estimate
# # Smart Price Estimator — called directly from React frontend
# # ════════════════════════════════════════════════════════════
# @app.route("/estimate", methods=["POST"])
# def estimate():
#     """
#     Analyse problem description text and return a smart price estimate.

#     Expected JSON body:
#     {
#         "service":     "Plumber",
#         "description": "Pipe burst in kitchen, water flooding everywhere"
#     }

#     Returns:
#     {
#         "base_price":       499,
#         "min_price":        650,
#         "max_price":        950,
#         "severity":         "Major",
#         "severity_color":   "orange",
#         "multiplier":       1.5,
#         "matched_keywords": ["burst", "flooding"],
#         "reason":           "Major issue detected based on keywords: ...",
#         "estimated_time":   "2 – 4 hours"
#     }

#     Error cases:
#       400 — missing service or description field
#       400 — description too short (< 5 characters, not enough to analyse)
#     """
#     if not request.is_json:
#         return jsonify({"error": "Request must be JSON"}), 400

#     data        = request.get_json()
#     service     = data.get("service", "").strip()
#     description = data.get("description", "").strip()

#     # ── Validate ─────────────────────────────────────────────
#     if not service:
#         return jsonify({"error": "service is required"}), 400

#     if not description:
#         return jsonify({"error": "description is required"}), 400

#     # Need at least 5 characters to do meaningful analysis
#     if len(description) < 5:
#         return jsonify({"error": "description is too short to analyse"}), 400

#     # ── Run estimator ─────────────────────────────────────────
#     result = estimate_price(service, description)

#     return jsonify(result), 200


# # ── Error handlers (unchanged) ───────────────────────────────
# @app.errorhandler(404)
# def not_found(e):
#     return jsonify({"error": "Endpoint not found"}), 404


# @app.errorhandler(405)
# def method_not_allowed(e):
#     return jsonify({"error": "Method not allowed"}), 405


# @app.errorhandler(500)
# def internal_error(e):
#     return jsonify({"error": "Internal server error", "details": str(e)}), 500


# # ── Entry point ──────────────────────────────────────────────
# if __name__ == "__main__":
#     print("=" * 55)
#     print("  QuickServe Recommendation Microservice v1.1.0")
#     print("  Running on http://localhost:5001")
#     print("  Endpoints:")
#     print("    GET  /health    → health check")
#     print("    POST /recommend → rank provider list")
#     print("    POST /score     → score single provider")
#     print("    POST /estimate  → smart price estimator")
#     print("=" * 55)
#     app.run(host="0.0.0.0", port=5001, debug=True)








# # ============================================================
# # FILE: app.py  (FULL REPLACEMENT)
# # ============================================================

# """
# QuickServe Recommendation Microservice  v1.1.0
# -----------------------------------------------
# Port  : 5001

# Endpoints:
#   GET  /health    health check
#   POST /recommend rank provider list by AI score
#   POST /score     score a single provider (utility)
#   POST /estimate  smart price estimator based on problem text  NEW
# """

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from scorer import rank_providers, calculate_score, estimate_price

# # App setup
# app = Flask(__name__)
# CORS(app)


# # ── GET /health ──────────────────────────────────────────────
# @app.route("/health", methods=["GET"])
# def health():
#     """Simple health check — called by Spring Boot on startup."""
#     return jsonify({
#         "status":  "UP",
#         "service": "QuickServe Recommendation Engine",
#         "version": "1.1.0",
#     }), 200


# # ── POST /recommend ──────────────────────────────────────────
# @app.route("/recommend", methods=["POST"])
# def recommend():
#     """
#     Receive provider list from Spring Boot, score every provider,
#     and return them sorted by recommendation score descending.

#     Request body:
#     {
#         "customer_city": "Bangalore",
#         "service_type":  "Plumber",
#         "providers": [
#             {
#                 "id": 1, "name": "Ravi Kumar", "city": "Bangalore",
#                 "avg_rating": 4.5, "years_experience": 8, "total_jobs": 45
#             }
#         ]
#     }

#     Response:
#     {
#         "ranked_providers": [
#             { "id": 1, "name": "Ravi Kumar",
#               "recommendation_score": 4.68, "is_top_pick": true }
#         ],
#         "customer_city":   "Bangalore",
#         "service_type":    "Plumber",
#         "total_providers": 1
#     }
#     """
#     if not request.is_json:
#         return jsonify({"error": "Request must be JSON"}), 400

#     data          = request.get_json()
#     customer_city = data.get("customer_city", "")
#     service_type  = data.get("service_type",  "")
#     providers     = data.get("providers",     [])

#     if not customer_city:
#         return jsonify({"error": "customer_city is required"}), 400

#     if not isinstance(providers, list):
#         return jsonify({"error": "providers must be a list"}), 400

#     ranked = rank_providers(providers, customer_city)

#     return jsonify({
#         "ranked_providers": ranked,
#         "customer_city":    customer_city,
#         "service_type":     service_type,
#         "total_providers":  len(ranked),
#     }), 200


# # ── POST /score ───────────────────────────────────────────────
# @app.route("/score", methods=["POST"])
# def score_single():
#     """
#     Score a single provider. Utility endpoint for testing.

#     Request body:
#     {
#         "customer_city": "Bangalore",
#         "provider": {
#             "id": 1, "name": "Ravi Kumar", "city": "Bangalore",
#             "avg_rating": 4.5, "years_experience": 8
#         }
#     }
#     """
#     if not request.is_json:
#         return jsonify({"error": "Request must be JSON"}), 400

#     data          = request.get_json()
#     customer_city = data.get("customer_city", "")
#     provider      = data.get("provider", {})

#     if not customer_city or not provider:
#         return jsonify({"error": "customer_city and provider are required"}), 400

#     score = calculate_score(provider, customer_city)

#     return jsonify({
#         "provider_id":          provider.get("id"),
#         "provider_name":        provider.get("name"),
#         "recommendation_score": score,
#         "breakdown": {
#             "rating_score":     round(float(provider.get("avg_rating", 0)) * 0.40, 3),
#             "experience_score": round(
#                 min(float(provider.get("years_experience", 0)) / 10.0, 1.0) * 5.0 * 0.35, 3
#             ),
#             "proximity_score":  round(
#                 (5.0 if str(provider.get("city", "")).lower() == customer_city.lower()
#                  else 0.0) * 0.25, 3
#             ),
#         },
#     }), 200


# # ── POST /estimate  (NEW) ─────────────────────────────────────
# @app.route("/estimate", methods=["POST"])
# def estimate():
#     """
#     Analyse problem description text and return a smart price estimate.
#     Called directly from the React frontend — NOT via Spring Boot.

#     Request body:
#     {
#         "service":     "Plumber",
#         "description": "Pipe burst in kitchen, water flooding everywhere"
#     }

#     Response:
#     {
#         "base_price":       499,
#         "min_price":        650,
#         "max_price":        950,
#         "severity":         "Major",
#         "severity_color":   "orange",
#         "multiplier":       1.5,
#         "matched_keywords": ["burst", "flooding"],
#         "reason":           "Major issue detected — keywords found: ...",
#         "estimated_time":   "2 to 4 hours"
#     }

#     Errors:
#         400  missing service field
#         400  missing or too-short description  (< 5 chars)
#     """
#     if not request.is_json:
#         return jsonify({"error": "Request must be JSON"}), 400

#     data        = request.get_json()
#     service     = data.get("service",     "").strip()
#     description = data.get("description", "").strip()

#     if not service:
#         return jsonify({"error": "service is required"}), 400

#     if not description:
#         return jsonify({"error": "description is required"}), 400

#     if len(description) < 5:
#         return jsonify({"error": "description too short to analyse"}), 400

#     result = estimate_price(service, description)
#     return jsonify(result), 200


# # ── Error handlers ────────────────────────────────────────────
# @app.errorhandler(404)
# def not_found(e):
#     return jsonify({"error": "Endpoint not found"}), 404


# @app.errorhandler(405)
# def method_not_allowed(e):
#     return jsonify({"error": "Method not allowed"}), 405


# @app.errorhandler(500)
# def internal_error(e):
#     return jsonify({"error": "Internal server error", "details": str(e)}), 500


# # ── Entry point ───────────────────────────────────────────────
# if __name__ == "__main__":
#     print("=" * 55)
#     print("  QuickServe Recommendation Microservice  v1.1.0")
#     print("  Running on http://localhost:5001")
#     print("  Endpoints:")
#     print("    GET  /health    health check")
#     print("    POST /recommend rank provider list")
#     print("    POST /score     score single provider")
#     print("    POST /estimate  smart price estimator")
#     print("=" * 55)
#     app.run(host="0.0.0.0", port=5001, debug=True)






'''

# ============================================================
# FILE: app.py  (FULL REPLACEMENT)
# All existing endpoints preserved exactly.
# POST /forecast added at the bottom.
# numpy added to requirements.txt comment.
# ============================================================

"""
QuickServe Recommendation Microservice  v1.2.0
-----------------------------------------------
Port  : 5001

Endpoints:
  GET  /health    health check
  POST /recommend rank provider list by AI score
  POST /score     score a single provider (utility)
  POST /forecast  earnings forecast using linear regression  ← NEW
"""

# requirements.txt — add numpy:
# flask==3.0.2
# flask-cors==4.0.0
# numpy>=1.24.0        ← ADD THIS LINE

from flask import Flask, request, jsonify
from flask_cors import CORS
from scorer import rank_providers, calculate_score, forecast_earnings

app = Flask(__name__)
CORS(app)


# ── GET /health ───────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status":  "UP",
        "service": "QuickServe Recommendation Engine",
        "version": "1.2.0",
    }), 200


# ── POST /recommend (unchanged) ───────────────────────────────
@app.route("/recommend", methods=["POST"])
def recommend():
    """
    Receive provider list from Spring Boot and return ranked by score.
    """
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data          = request.get_json()
    customer_city = data.get("customer_city", "")
    service_type  = data.get("service_type",  "")
    providers     = data.get("providers",     [])

    if not customer_city:
        return jsonify({"error": "customer_city is required"}), 400
    if not isinstance(providers, list):
        return jsonify({"error": "providers must be a list"}), 400

    ranked = rank_providers(providers, customer_city)

    return jsonify({
        "ranked_providers": ranked,
        "customer_city":    customer_city,
        "service_type":     service_type,
        "total_providers":  len(ranked),
    }), 200


# ── POST /score (unchanged) ───────────────────────────────────
@app.route("/score", methods=["POST"])
def score_single():
    """
    Score a single provider. Utility endpoint for testing.
    """
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data          = request.get_json()
    customer_city = data.get("customer_city", "")
    provider      = data.get("provider", {})

    if not customer_city or not provider:
        return jsonify({"error": "customer_city and provider are required"}), 400

    score = calculate_score(provider, customer_city)

    return jsonify({
        "provider_id":          provider.get("id"),
        "provider_name":        provider.get("name"),
        "recommendation_score": score,
        "breakdown": {
            "rating_score":     round(
                float(provider.get("avg_rating", 0)) * 0.40, 3),
            "experience_score": round(
                min(float(provider.get("years_experience", 0)) / 10.0, 1.0)
                * 5.0 * 0.35, 3),
            "proximity_score":  round(
                (5.0 if str(provider.get("city", "")).lower()
                 == customer_city.lower() else 0.0) * 0.25, 3),
        },
    }), 200


# ── POST /forecast  (NEW) ─────────────────────────────────────
@app.route("/forecast", methods=["POST"])
def forecast():
    """
    Predict next month's earnings using linear regression on
    the provider's historical monthly earnings.

    Called directly from React ProviderEarnings.jsx.
    Does NOT go through Spring Boot.

    Request body:
    {
        "provider_id": 5,
        "monthly_data": [
            {"month": "Jul", "amount": 3200},
            {"month": "Aug", "amount": 3800},
            {"month": "Sep", "amount": 4100},
            {"month": "Oct", "amount": 4700},
            {"month": "Nov", "amount": 5200},
            {"month": "Dec", "amount": 5800}
        ]
    }

    Success response:
    {
        "predicted_amount": 6380.0,
        "min_estimate":     5650.0,
        "max_estimate":     7110.0,
        "trend":            "UP",
        "trend_percentage": 9.7,
        "slope":            528.57,
        "r_squared":        0.987,
        "insight":          "Your earnings are trending upward...",
        "months_used":      6
    }

    Error responses:
        400  missing or empty monthly_data
        400  fewer than 3 months supplied
        500  numpy computation error (logged server-side)
    """
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data         = request.get_json()
    monthly_data = data.get("monthly_data", [])

    if not monthly_data:
        return jsonify({"error": "monthly_data is required"}), 400

    if not isinstance(monthly_data, list):
        return jsonify({"error": "monthly_data must be a list"}), 400

    # Minimum 3 months required — enforced in scorer too but check here
    # to return a clean 400 rather than a 500
    if len(monthly_data) < 3:
        return jsonify({
            "error":       "Need at least 3 months of data for a forecast",
            "months_used": len(monthly_data),
        }), 400

    try:
        result = forecast_earnings(monthly_data)

        # scorer returns {"error": ...} if data is insufficient
        if "error" in result:
            return jsonify(result), 400

        return jsonify(result), 200

    except Exception as exc:
        # Log to console (visible in terminal) and return clean error
        print(f"[/forecast] computation error: {exc}")
        return jsonify({
            "error":   "Forecast computation failed",
            "details": str(exc),
        }), 500


# ── Error handlers (unchanged) ────────────────────────────────
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"error": "Method not allowed"}), 405


@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error", "details": str(e)}), 500


# ── Entry point ───────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 55)
    print("  QuickServe Recommendation Microservice  v1.2.0")
    print("  Running on http://localhost:5001")
    print("  Endpoints:")
    print("    GET  /health    health check")
    print("    POST /recommend rank provider list")
    print("    POST /score     score single provider")
    print("    POST /forecast  earnings forecast")
    print("=" * 55)
    app.run(host="0.0.0.0", port=5001, debug=True)

    '''



#updated one

# ============================================================
# FILE: app.py  (FULL REPLACEMENT)
# Restores /estimate and /forecast endpoints
# ============================================================

"""
QuickServe Recommendation Microservice  v1.2.0
-----------------------------------------------
Port  : 5001

Endpoints:
  GET  /health    health check
  POST /recommend rank provider list
  POST /score     score single provider
  POST /estimate  smart price estimator   ← RESTORED
  POST /forecast  earnings forecast       ← RESTORED
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from scorer import (
    rank_providers,
    calculate_score,
    estimate_price,
    forecast_earnings,
)

app = Flask(__name__)
CORS(app)


# ── GET /health ───────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status":  "UP",
        "service": "QuickServe Recommendation Engine",
        "version": "1.2.0",
    }), 200


# ── POST /recommend ───────────────────────────────────────────
@app.route("/recommend", methods=["POST"])
def recommend():
    """
    Rank provider list by recommendation score.
    Now includes completed_jobs in the score calculation.
    Spring Boot must pass total_jobs in the provider payload.
    """
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data          = request.get_json()
    customer_city = data.get("customer_city", "")
    service_type  = data.get("service_type",  "")
    providers     = data.get("providers",     [])

    if not customer_city:
        return jsonify({"error": "customer_city is required"}), 400
    if not isinstance(providers, list):
        return jsonify({"error": "providers must be a list"}), 400

    ranked = rank_providers(providers, customer_city)

    return jsonify({
        "ranked_providers": ranked,
        "customer_city":    customer_city,
        "service_type":     service_type,
        "total_providers":  len(ranked),
    }), 200


# ── POST /score ───────────────────────────────────────────────
@app.route("/score", methods=["POST"])
def score_single():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data          = request.get_json()
    customer_city = data.get("customer_city", "")
    provider      = data.get("provider", {})

    if not customer_city or not provider:
        return jsonify({"error": "customer_city and provider are required"}), 400

    score = calculate_score(provider, customer_city)

    return jsonify({
        "provider_id":          provider.get("id"),
        "provider_name":        provider.get("name"),
        "recommendation_score": score,
        "breakdown": {
            "rating_score":     round(float(provider.get("avg_rating", 0)) * 0.35, 3),
            "experience_score": round(
                min(float(provider.get("years_experience", 0)) / 10.0, 1.0)
                * 5.0 * 0.25, 3),
            "proximity_score":  round(
                (5.0 if str(provider.get("city", "")).lower()
                 == customer_city.lower() else 0.0) * 0.25, 3),
            "jobs_score":       round(
                min(float(provider.get("completed_jobs", 0)) / 50.0, 1.0)
                * 5.0 * 0.15, 3),
        },
    }), 200


# ── POST /estimate (RESTORED) ─────────────────────────────────
@app.route("/estimate", methods=["POST"])
def estimate():
    """
    Analyse problem description and return smart price estimate.

    Request:  { "service": "Plumber", "description": "pipe burst..." }
    Response: { "min_price": 650, "max_price": 950, "severity": "Major", ... }
    """
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data        = request.get_json()
    service     = data.get("service",     "").strip()
    description = data.get("description", "").strip()

    if not service:
        return jsonify({"error": "service is required"}), 400
    if not description:
        return jsonify({"error": "description is required"}), 400
    if len(description) < 5:
        return jsonify({"error": "description too short to analyse"}), 400

    result = estimate_price(service, description)
    return jsonify(result), 200


# ── POST /forecast (RESTORED — now works with 2 months) ───────
@app.route("/forecast", methods=["POST"])
def forecast():
    """
    Predict next month's earnings using linear regression.
    Now requires minimum 2 months instead of 3.

    Request:
    {
        "provider_id": 5,
        "monthly_data": [
            {"month": "Nov", "amount": 3200},
            {"month": "Dec", "amount": 3800}
        ]
    }
    """
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data         = request.get_json()
    monthly_data = data.get("monthly_data", [])

    if not monthly_data:
        return jsonify({"error": "monthly_data is required"}), 400
    if not isinstance(monthly_data, list):
        return jsonify({"error": "monthly_data must be a list"}), 400

    # Minimum is now 2 months
    if len(monthly_data) < 2:
        return jsonify({
            "error":       "Need at least 2 months of data for a forecast",
            "months_used": len(monthly_data),
        }), 400

    try:
        result = forecast_earnings(monthly_data)
        if "error" in result:
            return jsonify(result), 400
        return jsonify(result), 200
    except Exception as exc:
        print(f"[/forecast] error: {exc}")
        return jsonify({"error": "Forecast computation failed", "details": str(exc)}), 500


# ── Error handlers ────────────────────────────────────────────
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"error": "Method not allowed"}), 405

@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error", "details": str(e)}), 500


# ── Entry point ───────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 55)
    print("  QuickServe Recommendation Microservice  v1.2.0")
    print("  Running on http://localhost:5001")
    print("  Endpoints:")
    print("    GET  /health    health check")
    print("    POST /recommend rank provider list")
    print("    POST /score     score single provider")
    print("    POST /estimate  smart price estimator")
    print("    POST /forecast  earnings forecast")
    print("=" * 55)
    app.run(host="0.0.0.0", port=5001, debug=True)