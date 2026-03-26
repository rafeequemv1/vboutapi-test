const dotenv = require("dotenv");

dotenv.config();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class VboutClient {
  /**
   * @param {object} opts
   * @param {string} opts.apiKey VBOUT User API Key
   */
  constructor({ apiKey }) {
    if (!apiKey) throw new Error("Missing VBOUT_API_KEY");
    this.apiKey = apiKey;
    this.baseUrl = "https://api.vbout.com/1/";

    // VBOUT documented limit: 15 requests per second.
    this.maxPerSecond = 15;
    this.windowMs = 1000;
    this.requestTimestamps = [];
  }

  async throttle() {
    const now = Date.now();
    // Drop timestamps outside the window.
    this.requestTimestamps = this.requestTimestamps.filter(
      (t) => now - t < this.windowMs,
    );

    if (this.requestTimestamps.length < this.maxPerSecond) return;

    const earliest = this.requestTimestamps[0];
    const waitMs = earliest + this.windowMs - now;
    if (waitMs > 0) await sleep(waitMs);
  }

  async request(method, endpoint, params) {
    await this.throttle();

    // Count the request at dispatch time so the limiter is accurate.
    this.requestTimestamps.push(Date.now());

    const url = new URL(endpoint, this.baseUrl);
    url.searchParams.set("key", this.apiKey);

    const headers = {};
    let body;

    if (method === "GET") {
      for (const [k, v] of Object.entries(params || {})) {
        if (v === undefined || v === null || v === "") continue;
        url.searchParams.set(k, String(v));
      }
    } else {
      const search = new URLSearchParams();
      for (const [k, v] of Object.entries(params || {})) {
        if (v === undefined || v === null || v === "") continue;
        search.set(k, String(v));
      }
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      body = search.toString();
    }

    const res = await fetch(url.toString(), { method, headers, body });

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    if (!res.ok) {
      const err = new Error(
        `VBOUT request failed: ${res.status} ${res.statusText}`,
      );
      err.status = res.status;
      err.response = json;
      throw err;
    }

    return json;
  }

  get(endpoint, params) {
    return this.request("GET", endpoint, params);
  }

  post(endpoint, params) {
    return this.request("POST", endpoint, params);
  }
}

function createVboutClient() {
  // Lazy read: dotenv above loads .env automatically for local development.
  return new VboutClient({ apiKey: process.env.VBOUT_API_KEY });
}

module.exports = { createVboutClient };

