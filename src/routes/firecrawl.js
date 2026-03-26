const express = require("express");
const { z } = require("zod");

const router = express.Router();

const agentSchema = z.object({
  prompt: z.string().min(1),
  schema: z.any().optional(),
  model: z.string().optional(),
});

router.post("/api/firecrawl/agent", async (req, res) => {
  try {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      res.status(400).json({
        ok: false,
        error: "Missing FIRECRAWL_API_KEY. Add it to .env and restart the server.",
      });
      return;
    }

    const parsed = agentSchema.safeParse(req.body || {});
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: parsed.error.message });
      return;
    }

    const payload = parsed.data;
    const upstream = await fetch("https://api.firecrawl.dev/v2/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    if (!upstream.ok) {
      res.status(upstream.status).json({
        ok: false,
        error: json?.error || json?.message || "Firecrawl request failed",
        status: upstream.status,
        data: json,
      });
      return;
    }

    res.json({ ok: true, data: json });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message || "Server error" });
  }
});

router.get("/api/firecrawl/agent/:id", async (req, res) => {
  try {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      res.status(400).json({
        ok: false,
        error: "Missing FIRECRAWL_API_KEY. Add it to .env and restart the server.",
      });
      return;
    }

    const id = String(req.params.id || "").trim();
    if (!id) {
      res.status(400).json({ ok: false, error: "Missing agent id" });
      return;
    }

    const upstream = await fetch(`https://api.firecrawl.dev/v2/agent/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const text = await upstream.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    if (!upstream.ok) {
      res.status(upstream.status).json({
        ok: false,
        error: json?.error || json?.message || "Firecrawl status request failed",
        status: upstream.status,
        data: json,
      });
      return;
    }

    res.json({ ok: true, data: json });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message || "Server error" });
  }
});

module.exports = { router };

