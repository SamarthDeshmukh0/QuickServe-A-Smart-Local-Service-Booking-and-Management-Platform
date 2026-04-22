// ============================================================
// FILE: src/services/forecastService.js   (NEW FILE)
// Direct Axios call to Flask port 5001 — same pattern as
// estimateService.js which also calls Flask directly
// ============================================================

import axios from "axios";

//const FLASK_BASE = "http://localhost:5001";
import { FLASK_BASE_URL } from "../utils/constants";
/**
 * Call Flask /forecast with the provider's monthly earnings data.
 *
 * @param {number}   providerId   - provider ID (sent for logging only)
 * @param {Array}    monthlyData  - [{month: "Jan", amount: 4200}, ...]
 *                                  must be in chronological order, min 3 items
 * @returns Promise<AxiosResponse>
 */
export const getEarningsForecast = (providerId, monthlyData) =>
  axios.post(`${FLASK_BASE_URL}/forecast`, {
    provider_id:  providerId,
    monthly_data: monthlyData,
  });