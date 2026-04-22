# # ============================================================
# # FILE: scorer.py
# # ============================================================

# """
# QuickServe AI Provider Scoring Engine
# --------------------------------------
# Scoring Formula:
#   score = (avg_rating * 0.40) + (experience_score * 0.35) + (proximity_score * 0.25)

#   avg_rating       : provider's average star rating (out of 5)
#   experience_score : min(years_experience / 10, 1.0) * 5   → normalized to 5
#   proximity_score  : 5.0 if same city else 0.0

#   Final score range: 0.0 – 5.0
# """


# def calculate_score(provider: dict, customer_city: str) -> float:
#     """
#     Calculate recommendation score for a single provider.

#     Args:
#         provider     : dict with keys: avg_rating, years_experience, city
#         customer_city: city string of the customer making the request

#     Returns:
#         float score rounded to 2 decimal places (0.00 – 5.00)
#     """
#     # ── Component 1: Rating Score (weight 40%) ──────────────
#     avg_rating = float(provider.get("avg_rating", 0.0))
#     avg_rating = max(0.0, min(avg_rating, 5.0))   # clamp to [0, 5]
#     rating_score = avg_rating                      # already out of 5

#     # ── Component 2: Experience Score (weight 35%) ──────────
#     years_exp = float(provider.get("years_experience", 0))
#     years_exp = max(0.0, years_exp)
#     exp_normalized = min(years_exp / 10.0, 1.0)   # cap at 10 years → 1.0
#     experience_score = exp_normalized * 5.0        # normalize to 5

#     # ── Component 3: Proximity Score (weight 25%) ───────────
#     provider_city = str(provider.get("city", "")).strip().lower()
#     cust_city     = str(customer_city).strip().lower()
#     proximity_score = 5.0 if provider_city == cust_city else 0.0

#     # ── Weighted Final Score ─────────────────────────────────
#     final_score = (
#         (rating_score    * 0.40) +
#         (experience_score * 0.35) +
#         (proximity_score  * 0.25)
#     )

#     return round(final_score, 2)


# def rank_providers(providers: list, customer_city: str) -> list:
#     """
#     Score and rank all providers in descending order of recommendation score.

#     Args:
#         providers    : list of provider dicts from Spring Boot
#         customer_city: city of the customer

#     Returns:
#         List of dicts with id, name, recommendation_score, is_top_pick
#         sorted by recommendation_score DESC
#     """
#     if not providers:
#         return []

#     scored = []
#     for provider in providers:
#         score = calculate_score(provider, customer_city)
#         scored.append({
#             "id":                   provider.get("id"),
#             "name":                 provider.get("name", ""),
#             "recommendation_score": score,
#             "is_top_pick":          False,   # will be set after sorting
#         })

#     # Sort descending by score
#     scored.sort(key=lambda x: x["recommendation_score"], reverse=True)

#     # Mark the top-ranked provider as is_top_pick
#     if scored:
#         scored[0]["is_top_pick"] = True

#     return scored


# # ── Quick unit test when run directly ───────────────────────
# if __name__ == "__main__":
#     sample_providers = [
#         {"id": 1, "name": "Ravi Kumar",   "city": "Bangalore", "avg_rating": 4.5, "years_experience": 8},
#         {"id": 2, "name": "Suresh Babu",  "city": "Mysore",    "avg_rating": 4.8, "years_experience": 12},
#         {"id": 3, "name": "Anand Reddy",  "city": "Bangalore", "avg_rating": 3.9, "years_experience": 3},
#         {"id": 4, "name": "Deepak Singh", "city": "Bangalore", "avg_rating": 4.2, "years_experience": 6},
#         {"id": 5, "name": "Mohan Das",    "city": "Hubli",     "avg_rating": 4.7, "years_experience": 15},
#     ]

#     ranked = rank_providers(sample_providers, customer_city="Bangalore")
#     print("\n=== QuickServe Scorer Test ===")
#     print(f"{'Rank':<6}{'Name':<18}{'City':<14}{'Rating':<10}{'Exp':<6}{'Score':<8}{'Top Pick'}")
#     print("-" * 70)
#     for i, p in enumerate(ranked, 1):
#         provider = next(x for x in sample_providers if x["id"] == p["id"])
#         print(
#             f"{i:<6}{p['name']:<18}{provider['city']:<14}"
#             f"{provider['avg_rating']:<10}{provider['years_experience']:<6}"
#             f"{p['recommendation_score']:<8}{'✅' if p['is_top_pick'] else ''}"
#         )







# ============================================================
# FILE: scorer.py  (FULL REPLACEMENT)
#version1 for price estimator...
# All existing code preserved exactly.
# estimate_price() function added at the bottom.
# ============================================================

# """
# QuickServe AI Provider Scoring Engine
# --------------------------------------
# Scoring Formula:
#   score = (avg_rating * 0.40) + (experience_score * 0.35) + (proximity_score * 0.25)

#   avg_rating       : provider's average star rating (out of 5)
#   experience_score : min(years_experience / 10, 1.0) * 5   → normalized to 5
#   proximity_score  : 5.0 if same city else 0.0

#   Final score range: 0.0 – 5.0
# """


# def calculate_score(provider: dict, customer_city: str) -> float:
#     """
#     Calculate recommendation score for a single provider.
#     (Unchanged from original)
#     """
#     avg_rating = float(provider.get("avg_rating", 0.0))
#     avg_rating = max(0.0, min(avg_rating, 5.0))
#     rating_score = avg_rating

#     years_exp = float(provider.get("years_experience", 0))
#     years_exp = max(0.0, years_exp)
#     exp_normalized = min(years_exp / 10.0, 1.0)
#     experience_score = exp_normalized * 5.0

#     provider_city = str(provider.get("city", "")).strip().lower()
#     cust_city     = str(customer_city).strip().lower()
#     proximity_score = 5.0 if provider_city == cust_city else 0.0

#     final_score = (
#         (rating_score     * 0.40) +
#         (experience_score * 0.35) +
#         (proximity_score  * 0.25)
#     )
#     return round(final_score, 2)


# def rank_providers(providers: list, customer_city: str) -> list:
#     """
#     Score and rank all providers in descending order of recommendation score.
#     (Unchanged from original)
#     """
#     if not providers:
#         return []

#     scored = []
#     for provider in providers:
#         score = calculate_score(provider, customer_city)
#         scored.append({
#             "id":                   provider.get("id"),
#             "name":                 provider.get("name", ""),
#             "recommendation_score": score,
#             "is_top_pick":          False,
#         })

#     scored.sort(key=lambda x: x["recommendation_score"], reverse=True)

#     if scored:
#         scored[0]["is_top_pick"] = True

#     return scored


# # ── Quick unit test for ranking (unchanged) ──────────────────
# if __name__ == "__main__":
#     sample_providers = [
#         {"id": 1, "name": "Ravi Kumar",   "city": "Bangalore", "avg_rating": 4.5, "years_experience": 8},
#         {"id": 2, "name": "Suresh Babu",  "city": "Mysore",    "avg_rating": 4.8, "years_experience": 12},
#         {"id": 3, "name": "Anand Reddy",  "city": "Bangalore", "avg_rating": 3.9, "years_experience": 3},
#         {"id": 4, "name": "Deepak Singh", "city": "Bangalore", "avg_rating": 4.2, "years_experience": 6},
#         {"id": 5, "name": "Mohan Das",    "city": "Hubli",     "avg_rating": 4.7, "years_experience": 15},
#     ]
#     ranked = rank_providers(sample_providers, customer_city="Bangalore")
#     print("\n=== QuickServe Scorer Test ===")
#     print(f"{'Rank':<6}{'Name':<18}{'City':<14}{'Rating':<10}{'Exp':<6}{'Score':<8}{'Top Pick'}")
#     print("-" * 70)
#     for i, p in enumerate(ranked, 1):
#         provider = next(x for x in sample_providers if x["id"] == p["id"])
#         print(
#             f"{i:<6}{p['name']:<18}{provider['city']:<14}"
#             f"{provider['avg_rating']:<10}{provider['years_experience']:<6}"
#             f"{p['recommendation_score']:<8}{'✅' if p['is_top_pick'] else ''}"
#         )


# # ════════════════════════════════════════════════════════════
# # NEW FUNCTION: estimate_price()
# # Smart Price Estimator — keyword-based severity detection
# # ════════════════════════════════════════════════════════════

# # ── Base prices per service (INR) ────────────────────────────
# # Must stay in sync with SERVICES constant in constants.js
# BASE_PRICES = {
#     "plumber":          499,
#     "electrician":      399,
#     "carpenter":        599,
#     "ac repair":        699,
#     "house cleaning":   799,
#     "painting":        1499,
#     "pest control":     999,
#     "appliance repair": 499,
#     "water purifier":   349,
#     "salon service":    599,
# }

# # ── Severity keyword dictionary ───────────────────────────────
# # Each severity level has a list of trigger words and a price multiplier.
# # Matching is done against the lowercased problem description.
# # The highest matching severity wins.
# SEVERITY_LEVELS = [
#     {
#         "level":      "Emergency",
#         "multiplier": 2.0,
#         "color":      "red",
#         "keywords": [
#             "emergency", "urgent", "immediately", "right now", "asap",
#             "gas leak", "gas leaking", "electric fire", "short circuit fire",
#             "flooding", "flood", "sewage overflow", "no power entire",
#             "dangerous", "critical", "smoke", "sparks flying",
#         ],
#     },
#     {
#         "level":      "Major",
#         "multiplier": 1.5,
#         "color":      "orange",
#         "keywords": [
#             "burst", "pipe burst", "completely broken", "not working at all",
#             "total failure", "blown", "shattered", "collapsed",
#             "major leak", "heavy leak", "water everywhere",
#             "no electricity", "complete breakdown", "stopped working",
#             "overflowing", "rats", "termite infestation", "heavily infested",
#             "mold", "mould", "black mold",
#         ],
#     },
#     {
#         "level":      "Standard",
#         "multiplier": 1.0,
#         "color":      "blue",
#         "keywords": [
#             "broken", "not working", "repair", "replace", "fix",
#             "damaged", "faulty", "malfunction", "issue", "problem",
#             "leak", "leaking", "dripping", "clogged", "blocked",
#             "worn out", "needs service", "stopped", "dead", "tripping",
#         ],
#     },
#     {
#         "level":      "Minor",
#         "multiplier": 0.8,
#         "color":      "green",
#         "keywords": [
#             "small", "minor", "tiny", "little", "slight",
#             "drip", "slow drain", "loose", "wobbly", "noise",
#             "squeaking", "flickering", "dim", "low pressure",
#             "just checking", "inspection", "check", "routine",
#             "servicing", "maintenance", "cleaning",
#         ],
#     },
# ]


# def estimate_price(service: str, description: str) -> dict:
#     """
#     Estimate price range for a service based on problem description.

#     Args:
#         service     : service name string (e.g. "Plumber", "AC Repair")
#         description : customer's problem description text

#     Returns:
#         dict with keys:
#             base_price     : int   — standard base price for this service
#             min_price      : int   — lower end of estimate
#             max_price      : int   — upper end of estimate
#             severity       : str   — "Minor" | "Standard" | "Major" | "Emergency"
#             severity_color : str   — "green" | "blue" | "orange" | "red"
#             multiplier     : float — price multiplier applied
#             matched_keywords : list[str] — which keywords triggered severity
#             reason         : str   — human-readable explanation
#             estimated_time : str   — rough time estimate for the job
#     """

#     # ── Normalise inputs ─────────────────────────────────────
#     service_key = service.strip().lower()
#     desc_lower  = description.strip().lower()

#     # ── Look up base price ───────────────────────────────────
#     base_price = BASE_PRICES.get(service_key, 499)  # fallback to ₹499

#     # ── Detect severity by scanning description ──────────────
#     detected_severity = None
#     matched_keywords  = []

#     # Check from highest severity downward — first match wins
#     for severity in SEVERITY_LEVELS:
#         hits = [kw for kw in severity["keywords"] if kw in desc_lower]
#         if hits:
#             detected_severity = severity
#             matched_keywords  = hits
#             break   # stop at highest matching severity

#     # Default to Standard if nothing matches
#     if detected_severity is None:
#         detected_severity = SEVERITY_LEVELS[2]   # Standard
#         matched_keywords  = []

#     # ── Calculate price range ────────────────────────────────
#     multiplier = detected_severity["multiplier"]
#     mid_price  = base_price * multiplier

#     # Range band: ±20% of the multiplied price, rounded to nearest 50
#     band       = base_price * 0.20
#     min_price  = int(round((mid_price - band) / 50.0) * 50)
#     max_price  = int(round((mid_price + band) / 50.0) * 50)

#     # Floor: never go below ₹99
#     min_price  = max(min_price, 99)

#     # ── Time estimate by severity ────────────────────────────
#     time_map = {
#         "Minor":     "30 min – 1 hour",
#         "Standard":  "1 – 2 hours",
#         "Major":     "2 – 4 hours",
#         "Emergency": "Immediate response — 1 – 3 hours",
#     }
#     estimated_time = time_map[detected_severity["level"]]

#     # ── Human-readable reason ────────────────────────────────
#     if matched_keywords:
#         kw_display = ", ".join(f'"{kw}"' for kw in matched_keywords[:3])
#         reason = (
#             f"{detected_severity['level']} issue detected based on keywords: "
#             f"{kw_display}. Price adjusted accordingly."
#         )
#     else:
#         reason = (
#             "Standard estimate applied. Add more details about the problem "
#             "for a more accurate price range."
#         )

#     return {
#         "base_price":       base_price,
#         "min_price":        min_price,
#         "max_price":        max_price,
#         "severity":         detected_severity["level"],
#         "severity_color":   detected_severity["color"],
#         "multiplier":       multiplier,
#         "matched_keywords": matched_keywords,
#         "reason":           reason,
#         "estimated_time":   estimated_time,
#     }


# # ── Unit test for estimate_price() ───────────────────────────
# if __name__ == "__main__":
#     test_cases = [
#         ("Plumber",    "There is a small drip under the kitchen sink"),
#         ("Plumber",    "Pipe burst in the bathroom, water flooding everywhere"),
#         ("Electrician","The lights are flickering in the bedroom"),
#         ("Electrician","Major short circuit, sparks flying from switchboard"),
#         ("AC Repair",  "AC is not working at all, total breakdown"),
#         ("Plumber",    "Gas leak emergency, smell is very strong"),
#         ("House Cleaning", "Routine cleaning needed"),
#     ]

#     print("\n=== QuickServe Price Estimator Test ===")
#     for service, desc in test_cases:
#         result = estimate_price(service, desc)
#         print(
#             f"\n  Service   : {service}"
#             f"\n  Problem   : {desc}"
#             f"\n  Severity  : {result['severity']} (x{result['multiplier']})"
#             f"\n  Range     : ₹{result['min_price']} – ₹{result['max_price']}"
#             f"\n  Keywords  : {result['matched_keywords']}"
#             f"\n  Time      : {result['estimated_time']}"
#         )
#         print("  " + "-" * 50)





# # ============================================================
# # FILE: scorer.py  (FULL REPLACEMENT)
# # ============================================================

# """
# QuickServe AI Provider Scoring + Price Estimation Engine
# ---------------------------------------------------------
# Scoring Formula:
#   score = (avg_rating * 0.40) + (experience_score * 0.35) + (proximity_score * 0.25)

# Price Estimation:
#   Keyword-based severity detection on problem description
#   Returns min/max price range + severity level + matched keywords
# """


# # ════════════════════════════════════════════════════════════
# # SECTION 1 — Provider Recommendation Scoring (unchanged)
# # ════════════════════════════════════════════════════════════

# def calculate_score(provider: dict, customer_city: str) -> float:
#     """
#     Calculate recommendation score for a single provider.

#     Args:
#         provider     : dict with keys: avg_rating, years_experience, city
#         customer_city: city string of the customer making the request

#     Returns:
#         float score rounded to 2 decimal places (0.00 – 5.00)
#     """
#     # Component 1: Rating Score (weight 40%)
#     avg_rating = float(provider.get("avg_rating", 0.0))
#     avg_rating = max(0.0, min(avg_rating, 5.0))
#     rating_score = avg_rating

#     # Component 2: Experience Score (weight 35%)
#     years_exp = float(provider.get("years_experience", 0))
#     years_exp = max(0.0, years_exp)
#     exp_normalized   = min(years_exp / 10.0, 1.0)
#     experience_score = exp_normalized * 5.0

#     # Component 3: Proximity Score (weight 25%)
#     provider_city   = str(provider.get("city", "")).strip().lower()
#     cust_city       = str(customer_city).strip().lower()
#     proximity_score = 5.0 if provider_city == cust_city else 0.0

#     # Weighted Final Score
#     final_score = (
#         (rating_score     * 0.40) +
#         (experience_score * 0.35) +
#         (proximity_score  * 0.25)
#     )
#     return round(final_score, 2)


# def rank_providers(providers: list, customer_city: str) -> list:
#     """
#     Score and rank all providers in descending order of recommendation score.

#     Args:
#         providers    : list of provider dicts from Spring Boot
#         customer_city: city of the customer

#     Returns:
#         List of dicts with id, name, recommendation_score, is_top_pick
#         sorted by recommendation_score DESC
#     """
#     if not providers:
#         return []

#     scored = []
#     for provider in providers:
#         score = calculate_score(provider, customer_city)
#         scored.append({
#             "id":                   provider.get("id"),
#             "name":                 provider.get("name", ""),
#             "recommendation_score": score,
#             "is_top_pick":          False,
#         })

#     scored.sort(key=lambda x: x["recommendation_score"], reverse=True)

#     if scored:
#         scored[0]["is_top_pick"] = True

#     return scored


# # ════════════════════════════════════════════════════════════
# # SECTION 2 — Smart Price Estimator (NEW)
# # ════════════════════════════════════════════════════════════

# # Base prices per service in INR — must match constants.js SERVICES array
# BASE_PRICES = {
#     "plumber":          499,
#     "electrician":      399,
#     "carpenter":        599,
#     "ac repair":        699,
#     "house cleaning":   799,
#     "painting":        1499,
#     "pest control":     999,
#     "appliance repair": 499,
#     "water purifier":   349,
#     "salon service":    599,
# }

# # Severity levels from highest to lowest priority.
# # The first level whose keywords match the description wins.
# # multiplier: applied to base_price to calculate the price range midpoint.
# SEVERITY_LEVELS = [
#     {
#         "level":      "Emergency",
#         "multiplier": 2.0,
#         "color":      "red",
#         "time":       "Immediate — 1 to 3 hours",
#         "keywords": [
#             "emergency", "urgent", "immediately", "right now", "asap",
#             "gas leak", "gas leaking", "gas smell",
#             "electric fire", "electrical fire",
#             "short circuit fire", "sparks flying",
#             "flooding", "flood", "water everywhere",
#             "sewage overflow", "sewage spill",
#             "no power entire building", "entire house no power",
#             "dangerous", "critical situation", "smoke coming",
#             "fire risk", "explosion risk",
#         ],
#     },
#     {
#         "level":      "Major",
#         "multiplier": 1.5,
#         "color":      "orange",
#         "time":       "2 to 4 hours",
#         "keywords": [
#             "burst", "pipe burst", "main pipe",
#             "completely broken", "not working at all", "stopped completely",
#             "total failure", "complete breakdown", "blown fuse",
#             "shattered", "collapsed",
#             "heavy leak", "major leak", "water damage",
#             "no electricity", "no power", "power outage",
#             "overflowing", "sewage blocked",
#             "rats", "rodents", "heavy infestation",
#             "termite infestation", "termite damage",
#             "heavy mold", "mould spread", "black mold",
#             "compressor failure", "ac compressor dead",
#             "washing machine dead", "fridge not cooling",
#         ],
#     },
#     {
#         "level":      "Standard",
#         "multiplier": 1.0,
#         "color":      "blue",
#         "time":       "1 to 2 hours",
#         "keywords": [
#             "broken", "not working", "repair", "replace", "fix",
#             "damaged", "faulty", "malfunction",
#             "issue", "problem", "fault",
#             "leak", "leaking",
#             "clogged", "blocked", "choked",
#             "worn out", "needs repair", "needs replacement",
#             "stopped", "dead", "not functioning",
#             "tripping", "mcb tripping",
#             "infestation", "cockroach", "ants",
#             "door stuck", "window broken", "cabinet broken",
#             "motor not working", "pump not working",
#         ],
#     },
#     {
#         "level":      "Minor",
#         "multiplier": 0.8,
#         "color":      "green",
#         "time":       "30 minutes to 1 hour",
#         "keywords": [
#             "small", "minor", "tiny", "little", "slight",
#             "drip", "dripping", "slow drain",
#             "loose", "wobbly", "wobbling",
#             "noise", "sound", "squeaking", "rattling",
#             "flickering", "dim light", "low pressure",
#             "just checking", "inspection needed",
#             "routine", "regular service", "annual service",
#             "check", "checkup", "maintenance",
#             "cleaning needed", "filter change",
#             "touch up", "minor repair",
#         ],
#     },
# ]


# def estimate_price(service: str, description: str) -> dict:
#     """
#     Estimate price range for a service based on the customer's
#     problem description using keyword severity detection.

#     Args:
#         service     : service name string  e.g. "Plumber", "AC Repair"
#         description : customer's free-text problem description

#     Returns:
#         dict containing:
#             base_price       (int)   standard price for this service
#             min_price        (int)   lower end of estimate
#             max_price        (int)   upper end of estimate
#             severity         (str)   Minor | Standard | Major | Emergency
#             severity_color   (str)   green | blue | orange | red
#             multiplier       (float) price multiplier applied
#             matched_keywords (list)  keywords that triggered the severity
#             reason           (str)   human-readable explanation shown to customer
#             estimated_time   (str)   rough time estimate for the job
#     """

#     # Normalise inputs for comparison
#     service_key = service.strip().lower()
#     desc_lower  = description.strip().lower()

#     # Look up base price — fall back to 499 for unknown services
#     base_price = BASE_PRICES.get(service_key, 499)

#     # Scan severity levels from highest downward — first match wins
#     detected   = None
#     matched_kw = []

#     for level in SEVERITY_LEVELS:
#         hits = [kw for kw in level["keywords"] if kw in desc_lower]
#         if hits:
#             detected   = level
#             matched_kw = hits[:5]   # cap at 5 displayed keywords
#             break

#     # No keywords matched — default to Standard
#     if detected is None:
#         detected   = SEVERITY_LEVELS[2]    # Standard
#         matched_kw = []

#     multiplier = detected["multiplier"]

#     # Calculate midpoint price after applying multiplier
#     mid = base_price * multiplier

#     # Add a ±20% band around the midpoint, rounded to nearest ₹50
#     band      = base_price * 0.20
#     min_price = int(round((mid - band) / 50.0) * 50)
#     max_price = int(round((mid + band) / 50.0) * 50)

#     # Never go below ₹99 on the low end
#     min_price = max(min_price, 99)

#     # Build the reason string shown below the estimate card
#     if matched_kw:
#         kw_display = ", ".join(f'"{kw}"' for kw in matched_kw[:3])
#         reason = (
#             f"{detected['level']} issue detected — keywords found: {kw_display}. "
#             f"Price range adjusted to reflect the complexity of your problem."
#         )
#     else:
#         reason = (
#             "Standard estimate applied. Describe the problem in more detail "
#             "for a more accurate price range."
#         )

#     return {
#         "base_price":       base_price,
#         "min_price":        min_price,
#         "max_price":        max_price,
#         "severity":         detected["level"],
#         "severity_color":   detected["color"],
#         "multiplier":       multiplier,
#         "matched_keywords": matched_kw,
#         "reason":           reason,
#         "estimated_time":   detected["time"],
#     }


# # ── Self-test: run  python scorer.py  to verify both functions ──
# if __name__ == "__main__":

#     # --- Ranking test (original) ---
#     sample_providers = [
#         {"id": 1, "name": "Ravi Kumar",   "city": "Bangalore", "avg_rating": 4.5, "years_experience": 8},
#         {"id": 2, "name": "Suresh Babu",  "city": "Mysore",    "avg_rating": 4.8, "years_experience": 12},
#         {"id": 3, "name": "Anand Reddy",  "city": "Bangalore", "avg_rating": 3.9, "years_experience": 3},
#         {"id": 4, "name": "Deepak Singh", "city": "Bangalore", "avg_rating": 4.2, "years_experience": 6},
#         {"id": 5, "name": "Mohan Das",    "city": "Hubli",     "avg_rating": 4.7, "years_experience": 15},
#     ]
#     ranked = rank_providers(sample_providers, customer_city="Bangalore")
#     print("\n=== Provider Ranking Test ===")
#     print(f"{'Rank':<6}{'Name':<18}{'City':<14}{'Rating':<10}{'Exp':<6}{'Score':<8}{'Top'}")
#     print("-" * 68)
#     for i, p in enumerate(ranked, 1):
#         src = next(x for x in sample_providers if x["id"] == p["id"])
#         print(
#             f"{i:<6}{p['name']:<18}{src['city']:<14}"
#             f"{src['avg_rating']:<10}{src['years_experience']:<6}"
#             f"{p['recommendation_score']:<8}{'✅' if p['is_top_pick'] else ''}"
#         )

#     # --- Price estimator test ---
#     print("\n=== Price Estimator Test ===")
#     test_cases = [
#         ("Plumber",       "There is a small drip under the kitchen sink"),
#         ("Plumber",       "Pipe burst in bathroom, water flooding everywhere"),
#         ("Electrician",   "Lights flickering in bedroom, minor issue"),
#         ("Electrician",   "Short circuit fire risk, sparks from switchboard"),
#         ("AC Repair",     "AC not working at all, total breakdown"),
#         ("Plumber",       "Gas leak emergency, smell is very strong, urgent"),
#         ("House Cleaning","Routine annual cleaning and maintenance"),
#         ("Pest Control",  "Heavy termite infestation, spreading to walls"),
#     ]
#     print(f"\n{'Service':<18}{'Severity':<12}{'Range':<22}{'Time'}")
#     print("-" * 72)
#     for service, desc in test_cases:
#         r = estimate_price(service, desc)
#         price_range = f"Rs.{r['min_price']} - Rs.{r['max_price']}"
#         print(f"{service:<18}{r['severity']:<12}{price_range:<22}{r['estimated_time']}")
#         if r["matched_keywords"]:
#             print(f"  Keywords: {r['matched_keywords']}")



'''
# ============================================================
# FILE: scorer.py  (FULL REPLACEMENT)
# All existing code preserved exactly.
# forecast_earnings() added at the bottom.
# ============================================================

"""
QuickServe AI Provider Scoring + Earnings Forecast Engine
----------------------------------------------------------
Scoring Formula:
  score = (avg_rating * 0.40) + (experience_score * 0.35) + (proximity_score * 0.25)

Forecast:
  Simple linear regression using numpy on last N months of earnings.
  Returns predicted next-month earnings with confidence band.
"""

import numpy as np


# ════════════════════════════════════════════════════════════
# SECTION 1 — Provider Recommendation Scoring (unchanged)
# ════════════════════════════════════════════════════════════

def calculate_score(provider: dict, customer_city: str) -> float:
    """
    Calculate recommendation score for a single provider.
    """
    avg_rating = float(provider.get("avg_rating", 0.0))
    avg_rating = max(0.0, min(avg_rating, 5.0))
    rating_score = avg_rating

    years_exp = float(provider.get("years_experience", 0))
    years_exp = max(0.0, years_exp)
    exp_normalized   = min(years_exp / 10.0, 1.0)
    experience_score = exp_normalized * 5.0

    provider_city   = str(provider.get("city", "")).strip().lower()
    cust_city       = str(customer_city).strip().lower()
    proximity_score = 5.0 if provider_city == cust_city else 0.0

    final_score = (
        (rating_score     * 0.40) +
        (experience_score * 0.35) +
        (proximity_score  * 0.25)
    )
    return round(final_score, 2)


def rank_providers(providers: list, customer_city: str) -> list:
    """
    Score and rank all providers in descending order.
    """
    if not providers:
        return []

    scored = []
    for provider in providers:
        score = calculate_score(provider, customer_city)
        scored.append({
            "id":                   provider.get("id"),
            "name":                 provider.get("name", ""),
            "recommendation_score": score,
            "is_top_pick":          False,
        })

    scored.sort(key=lambda x: x["recommendation_score"], reverse=True)

    if scored:
        scored[0]["is_top_pick"] = True

    return scored


# ── Unit test for ranking (unchanged) ────────────────────────
if __name__ == "__main__":
    sample_providers = [
        {"id": 1, "name": "Ravi Kumar",   "city": "Bangalore",
         "avg_rating": 4.5, "years_experience": 8},
        {"id": 2, "name": "Suresh Babu",  "city": "Mysore",
         "avg_rating": 4.8, "years_experience": 12},
        {"id": 3, "name": "Anand Reddy",  "city": "Bangalore",
         "avg_rating": 3.9, "years_experience": 3},
        {"id": 4, "name": "Deepak Singh", "city": "Bangalore",
         "avg_rating": 4.2, "years_experience": 6},
        {"id": 5, "name": "Mohan Das",    "city": "Hubli",
         "avg_rating": 4.7, "years_experience": 15},
    ]
    ranked = rank_providers(sample_providers, customer_city="Bangalore")
    print("\n=== Provider Ranking Test ===")
    print(f"{'Rank':<6}{'Name':<18}{'City':<14}"
          f"{'Rating':<10}{'Exp':<6}{'Score':<8}{'Top'}")
    print("-" * 68)
    for i, p in enumerate(ranked, 1):
        src = next(x for x in sample_providers if x["id"] == p["id"])
        print(
            f"{i:<6}{p['name']:<18}{src['city']:<14}"
            f"{src['avg_rating']:<10}{src['years_experience']:<6}"
            f"{p['recommendation_score']:<8}{'✅' if p['is_top_pick'] else ''}"
        )


# ════════════════════════════════════════════════════════════
# SECTION 2 — Earnings Forecast  (NEW)
# ════════════════════════════════════════════════════════════

def forecast_earnings(monthly_data: list) -> dict:
    """
    Predict next month's earnings using simple linear regression.

    Args:
        monthly_data : list of dicts  [{"month": "Jan", "amount": 4200}, ...]
                       Must have at least 3 items.
                       Items must be in chronological order (oldest first).

    Returns:
        dict with:
            predicted_amount    (float)  predicted earnings for next month
            min_estimate        (float)  lower confidence band
            max_estimate        (float)  upper confidence band
            trend               (str)    "UP" | "DOWN" | "STABLE"
            trend_percentage    (float)  % change from last actual to predicted
            slope               (float)  raw regression slope (INR per month)
            r_squared           (float)  model fit quality  0.0–1.0
            insight             (str)    human-readable message shown in UI
            months_used         (int)    how many months fed into the model
    """

    # ── Need at least 3 data points for meaningful regression ──
    if not monthly_data or len(monthly_data) < 3:
        return {
            "error":   "Need at least 3 months of earnings data for a forecast.",
            "months_used": len(monthly_data) if monthly_data else 0,
        }

    # ── Extract amounts in order ──────────────────────────────
    amounts = []
    for item in monthly_data:
        try:
            amounts.append(float(item.get("amount", 0) or 0))
        except (TypeError, ValueError):
            amounts.append(0.0)

    n = len(amounts)

    # ── Build x (month index 0, 1, 2 … n-1) and y (earnings) ─
    x = np.arange(n, dtype=float)
    y = np.array(amounts, dtype=float)

    # ── Linear regression: y = slope * x + intercept ─────────
    # np.polyfit returns [slope, intercept]
    coeffs    = np.polyfit(x, y, 1)
    slope     = float(coeffs[0])
    intercept = float(coeffs[1])

    # ── Predict for month index n (next month) ────────────────
    predicted_raw = slope * n + intercept

    # Floor at 0 — earnings can't be negative
    predicted = max(0.0, predicted_raw)

    # ── Confidence band: ±1 standard deviation of residuals ──
    y_pred    = slope * x + intercept
    residuals = y - y_pred
    std_dev   = float(np.std(residuals))

    min_est = max(0.0, predicted - std_dev)
    max_est = predicted + std_dev

    # ── R-squared: how well the line fits ─────────────────────
    ss_res  = float(np.sum(residuals ** 2))
    ss_tot  = float(np.sum((y - np.mean(y)) ** 2))
    r2      = 1.0 - (ss_res / ss_tot) if ss_tot > 0 else 0.0
    r2      = max(0.0, min(1.0, r2))    # clamp to [0, 1]

    # ── Trend classification ──────────────────────────────────
    last_actual = amounts[-1]

    if last_actual > 0:
        pct_change = ((predicted - last_actual) / last_actual) * 100.0
    else:
        pct_change = 0.0

    if pct_change > 5.0:
        trend = "UP"
    elif pct_change < -5.0:
        trend = "DOWN"
    else:
        trend = "STABLE"

    # ── Human-readable insight shown in the UI card ───────────
    predicted_fmt  = f"₹{int(round(predicted)):,}"
    last_fmt       = f"₹{int(round(last_actual)):,}"
    pct_fmt        = f"{abs(pct_change):.1f}%"

    if trend == "UP":
        insight = (
            f"Your earnings are trending upward. "
            f"Forecast for next month: {predicted_fmt} "
            f"(+{pct_fmt} vs this month's {last_fmt}). "
            f"Keep accepting jobs to maintain this growth."
        )
    elif trend == "DOWN":
        insight = (
            f"Your earnings have been declining. "
            f"Forecast for next month: {predicted_fmt} "
            f"(-{pct_fmt} vs this month's {last_fmt}). "
            f"Consider adding more availability slots to attract more bookings."
        )
    else:
        insight = (
            f"Your earnings are stable. "
            f"Forecast for next month: {predicted_fmt} "
            f"(close to this month's {last_fmt}). "
            f"Consistent performance — great work!"
        )

    return {
        "predicted_amount": round(predicted, 2),
        "min_estimate":     round(min_est, 2),
        "max_estimate":     round(max_est, 2),
        "trend":            trend,
        "trend_percentage": round(pct_change, 1),
        "slope":            round(slope, 2),
        "r_squared":        round(r2, 3),
        "insight":          insight,
        "months_used":      n,
    }


# ── Self-test for forecast ────────────────────────────────────
if __name__ == "__main__":
    print("\n=== Earnings Forecast Test ===")

    test_cases = [
        {
            "label": "Upward trend",
            "data": [
                {"month": "Jul", "amount": 3200},
                {"month": "Aug", "amount": 3800},
                {"month": "Sep", "amount": 4100},
                {"month": "Oct", "amount": 4700},
                {"month": "Nov", "amount": 5200},
                {"month": "Dec", "amount": 5800},
            ],
        },
        {
            "label": "Downward trend",
            "data": [
                {"month": "Jul", "amount": 6000},
                {"month": "Aug", "amount": 5500},
                {"month": "Sep", "amount": 4800},
                {"month": "Oct", "amount": 4200},
                {"month": "Nov", "amount": 3900},
                {"month": "Dec", "amount": 3400},
            ],
        },
        {
            "label": "Stable trend",
            "data": [
                {"month": "Jul", "amount": 4500},
                {"month": "Aug", "amount": 4600},
                {"month": "Sep", "amount": 4400},
                {"month": "Oct", "amount": 4550},
                {"month": "Nov", "amount": 4480},
                {"month": "Dec", "amount": 4520},
            ],
        },
        {
            "label": "Too few months",
            "data": [
                {"month": "Nov", "amount": 3000},
                {"month": "Dec", "amount": 3500},
            ],
        },
    ]

    for case in test_cases:
        result = forecast_earnings(case["data"])
        print(f"\n  {case['label']}")
        if "error" in result:
            print(f"  Error: {result['error']}")
        else:
            print(f"  Trend      : {result['trend']} ({result['trend_percentage']:+.1f}%)")
            print(f"  Predicted  : ₹{result['predicted_amount']:,.0f}")
            print(f"  Range      : ₹{result['min_estimate']:,.0f} – "
                  f"₹{result['max_estimate']:,.0f}")
            print(f"  R²         : {result['r_squared']:.3f}")
            print(f"  Insight    : {result['insight'][:80]}…")


            '''


#new with updated one


# ============================================================
# FILE: scorer.py  (FULL REPLACEMENT)
# Fixes all 3 problems:
# 1. estimate_price() and all data restored
# 2. forecast_earnings() works with minimum 2 months
# 3. calculate_score() now includes completed_jobs component
# ============================================================

"""
QuickServe AI Provider Scoring + Price Estimation + Earnings Forecast
----------------------------------------------------------------------
Scoring Formula (UPDATED — 4 components):
  score = (rating * 0.35) + (experience * 0.25) + (proximity * 0.25) + (jobs * 0.15)

  rating_score     : provider avg_rating (0–5)
  experience_score : min(years / 10, 1.0) * 5  → normalised to 5
  proximity_score  : 5.0 if same city else 0.0
  jobs_score       : min(completed_jobs / 50, 1.0) * 5  → normalised to 5
                     (caps at 50 jobs — beyond that, max score)

  Final score range: 0.0 – 5.0
"""

import numpy as np


# ════════════════════════════════════════════════════════════
# SECTION 1 — Provider Recommendation Scoring (UPDATED)
# ════════════════════════════════════════════════════════════

def calculate_score(provider: dict, customer_city: str) -> float:
    """
    Calculate recommendation score for a single provider.
    Now includes completed_jobs as a 4th component.

    Args:
        provider      : dict with keys: avg_rating, years_experience,
                        city, completed_jobs
        customer_city : city string of the customer

    Returns:
        float score rounded to 2 decimal places (0.00 – 5.00)
    """
    # ── Component 1: Rating Score (weight 35%) ──────────────
    avg_rating   = float(provider.get("avg_rating", 0.0))
    avg_rating   = max(0.0, min(avg_rating, 5.0))
    rating_score = avg_rating                       # already out of 5

    # ── Component 2: Experience Score (weight 25%) ──────────
    years_exp        = float(provider.get("years_experience", 0))
    years_exp        = max(0.0, years_exp)
    exp_normalized   = min(years_exp / 10.0, 1.0)  # cap at 10 years
    experience_score = exp_normalized * 5.0

    # ── Component 3: Proximity Score (weight 25%) ───────────
    provider_city   = str(provider.get("city", "")).strip().lower()
    cust_city       = str(customer_city).strip().lower()
    proximity_score = 5.0 if provider_city == cust_city else 0.0

    # ── Component 4: Completed Jobs Score (weight 15%) ──────
    # Rewards providers with a proven real-world track record.
    # Caps at 50 completed jobs → full score. 0 jobs → 0 score.
    completed_jobs  = float(provider.get("completed_jobs", 0))
    completed_jobs  = max(0.0, completed_jobs)
    jobs_normalized = min(completed_jobs / 50.0, 1.0)
    jobs_score      = jobs_normalized * 5.0

    # ── Weighted Final Score ─────────────────────────────────
    final_score = (
        (rating_score     * 0.35) +
        (experience_score * 0.25) +
        (proximity_score  * 0.25) +
        (jobs_score       * 0.15)
    )

    return round(final_score, 2)


def rank_providers(providers: list, customer_city: str) -> list:
    """
    Score and rank all providers in descending order.
    """
    if not providers:
        return []

    scored = []
    for provider in providers:
        score = calculate_score(provider, customer_city)
        scored.append({
            "id":                   provider.get("id"),
            "name":                 provider.get("name", ""),
            "recommendation_score": score,
            "is_top_pick":          False,
        })

    scored.sort(key=lambda x: x["recommendation_score"], reverse=True)

    if scored:
        scored[0]["is_top_pick"] = True

    return scored


# ── Self test for ranking ────────────────────────────────────
if __name__ == "__main__":
    # Your exact scenario from Problem 3
    test_providers = [
        {"id": 1, "name": "Provider1", "city": "Bangalore",
         "avg_rating": 3.4, "years_experience": 2,  "completed_jobs": 9},
        {"id": 2, "name": "Provider2", "city": "Bangalore",
         "avg_rating": 3.5, "years_experience": 11, "completed_jobs": 0},
    ]
    ranked = rank_providers(test_providers, "Bangalore")
    print("\n=== Ranking Test (your exact scenario) ===")
    for i, p in enumerate(ranked, 1):
        src = next(x for x in test_providers if x["id"] == p["id"])
        print(f"  Rank {i}: {p['name']:<12} "
              f"Rating={src['avg_rating']}  "
              f"Exp={src['years_experience']}yrs  "
              f"Jobs={src['completed_jobs']}  "
              f"Score={p['recommendation_score']}  "
              f"{'✅ TOP' if p['is_top_pick'] else ''}")


# ════════════════════════════════════════════════════════════
# SECTION 2 — Smart Price Estimator (RESTORED — Problem 1 fix)
# ════════════════════════════════════════════════════════════

# Base prices per service in INR — must match SERVICES in constants.js
BASE_PRICES = {
    "plumber":          499,
    "electrician":      399,
    "carpenter":        599,
    "ac repair":        699,
    "house cleaning":   799,
    "painting":        1499,
    "pest control":     999,
    "appliance repair": 499,
    "water purifier":   349,
    "salon service":    599,
}

# Severity levels — highest to lowest priority. First match wins.
SEVERITY_LEVELS = [
    {
        "level":      "Emergency",
        "multiplier": 2.0,
        "color":      "red",
        "time":       "Immediate — 1 to 3 hours",
        "keywords": [
            "emergency", "urgent", "immediately", "right now", "asap",
            "gas leak", "gas leaking", "gas smell",
            "electric fire", "electrical fire",
            "short circuit fire", "sparks flying",
            "flooding", "flood", "water everywhere",
            "sewage overflow", "sewage spill",
            "no power entire building", "entire house no power",
            "dangerous", "critical situation", "smoke coming",
            "fire risk", "explosion risk",
        ],
    },
    {
        "level":      "Major",
        "multiplier": 1.5,
        "color":      "orange",
        "time":       "2 to 4 hours",
        "keywords": [
            "burst", "pipe burst", "main pipe",
            "completely broken", "not working at all", "stopped completely",
            "total failure", "complete breakdown", "blown fuse",
            "shattered", "collapsed",
            "heavy leak", "major leak", "water damage",
            "no electricity", "no power", "power outage",
            "overflowing", "sewage blocked",
            "rats", "rodents", "heavy infestation",
            "termite infestation", "termite damage",
            "heavy mold", "mould spread", "black mold",
            "compressor failure", "ac compressor dead",
            "washing machine dead", "fridge not cooling",
        ],
    },
    {
        "level":      "Standard",
        "multiplier": 1.0,
        "color":      "blue",
        "time":       "1 to 2 hours",
        "keywords": [
            "broken", "not working", "repair", "replace", "fix",
            "damaged", "faulty", "malfunction",
            "issue", "problem", "fault",
            "leak", "leaking",
            "clogged", "blocked", "choked",
            "worn out", "needs repair", "needs replacement",
            "stopped", "dead", "not functioning",
            "tripping", "mcb tripping",
            "infestation", "cockroach", "ants",
            "door stuck", "window broken", "cabinet broken",
            "motor not working", "pump not working",
        ],
    },
    {
        "level":      "Minor",
        "multiplier": 0.8,
        "color":      "green",
        "time":       "30 minutes to 1 hour",
        "keywords": [
            "small", "minor", "tiny", "little", "slight",
            "drip", "dripping", "slow drain",
            "loose", "wobbly", "wobbling",
            "noise", "sound", "squeaking", "rattling",
            "flickering", "dim light", "low pressure",
            "just checking", "inspection needed",
            "routine", "regular service", "annual service",
            "check", "checkup", "maintenance",
            "cleaning needed", "filter change",
            "touch up", "minor repair",
        ],
    },
]


def estimate_price(service: str, description: str) -> dict:
    """
    Estimate price range for a service based on problem description
    using keyword severity detection.
    """
    service_key = service.strip().lower()
    desc_lower  = description.strip().lower()

    base_price = BASE_PRICES.get(service_key, 499)

    detected   = None
    matched_kw = []

    for level in SEVERITY_LEVELS:
        hits = [kw for kw in level["keywords"] if kw in desc_lower]
        if hits:
            detected   = level
            matched_kw = hits[:5]
            break

    if detected is None:
        detected   = SEVERITY_LEVELS[2]   # default Standard
        matched_kw = []

    multiplier = detected["multiplier"]
    mid        = base_price * multiplier
    band       = base_price * 0.20
    min_price  = int(round((mid - band) / 50.0) * 50)
    max_price  = int(round((mid + band) / 50.0) * 50)
    min_price  = max(min_price, 99)

    if matched_kw:
        kw_display = ", ".join(f'"{kw}"' for kw in matched_kw[:3])
        reason = (
            f"{detected['level']} issue detected — keywords found: {kw_display}. "
            f"Price range adjusted to reflect the complexity of your problem."
        )
    else:
        reason = (
            "Standard estimate applied. Describe the problem in more detail "
            "for a more accurate price range."
        )

    return {
        "base_price":       base_price,
        "min_price":        min_price,
        "max_price":        max_price,
        "severity":         detected["level"],
        "severity_color":   detected["color"],
        "multiplier":       multiplier,
        "matched_keywords": matched_kw,
        "reason":           reason,
        "estimated_time":   detected["time"],
    }


# ════════════════════════════════════════════════════════════
# SECTION 3 — Earnings Forecast (minimum 2 months — Problem 2 fix)
# ════════════════════════════════════════════════════════════

def forecast_earnings(monthly_data: list) -> dict:
    """
    Predict next month's earnings using linear regression.
    Minimum 2 months required (reduced from 3).

    With exactly 2 months: simple trend projection.
    With 3+ months: full numpy linear regression with R² and std dev.
    """
    if not monthly_data or len(monthly_data) < 2:
        return {
            "error":       "Need at least 2 months of earnings data for a forecast.",
            "months_used": len(monthly_data) if monthly_data else 0,
        }

    amounts = []
    for item in monthly_data:
        try:
            amounts.append(float(item.get("amount", 0) or 0))
        except (TypeError, ValueError):
            amounts.append(0.0)

    n = len(amounts)
    x = np.arange(n, dtype=float)
    y = np.array(amounts, dtype=float)

    # ── Linear regression ─────────────────────────────────────
    coeffs    = np.polyfit(x, y, 1)
    slope     = float(coeffs[0])
    intercept = float(coeffs[1])

    predicted_raw = slope * n + intercept
    predicted     = max(0.0, predicted_raw)

    # ── Confidence band ───────────────────────────────────────
    y_pred    = slope * x + intercept
    residuals = y - y_pred
    std_dev   = float(np.std(residuals)) if n >= 3 else abs(slope) * 0.5

    min_est = max(0.0, predicted - std_dev)
    max_est = predicted + std_dev

    # ── R-squared (meaningful only with 3+ points) ───────────
    if n >= 3:
        ss_res  = float(np.sum(residuals ** 2))
        ss_tot  = float(np.sum((y - np.mean(y)) ** 2))
        r2      = 1.0 - (ss_res / ss_tot) if ss_tot > 0 else 0.0
        r2      = max(0.0, min(1.0, r2))
    else:
        # With 2 points a straight line is always perfect — set to 1.0
        # but flag it so the UI shows a note
        r2 = 1.0

    # ── Trend ─────────────────────────────────────────────────
    last_actual = amounts[-1]
    if last_actual > 0:
        pct_change = ((predicted - last_actual) / last_actual) * 100.0
    else:
        pct_change = 0.0

    if pct_change > 5.0:
        trend = "UP"
    elif pct_change < -5.0:
        trend = "DOWN"
    else:
        trend = "STABLE"

    # ── Insight ───────────────────────────────────────────────
    predicted_fmt = f"₹{int(round(predicted)):,}"
    last_fmt      = f"₹{int(round(last_actual)):,}"
    pct_fmt       = f"{abs(pct_change):.1f}%"

    if n == 2:
        # Special message when only 2 months available
        direction = "increased" if slope > 0 else "decreased"
        insight = (
            f"Based on your 2 months of data, earnings have {direction}. "
            f"Forecast for next month: {predicted_fmt}. "
            f"Add more months of earnings history for a more accurate forecast."
        )
    elif trend == "UP":
        insight = (
            f"Your earnings are trending upward. "
            f"Forecast for next month: {predicted_fmt} "
            f"(+{pct_fmt} vs this month's {last_fmt}). "
            f"Keep accepting jobs to maintain this growth."
        )
    elif trend == "DOWN":
        insight = (
            f"Your earnings have been declining. "
            f"Forecast for next month: {predicted_fmt} "
            f"(-{pct_fmt} vs this month's {last_fmt}). "
            f"Consider adding more availability slots."
        )
    else:
        insight = (
            f"Your earnings are stable. "
            f"Forecast for next month: {predicted_fmt} "
            f"(close to this month's {last_fmt}). "
            f"Consistent performance — great work!"
        )

    return {
        "predicted_amount": round(predicted, 2),
        "min_estimate":     round(min_est, 2),
        "max_estimate":     round(max_est, 2),
        "trend":            trend,
        "trend_percentage": round(pct_change, 1),
        "slope":            round(slope, 2),
        "r_squared":        round(r2, 3),
        "insight":          insight,
        "months_used":      n,
        "limited_data":     n < 3,   # flag so UI can show a note
    }