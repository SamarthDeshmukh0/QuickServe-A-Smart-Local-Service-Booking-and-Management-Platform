// ============================================================
// FILE: src/services/estimateService.js   (NEW FILE)
// Axios call to Flask /estimate endpoint — called from React
// ============================================================

import axios from "axios";

// Flask runs on port 5001 — separate from Spring Boot (8080)
const FLASK_URL = "http://localhost:5001";

/**
 * Call the Flask price estimator endpoint.
 * @param {string} service     - e.g. "Plumber"
 * @param {string} description - customer's problem description text
 * @returns Promise<AxiosResponse>
 */
export const estimatePrice = (service, description) =>
  axios.post(`${FLASK_URL}/estimate`, { service, description });