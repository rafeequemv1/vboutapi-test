const express = require("express");
const { addPost } = require("../vbout/socialMedia");

const router = express.Router();

function readBearerToken(req) {
  const h = String(req.headers.authorization || "");
  if (!h.toLowerCase().startsWith("bearer ")) return "";
  return h.slice(7).trim();
}

function assertCronAuth(req) {
  const secret = String(process.env.CRON_SECRET || "").trim();
  if (!secret) return;
  const token = readBearerToken(req);
  if (!token || token !== secret) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
}

async function runFirecrawlAgentWithPolling({ prompt, schema, model }) {
  const apiKey = String(process.env.FIRECRAWL_API_KEY || "").trim();
  if (!apiKey) throw new Error("Missing FIRECRAWL_API_KEY");

  const startRes = await fetch("https://api.firecrawl.dev/v2/agent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ prompt, schema, model }),
  });
  const startData = await startRes.json().catch(() => ({}));
  if (!startRes.ok || !startData?.success) {
    throw new Error(startData?.error || startData?.message || "Firecrawl start failed");
  }

  if (typeof startData?.data !== "undefined") return startData;

  const id = String(startData?.id || "").trim();
  if (!id) throw new Error("Firecrawl response missing run id");

  for (let i = 0; i < 60; i += 1) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const sRes = await fetch(`https://api.firecrawl.dev/v2/agent/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const sData = await sRes.json().catch(() => ({}));
    if (!sRes.ok || !sData?.success) {
      throw new Error(sData?.error || sData?.message || "Firecrawl status failed");
    }
    const status = String(sData?.status || "");
    if (status === "completed") return sData;
    if (status === "failed" || status === "cancelled" || status === "error") {
      throw new Error(`Firecrawl run ${status}`);
    }
  }

  throw new Error("Firecrawl timed out");
}

async function runAutomationCore() {
  const channel = String(process.env.AUTOMATION_CHANNEL || "linkedin").trim();
  const channelid = String(process.env.AUTOMATION_CHANNEL_ID || "").trim();
  const lookbackDays = Math.max(1, Math.min(7, Number(process.env.AUTOMATION_LOOKBACK_DAYS || 2)));
  const model = String(process.env.AUTOMATION_MODEL || "spark-1-mini").trim();

  if (!channelid) throw new Error("Missing AUTOMATION_CHANNEL_ID");

  const prompt = `Extract PhD openings in Chemistry research posted globally in the last ${lookbackDays} days. Return only the best 1 opening with institution, research_focus, application_link, source_url, posted_date, and original_post_text.`;
  const schema = {
    type: "object",
    properties: {
      phd_openings: {
        type: "array",
        items: {
          type: "object",
          properties: {
            institution: { type: "string" },
            research_focus: { type: "string" },
            application_link: { type: "string" },
            source_url: { type: "string" },
            posted_date: { type: "string" },
            original_post_text: { type: "string" },
          },
          required: [
            "institution",
            "research_focus",
            "application_link",
            "source_url",
            "posted_date",
            "original_post_text",
          ],
        },
      },
    },
    required: ["phd_openings"],
  };

  const scraped = await runFirecrawlAgentWithPolling({ prompt, schema, model });
  const jobs = scraped?.data?.phd_openings || scraped?.phd_openings || [];
  const first = Array.isArray(jobs) ? jobs[0] : undefined;
  if (!first) throw new Error("No jobs found from Firecrawl");

  const caption =
    `New PhD Opening in Chemistry\n\n` +
    `Institution: ${first.institution}\n` +
    `Focus: ${first.research_focus}\n` +
    `Posted: ${first.posted_date}\n\n` +
    `Apply: ${first.application_link}\n` +
    `Source: ${first.source_url}\n\n` +
    `#PhD #Chemistry #ResearchJobs`;

  const vboutResp = await addPost({
    message: caption,
    channel,
    channelid,
    isScheduled: false,
    trackableLinks: false,
  });

  const postId =
    vboutResp?.response?.data?.post_id ||
    vboutResp?.data?.post_id ||
    null;

  return {
    channel,
    channelid,
    postId,
    job: first,
    vbout: vboutResp,
  };
}

async function handler(req, res) {
  try {
    assertCronAuth(req);
    const result = await runAutomationCore();
    res.json({ ok: true, result });
  } catch (err) {
    const status = err?.status && Number(err.status) ? err.status : 400;
    res.status(status).json({ ok: false, error: err?.message || "Automation failed" });
  }
}

router.get("/api/automation/run", handler);
router.post("/api/automation/run", handler);

module.exports = { router };

