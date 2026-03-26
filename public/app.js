const form = document.getElementById("postForm");
const statusEl = document.getElementById("status");

const sendModeRadios = Array.from(form.querySelectorAll('input[name="sendMode"]'));
const scheduledControls = document.getElementById("scheduledControls");
const channelSelect = document.getElementById("channel");
const channelIdDisplayInput = document.getElementById("channelid");
const channelIdHiddenInput = document.getElementById("channelidHidden");
const accountSelect = document.getElementById("accountid");
const photoHiddenInput = document.getElementById("photo");
const photoUrlInput = document.getElementById("photoUrl");
const mediaFileInput = document.getElementById("mediaFile");
const mediaDrop = document.getElementById("mediaDrop");
const mediaPickBtn = document.getElementById("mediaPickBtn");
const mediaPreview = document.getElementById("mediaPreview");
const clearMediaBtn = document.getElementById("clearMediaBtn");
const mediaGrid = document.getElementById("mediaGrid");
const threadModeCheckbox = document.getElementById("threadMode");
const singleMessageBlock = document.getElementById("singleMessageBlock");
const threadBlock = document.getElementById("threadBlock");
const tweetList = document.getElementById("tweetList");
const addTweetBtn = document.getElementById("addTweetBtn");
const removeTweetBtn = document.getElementById("removeTweetBtn");
const threadIntervalMinutesInput = document.getElementById("threadIntervalMinutes");

// Tabs + feature panels
// (Top tab buttons were removed to keep the UI minimal; sidebar is the single nav.)
const tabButtons = Array.from(document.querySelectorAll(".tabBtn"));
const navLinks = Array.from(document.querySelectorAll(".navLink"));
const tabCompose = document.getElementById("tabCompose");
const tabCalendar = document.getElementById("tabCalendar");
const tabStats = document.getElementById("tabStats");
const tabManage = document.getElementById("tabManage");
const tabFirecrawl = document.getElementById("tabFirecrawl");
const tabAutomation = document.getElementById("tabAutomation");

const firecrawlCode = document.getElementById("firecrawlCode");
const firecrawlPreset = document.getElementById("firecrawlPreset");
const loadFirecrawlPresetBtn = document.getElementById("loadFirecrawlPresetBtn");
const runFirecrawlBtn = document.getElementById("runFirecrawlBtn");
const clearFirecrawlBtn = document.getElementById("clearFirecrawlBtn");
const firecrawlOutput = document.getElementById("firecrawlOutput");
const automationDaysInput = document.getElementById("automationDays");
const automationLinkedinAccountSelect = document.getElementById("automationLinkedinAccount");
const automationModelSelect = document.getElementById("automationModel");
const runAutomationBtn = document.getElementById("runAutomationBtn");
const clearAutomationTimelineBtn = document.getElementById("clearAutomationTimelineBtn");
const automationTestCaptionInput = document.getElementById("automationTestCaption");
const runAutomationTestPostBtn = document.getElementById("runAutomationTestPostBtn");
const automationTimeline = document.getElementById("automationTimeline");
const cronHourUtcInput = document.getElementById("cronHourUtc");
const cronMinuteUtcInput = document.getElementById("cronMinuteUtc");
const cronSecretInput = document.getElementById("cronSecretInput");
const cronGenerateBtn = document.getElementById("cronGenerateBtn");
const cronCopyBtn = document.getElementById("cronCopyBtn");
const cronRunNowBtn = document.getElementById("cronRunNowBtn");
const cronExpressionPreview = document.getElementById("cronExpressionPreview");
const cronConfigPreview = document.getElementById("cronConfigPreview");
const jobTitleInput = document.getElementById("jobTitleInput");
const jobInstitutionInput = document.getElementById("jobInstitutionInput");
const jobFocusInput = document.getElementById("jobFocusInput");
const jobPostedDateInput = document.getElementById("jobPostedDateInput");
const jobApplyLinkInput = document.getElementById("jobApplyLinkInput");
const jobLocationInput = document.getElementById("jobLocationInput");
const jobFundingInput = document.getElementById("jobFundingInput");
const jobDeadlineInput = document.getElementById("jobDeadlineInput");
const jobKeywordsInput = document.getElementById("jobKeywordsInput");
const jobRequirementsInput = document.getElementById("jobRequirementsInput");
const jobHighlightsInput = document.getElementById("jobHighlightsInput");
const jobCaptionInput = document.getElementById("jobCaptionInput");
const refreshTemplatePreviewBtn = document.getElementById("refreshTemplatePreviewBtn");
const generatePngBtn = document.getElementById("generatePngBtn");
const postAutomationBtn = document.getElementById("postAutomationBtn");
const jobTemplatePreviewImg = document.getElementById("jobTemplatePreviewImg");
const jobTemplatePreviewMeta = document.getElementById("jobTemplatePreviewMeta");

const FIRECRAWL_PRESETS = {
  phd_openings_chem: `const payload = {
  prompt: "Extract the 10 most recent PhD openings in Chemistry research posted globally within the last 15 days. Prioritize searching high-volume academic job boards (e.g., FindAPhD, ResearchGate, AcademicPositions) and LinkedIn posts from PIs. For each opening, you MUST capture the direct link to the specific university, lab, or institution's application page. IMPORTANT: Skip any listings that only provide an internal job board application button and do not link out to the official institutional/lab website. For each valid entry, capture the institution, research focus, application requirements, the direct link to the institutional application portal, the source URL, the posted date, and the full text of the original announcement.",
  schema: {
    type: "object",
    properties: {
      phd_openings: {
        type: "array",
        items: {
          type: "object",
          properties: {
            institution: { type: "string" },
            institution_citation: { type: "string", description: "Source URL for institution" },
            research_focus: { type: "string" },
            research_focus_citation: { type: "string", description: "Source URL for research_focus" },
            application_requirements: { type: "string" },
            application_requirements_citation: { type: "string", description: "Source URL for application_requirements" },
            application_link: { type: "string" },
            application_link_citation: { type: "string", description: "Source URL for application_link" },
            source_url: { type: "string" },
            source_url_citation: { type: "string", description: "Source URL for source_url" },
            posted_date: { type: "string" },
            posted_date_citation: { type: "string", description: "Source URL for posted_date" },
            original_post_text: { type: "string" },
            original_post_text_citation: { type: "string", description: "Source URL for original_post_text" }
          },
          required: [
            "institution",
            "research_focus",
            "application_requirements",
            "application_link",
            "source_url",
            "posted_date",
            "original_post_text"
          ]
        }
      }
    },
    required: ["phd_openings"]
  },
  model: "spark-1-pro"
};

const result = await firecrawlAgent(payload);
log(result);
return result;
`,
  new_pi_no_website: `const payload = {
  prompt:
    "Extract details of newly appointed Chemistry Principal Investigators (PIs) worldwide who do not yet have a personal or dedicated lab website. For each PI, provide their name, university affiliation, department, primary research area, and email address. Include the source URL where the information was found (such as a university directory or faculty announcement page).",
  model: "spark-1-mini",
  schema: {
    type: "object",
    properties: {
      principal_investigators: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            name_citation: { type: "string" },
            university_affiliation: { type: "string" },
            university_affiliation_citation: { type: "string" },
            department: { type: "string" },
            department_citation: { type: "string" },
            primary_research_area: { type: "string" },
            primary_research_area_citation: { type: "string" },
            email_address: { type: "string" },
            email_address_citation: { type: "string" },
            source_url: { type: "string" },
            source_url_citation: { type: "string" }
          },
          required: [
            "name",
            "university_affiliation",
            "department",
            "primary_research_area",
            "email_address",
            "source_url"
          ]
        }
      }
    },
    required: ["principal_investigators"]
  }
};

const result = await firecrawlAgent(payload);
log(result);
return result;
`,
};

function loadFirecrawlPreset(key) {
  const content = FIRECRAWL_PRESETS[key];
  if (!firecrawlCode || !content) return;
  firecrawlCode.value = content;
  setFirecrawlOutput("Loaded preset. Click Run.");
}

if (loadFirecrawlPresetBtn && firecrawlPreset) {
  loadFirecrawlPresetBtn.addEventListener("click", () => loadFirecrawlPreset(firecrawlPreset.value));
}

const calendarChannelsSelect = document.getElementById("calendarChannels");
const calendarFromInput = document.getElementById("calendarFrom");
const calendarToInput = document.getElementById("calendarTo");
const calendarIncludepostedInput = document.getElementById("calendarIncludeposted");
const calendarLimitInput = document.getElementById("calendarLimit");
const calendarPageInput = document.getElementById("calendarPage");
const calendarSortSelect = document.getElementById("calendarSort");
const loadCalendarBtn = document.getElementById("loadCalendarBtn");
const calendarList = document.getElementById("calendarList");
const calendarGrid = document.getElementById("calendarGrid");
const calendarTitle = document.getElementById("calendarTitle");
const calPrevBtn = document.getElementById("calPrevBtn");
const calNextBtn = document.getElementById("calNextBtn");

const previewChannelBadge = document.getElementById("previewChannel");
const previewMedia = document.getElementById("previewMedia");
const previewText = document.getElementById("previewText");

const statsChannelsSelect = document.getElementById("statsChannels");
const statsSortSelect = document.getElementById("statsSort");
const loadStatsBtn = document.getElementById("loadStatsBtn");
const statsList = document.getElementById("statsList");

const managePostIdInput = document.getElementById("managePostId");
const manageChannelSelect = document.getElementById("manageChannel");
const loadPostBtn = document.getElementById("loadPostBtn");
const deletePostBtn = document.getElementById("deletePostBtn");
const manageEditor = document.getElementById("manageEditor");
const manageMessageTextarea = document.getElementById("manageMessage");
const manageScheduledDateInput = document.getElementById("manageScheduledDate");
const manageScheduledTimeInput = document.getElementById("manageScheduledTime");
const updatePostBtn = document.getElementById("updatePostBtn");
const manageInfo = document.getElementById("manageInfo");

const CALENDAR_CHANNELS = ["all", "facebook", "twitter", "linkedin"];
const STATS_CHANNELS = ["all", "facebook", "twitter", "linkedin", "pinterest"];

function setScheduledVisible() {
  const selected = form.querySelector('input[name="sendMode"]:checked');
  const sendMode = selected ? selected.value : "immediate";
  scheduledControls.classList.toggle("hidden", sendMode !== "scheduled");
}

sendModeRadios.forEach((r) => r.addEventListener("change", setScheduledVisible));
setScheduledVisible();

function showStatus(text) {
  statusEl.textContent = text;
}

function showTab(tabName) {
  const map = {
    compose: tabCompose,
    calendar: tabCalendar,
    stats: tabStats,
    manage: tabManage,
    firecrawl: tabFirecrawl,
    automation: tabAutomation,
  };

  for (const [name, el] of Object.entries(map)) {
    if (!el) continue;
    el.classList.toggle("hidden", name !== tabName);
  }

  for (const btn of tabButtons) {
    const active = btn.getAttribute("data-tab") === tabName;
    btn.classList.toggle("active", active);
  }

  for (const link of navLinks) {
    const active = link.getAttribute("data-tab") === tabName;
    link.classList.toggle("active", active);
  }
}

function setFirecrawlOutput(text) {
  if (!firecrawlOutput) return;
  firecrawlOutput.textContent = text;
}

function appendFirecrawlOutput(line) {
  if (!firecrawlOutput) return;
  const existing = firecrawlOutput.textContent || "";
  firecrawlOutput.textContent = existing ? `${existing}\n${line}` : line;
}

function formatLogArg(x) {
  if (typeof x === "string") return x;
  try {
    return JSON.stringify(x, null, 2);
  } catch {
    return String(x);
  }
}

async function firecrawlAgentRequest(payload, onProgress) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const notify = (msg) => {
    if (typeof onProgress === "function") onProgress(msg);
  };

  const res = await fetch("/api/firecrawl/agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Firecrawl request failed");
  }

  const first = data.data || {};
  if (typeof first?.data !== "undefined") {
    notify("completed");
    return first;
  }

  const id = first?.id;
  if (!id) return first;

  notify(`queued (id: ${id})`);
  const maxAttempts = 60; // ~2 minutes
  for (let i = 0; i < maxAttempts; i += 1) {
    await sleep(2000);
    const sRes = await fetch(`/api/firecrawl/agent/${encodeURIComponent(id)}`, { method: "GET" });
    const sData = await sRes.json().catch(() => ({}));
    if (!sRes.ok || !sData?.ok) {
      throw new Error(sData?.error || "Failed to fetch Firecrawl run status");
    }

    const run = sData.data || {};
    const status = String(run?.status || "unknown");
    notify(status);

    if (status === "completed") return run;
    if (status === "failed" || status === "cancelled" || status === "error") {
      throw new Error(`Firecrawl run ${status}`);
    }
  }

  throw new Error("Timed out while waiting for Firecrawl completion");
}

async function runFirecrawlUserCode(code) {
  // Runs in browser context; provide a minimal helper surface.
  const log = (...args) => appendFirecrawlOutput(args.map(formatLogArg).join(" "));
  const firecrawlAgent = async (payload) => {
    return await firecrawlAgentRequest(payload, (s) => log(`[progress] ${s}`));
  };

  const ctx = {
    log,
    firecrawlAgent,
    fetch: window.fetch.bind(window),
    FormData: window.FormData,
    Headers: window.Headers,
    URL: window.URL,
  };

  // Pasted snippets often include Node/ESM imports which cannot run here.
  // Give a friendly hint instead of a confusing SyntaxError.
  if (/(^|\n)\s*import\s+.+from\s+['"][^'"]+['"]\s*;?\s*(\n|$)/.test(code) || /(^|\n)\s*import\s*{\s*.+\s*}\s*from\s+['"][^'"]+['"]\s*;?\s*(\n|$)/.test(code)) {
    throw new Error(
      [
        "This runner executes code in the browser, so top-level `import ...` statements are not supported.",
        "",
        "Use the built-in helper instead (no imports needed):",
        "  const data = await firecrawlAgent({ prompt, schema, model });",
        "  log(data);",
      ].join("\n")
    );
  }

  // Use `with` so pasted snippets can call log()/fetch() directly.
  // eslint-disable-next-line no-new-func
  const fn = new Function(
    "ctx",
    `"use strict";
     return (async () => {
       const { log, firecrawlAgent, fetch, FormData, Headers, URL } = ctx;
       ${code}
     })();`
  );

  return await fn(ctx);
}

if (clearFirecrawlBtn) {
  clearFirecrawlBtn.addEventListener("click", () => {
    if (firecrawlCode) firecrawlCode.value = "";
    setFirecrawlOutput("Output will appear here…");
  });
}

if (runFirecrawlBtn) {
  runFirecrawlBtn.addEventListener("click", async () => {
    try {
      const code = (firecrawlCode?.value || "").trim();
      if (!code) {
        setFirecrawlOutput("Paste code first.");
        return;
      }
      setFirecrawlOutput("");
      showStatus("Running Firecrawl code...");
      const result = await runFirecrawlUserCode(code);
      if (typeof result !== "undefined") {
        appendFirecrawlOutput(`\n[return]\n${formatLogArg(result)}`);
      }
      showStatus("Firecrawl run complete.");
    } catch (err) {
      appendFirecrawlOutput(`\n[error]\n${err?.stack || err?.message || String(err)}`);
      showStatus("Firecrawl run failed.");
    }
  });
}

function addAutomationTimelineItem(text) {
  if (!automationTimeline) return;
  const item = document.createElement("div");
  item.className = "timelineItem";
  item.textContent = `${new Date().toLocaleTimeString()}  ${text}`;
  automationTimeline.appendChild(item);
}

function clearAutomationTimeline() {
  if (!automationTimeline) return;
  automationTimeline.innerHTML = "";
}

function buildCronConfigPreview() {
  const hh = Math.max(0, Math.min(23, Number(cronHourUtcInput?.value || 9)));
  const mm = Math.max(0, Math.min(59, Number(cronMinuteUtcInput?.value || 0)));
  const cron = `${mm} ${hh} * * *`;
  if (cronExpressionPreview) cronExpressionPreview.textContent = `Cron expression (UTC): ${cron}`;

  const accountId = automationLinkedinAccountSelect?.value || "<AUTOMATION_CHANNEL_ID>";
  const model = automationModelSelect?.value || "spark-1-mini";
  const lookbackDays = Math.max(1, Math.min(7, Number(automationDaysInput?.value || 2)));

  const preview = `vercel.json
"crons": [
  { "path": "/api/automation/run", "schedule": "${cron}" }
]

Environment Variables
CRON_SECRET=<your-secret>
AUTOMATION_CHANNEL=linkedin
AUTOMATION_CHANNEL_ID=${accountId}
AUTOMATION_LOOKBACK_DAYS=${lookbackDays}
AUTOMATION_MODEL=${model}`;

  if (cronConfigPreview) cronConfigPreview.textContent = preview;
  return preview;
}

let automationDraft = null;
let automationImagePngBlob = null;
let automationLastPostedSignature = null;
let automationPostInFlight = false;

function escapeXml(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapSvgText(text, maxCharsPerLine, maxLines) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length <= maxCharsPerLine) {
      line = next;
      continue;
    }
    if (line) lines.push(line);
    line = w;
    if (lines.length >= maxLines - 1) break;
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (!lines.length) lines.push("");
  return lines;
}

function buildJobTemplateSvgPayload() {
  const title = jobTitleInput?.value?.trim() || "PhD Opening in Chemistry";
  const institution = jobInstitutionInput?.value?.trim() || "Institution";
  const focus = jobFocusInput?.value?.trim() || "Research focus";
  const posted = jobPostedDateInput?.value?.trim() || "N/A";
  const link = jobApplyLinkInput?.value?.trim() || "";
  const location = jobLocationInput?.value?.trim() || "Global";
  const funding = jobFundingInput?.value?.trim() || "Funding details on application page";
  const deadline = jobDeadlineInput?.value?.trim() || "Rolling";
  const keywords = jobKeywordsInput?.value?.trim() || "Chemistry, PhD, Research";
  const requirements = jobRequirementsInput?.value?.trim() || "See official posting for full requirements.";
  const highlights = jobHighlightsInput?.value?.trim() || "Strong mentorship, modern facilities, publication opportunities.";

  const titleLines = wrapSvgText(title, 28, 3);
  const instLines = wrapSvgText(institution, 34, 2);
  const focusLines = wrapSvgText(focus, 36, 2);
  const linkLines = wrapSvgText(link, 40, 2);
  const reqLines = wrapSvgText(requirements, 46, 3);
  const hlLines = wrapSvgText(highlights, 46, 3);
  const keyLines = wrapSvgText(keywords, 40, 2);

  const width = 1080;
  const height = 1350;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8fbff"/>
      <stop offset="100%" stop-color="#eef4ff"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect x="48" y="48" width="984" height="1254" rx="28" fill="#ffffff" stroke="#dbe4f3"/>

  <rect x="48" y="48" width="984" height="140" rx="28" fill="#103b8c"/>
  <text x="86" y="112" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="26" font-weight="600" fill="#dbeafe">Academic Opportunity</text>
  <text x="86" y="148" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="20" fill="#bfdbfe">Curated by Upscholar</text>

  <g transform="translate(742,78)">
    <rect x="0" y="0" width="250" height="74" rx="16" fill="#ffffff" fill-opacity="0.98"/>
    <rect x="12" y="12" width="50" height="50" rx="12" fill="#0f172a"/>
    <path d="M22 38l15-8 15 8-15 8-15-8Z" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linejoin="round"/>
    <path d="M30 43v8c0 4 14 4 14 0v-8" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
    <text x="76" y="46" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="28" font-weight="700" fill="#0f172a">Upscholar</text>
  </g>

  <rect x="82" y="220" width="916" height="210" rx="20" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="112" y="272" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="22" fill="#64748b">Position</text>
  ${titleLines
    .map(
      (line, idx) =>
        `<text x="112" y="${326 + idx * 54}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="50" font-weight="700" fill="#0f172a">${escapeXml(line)}</text>`
    )
    .join("")}

  <rect x="82" y="456" width="596" height="500" rx="20" fill="#f8fafc" stroke="#e2e8f0"/>
  <rect x="702" y="456" width="296" height="500" rx="20" fill="#f8fafc" stroke="#e2e8f0"/>

  <circle cx="116" cy="504" r="14" fill="#1d4ed8"/>
  <path d="M109 504h14M116 497v14" stroke="#fff" stroke-width="2.3" stroke-linecap="round"/>
  <text x="142" y="512" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="26" fill="#475569">Institution</text>
  ${instLines
    .map(
      (line, idx) =>
        `<text x="142" y="${552 + idx * 36}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="33" fill="#0f172a">${escapeXml(line)}</text>`
    )
    .join("")}
  <circle cx="116" cy="612" r="14" fill="#0ea5e9"/>
  <path d="M108 612h16" stroke="#fff" stroke-width="2.3" stroke-linecap="round"/>
  <text x="142" y="620" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="26" fill="#475569">Research Focus</text>
  ${focusLines
    .map(
      (line, idx) =>
        `<text x="142" y="${660 + idx * 34}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="31" fill="#0f172a">${escapeXml(line)}</text>`
    )
    .join("")}
  <circle cx="116" cy="742" r="14" fill="#059669"/>
  <path d="M110 742l4 4 7-8" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="142" y="750" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="26" fill="#475569">Requirements</text>
  ${reqLines
    .map(
      (line, idx) =>
        `<text x="142" y="${790 + idx * 30}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="24" fill="#0f172a">${escapeXml(line)}</text>`
    )
    .join("")}

  <circle cx="116" cy="880" r="14" fill="#7c3aed"/>
  <path d="M108 880h16" stroke="#fff" stroke-width="2.3" stroke-linecap="round"/>
  <text x="142" y="888" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="26" fill="#475569">Highlights</text>
  ${hlLines
    .map(
      (line, idx) =>
        `<text x="142" y="${928 + idx * 28}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="23" fill="#0f172a">${escapeXml(line)}</text>`
    )
    .join("")}

  <text x="726" y="512" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="22" fill="#64748b">Posted Date</text>
  <text x="726" y="548" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="30" fill="#0f172a">${escapeXml(posted)}</text>
  <text x="726" y="604" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="22" fill="#64748b">Location</text>
  <text x="726" y="640" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="30" fill="#0f172a">${escapeXml(location)}</text>
  <text x="726" y="696" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="22" fill="#64748b">Funding</text>
  <text x="726" y="732" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="24" fill="#0f172a">${escapeXml(funding)}</text>
  <text x="726" y="788" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="22" fill="#64748b">Deadline</text>
  <text x="726" y="824" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="28" fill="#0f172a">${escapeXml(deadline)}</text>
  <text x="726" y="880" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="22" fill="#64748b">Keywords</text>
  ${keyLines
    .map(
      (line, idx) =>
        `<text x="726" y="${916 + idx * 30}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="22" fill="#334155">${escapeXml(line)}</text>`
    )
    .join("")}

  <rect x="726" y="1032" width="246" height="58" rx="14" fill="#1d4ed8"/>
  <text x="754" y="1068" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="28" font-weight="700" fill="#ffffff">Apply Now</text>
  <text x="82" y="1240" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="18" fill="#64748b">Source verified via public listing. Please check official page for latest updates.</text>
  ${linkLines
    .map(
      (line, idx) =>
        `<text x="726" y="${1134 + idx * 24}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="20" fill="#1d4ed8">${escapeXml(line)}</text>`
    )
    .join("")}
</svg>`;

  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return { svg, dataUrl };
}

function renderJobTemplatePreview() {
  const { dataUrl } = buildJobTemplateSvgPayload();
  if (jobTemplatePreviewImg) jobTemplatePreviewImg.src = dataUrl;
  if (jobTemplatePreviewMeta) jobTemplatePreviewMeta.textContent = "SVG preview ready.";
}

async function generateJobTemplatePngBlob() {
  const { svg } = buildJobTemplateSvgPayload();
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = svgUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const pngBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!pngBlob) throw new Error("Failed to create PNG");
    return pngBlob;
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function populateAutomationLinkedinAccounts() {
  if (!automationLinkedinAccountSelect) return;
  const linkedin = connectedChannels.find((c) => c.channel === "linkedin");
  const accounts = Array.isArray(linkedin?.accounts) ? linkedin.accounts : [];
  automationLinkedinAccountSelect.innerHTML = "";
  if (!accounts.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No LinkedIn connected accounts";
    automationLinkedinAccountSelect.appendChild(opt);
    return;
  }
  for (const a of accounts) {
    const opt = document.createElement("option");
    opt.value = a.id;
    opt.textContent = a.label ? `${a.label}` : `${a.id}`;
    automationLinkedinAccountSelect.appendChild(opt);
  }
}

async function runAutomationOnce() {
  const accountId = automationLinkedinAccountSelect?.value || "";
  const days = Math.max(1, Math.min(7, Number(automationDaysInput?.value || 2)));
  const model = automationModelSelect?.value || "spark-1-pro";

  if (!accountId) throw new Error("Select a LinkedIn account first.");

  addAutomationTimelineItem("Starting automation...");
  addAutomationTimelineItem("Scraping latest PhD openings via Firecrawl...");
  const prompt = `Extract PhD openings in Chemistry research posted globally in the last ${days} days. Return only the best 1 opening with institution, research_focus, application_link, source_url, posted_date, and original_post_text.`;
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

  const scraped = await firecrawlAgentRequest(
    { prompt, schema, model },
    (status) => addAutomationTimelineItem(`Firecrawl: ${status}`)
  );
  const jobs = scraped?.data?.phd_openings || scraped?.phd_openings || [];
  const first = Array.isArray(jobs) ? jobs[0] : undefined;
  if (!first) throw new Error("No jobs found from Firecrawl.");

  addAutomationTimelineItem("Generating caption...");
  const caption =
    `New PhD Opening in Chemistry\n\n` +
    `Institution: ${first.institution}\n` +
    `Focus: ${first.research_focus}\n` +
    `Posted: ${first.posted_date}\n\n` +
    `Apply: ${first.application_link}\n` +
    `Source: ${first.source_url}\n\n` +
    `#PhD #Chemistry #ResearchJobs`;

  automationDraft = {
    channel: "linkedin",
    channelid: accountId,
    message: caption,
    job: first,
  };

  if (jobTitleInput) jobTitleInput.value = "PhD Opening in Chemistry";
  if (jobInstitutionInput) jobInstitutionInput.value = first.institution || "";
  if (jobFocusInput) jobFocusInput.value = first.research_focus || "";
  if (jobPostedDateInput) jobPostedDateInput.value = first.posted_date || "";
  if (jobApplyLinkInput) jobApplyLinkInput.value = first.application_link || "";
  if (jobLocationInput) jobLocationInput.value = "Global";
  if (jobFundingInput) jobFundingInput.value = "See listing";
  if (jobDeadlineInput) jobDeadlineInput.value = "Check source link";
  if (jobKeywordsInput) jobKeywordsInput.value = `${first.research_focus || "Chemistry"}, PhD, Research`;
  if (jobRequirementsInput) {
    const src = String(first.original_post_text || "");
    jobRequirementsInput.value = src ? src.slice(0, 180) : "See source posting for eligibility and application requirements.";
  }
  if (jobHighlightsInput) jobHighlightsInput.value = "Latest opening; direct institution application link; research-focused role.";
  if (jobCaptionInput) jobCaptionInput.value = caption;

  renderJobTemplatePreview();
  addAutomationTimelineItem("Draft ready. Review preview, then click Post to LinkedIn.");
}

async function postImageToLinkedin(channelid, caption, pngBlob, signature) {
  const uploadFd = new FormData();
  uploadFd.append("media", new File([pngBlob], "job-post.png", { type: "image/png" }));
  const upRes = await fetch("/api/upload", { method: "POST", body: uploadFd });
  const upData = await upRes.json().catch(() => ({}));
  if (!upRes.ok || !upData?.ok) throw new Error(upData?.error || "Image upload failed");
  const photoUrl = upData?.files?.[0]?.url;
  if (!photoUrl) throw new Error("Upload succeeded but no media URL returned");
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(photoUrl)) {
    throw new Error(
      "Media URL is localhost. VBOUT/LinkedIn cannot fetch local URLs. Use a public tunnel URL and set PUBLIC_BASE_URL."
    );
  }

  addAutomationTimelineItem("Posting to LinkedIn...");
  const postRes = await fetch("/api/socialmedia/addpost", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      channel: "linkedin",
      channelid,
      sendMode: "immediate",
      mode: "single",
      message: caption,
      photo: photoUrl,
      trackableLinks: false,
    }),
  });
  const postData = await postRes.json().catch(() => ({}));
  if (!postRes.ok || !postData?.ok) {
    throw new Error(postData?.error || "LinkedIn post failed");
  }
  const postId =
    postData?.response?.response?.data?.post_id ||
    postData?.response?.data?.post_id ||
    postData?.data?.post_id;
  addAutomationTimelineItem("Done. LinkedIn post created from template PNG.");
  addAutomationTimelineItem(`Post response: ${formatLogArg(postData.response || postData)}`);

  if (postId) {
    addAutomationTimelineItem(`Verifying post ${postId}...`);
    const verifyRes = await fetch(
      `/api/socialmedia/getpost?id=${encodeURIComponent(postId)}&channel=linkedin`,
      { method: "GET" }
    );
    const verifyData = await verifyRes.json().catch(() => ({}));
    if (verifyRes.ok && verifyData?.ok) {
      addAutomationTimelineItem(`Verification result: ${formatLogArg(verifyData.response || verifyData)}`);
    } else {
      addAutomationTimelineItem(
        `Verification warning: ${verifyData?.error || "Unable to verify post status from VBOUT."}`
      );
    }
  } else {
    addAutomationTimelineItem("Verification skipped: post_id missing in response.");
  }

  automationLastPostedSignature = signature;
}

if (clearAutomationTimelineBtn) {
  clearAutomationTimelineBtn.addEventListener("click", () => {
    clearAutomationTimeline();
    addAutomationTimelineItem("Timeline cleared.");
  });
}

if (cronGenerateBtn) {
  cronGenerateBtn.addEventListener("click", () => {
    buildCronConfigPreview();
    addAutomationTimelineItem("Cron config generated.");
  });
}

if (cronCopyBtn) {
  cronCopyBtn.addEventListener("click", async () => {
    try {
      const text = buildCronConfigPreview();
      await navigator.clipboard.writeText(text);
      addAutomationTimelineItem("Cron config copied to clipboard.");
    } catch {
      addAutomationTimelineItem("Copy failed. Select and copy from the preview box.");
    }
  });
}

if (cronRunNowBtn) {
  cronRunNowBtn.addEventListener("click", async () => {
    try {
      const secret = String(cronSecretInput?.value || "").trim();
      if (!secret) throw new Error("Enter CRON_SECRET first.");
      showStatus("Triggering cron endpoint...");
      addAutomationTimelineItem("Calling /api/automation/run...");
      const res = await fetch("/api/automation/run", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Cron run failed");
      addAutomationTimelineItem(`Cron run success: ${formatLogArg(data.result || data)}`);
      showStatus("Cron run completed.");
    } catch (err) {
      addAutomationTimelineItem(`Cron run error: ${err?.message || String(err)}`);
      showStatus("Cron run failed.");
    }
  });
}

if (runAutomationBtn) {
  runAutomationBtn.addEventListener("click", async () => {
    try {
      runAutomationBtn.disabled = true;
      showStatus("Running one-click automation...");
      await runAutomationOnce();
      showStatus("Automation completed.");
    } catch (err) {
      addAutomationTimelineItem(`Error: ${err?.message || String(err)}`);
      showStatus("Automation failed.");
    } finally {
      runAutomationBtn.disabled = false;
    }
  });
}

if (refreshTemplatePreviewBtn) {
  refreshTemplatePreviewBtn.addEventListener("click", () => {
    renderJobTemplatePreview();
    addAutomationTimelineItem("Preview refreshed.");
  });
}

if (generatePngBtn) {
  generatePngBtn.addEventListener("click", async () => {
    try {
      generatePngBtn.disabled = true;
      automationImagePngBlob = await generateJobTemplatePngBlob();
      if (jobTemplatePreviewMeta) {
        jobTemplatePreviewMeta.textContent = `PNG generated (${Math.round(automationImagePngBlob.size / 1024)} KB).`;
      }
      addAutomationTimelineItem("PNG generated from template.");
    } catch (err) {
      addAutomationTimelineItem(`PNG generation error: ${err?.message || String(err)}`);
    } finally {
      generatePngBtn.disabled = false;
    }
  });
}

if (postAutomationBtn) {
  postAutomationBtn.addEventListener("click", async () => {
    try {
      if (!automationDraft) throw new Error("No draft available. Run automation first.");
      if (automationPostInFlight) throw new Error("Post already in progress.");
      automationPostInFlight = true;
      postAutomationBtn.disabled = true;
      showStatus("Posting draft to LinkedIn...");

      const caption = jobCaptionInput?.value?.trim() || automationDraft.message || "";
      if (!caption) throw new Error("Caption is empty.");
      const signature = `${automationDraft.channelid}::${caption}::${jobApplyLinkInput?.value || ""}`;
      if (automationLastPostedSignature === signature) {
        throw new Error("This exact draft was already posted. Change content before posting again.");
      }

      if (!automationImagePngBlob) {
        addAutomationTimelineItem("No PNG yet; generating PNG automatically...");
        automationImagePngBlob = await generateJobTemplatePngBlob();
      }

      await postImageToLinkedin(automationDraft.channelid, caption, automationImagePngBlob, signature);
      showStatus("Automation post completed.");
    } catch (err) {
      addAutomationTimelineItem(`Post error: ${err?.message || String(err)}`);
      showStatus("Automation post failed.");
    } finally {
      automationPostInFlight = false;
      postAutomationBtn.disabled = false;
    }
  });
}

if (runAutomationTestPostBtn) {
  runAutomationTestPostBtn.addEventListener("click", async () => {
    try {
      if (automationPostInFlight) throw new Error("Post already in progress.");
      automationPostInFlight = true;
      runAutomationTestPostBtn.disabled = true;

      const channelid = automationLinkedinAccountSelect?.value || "";
      if (!channelid) throw new Error("Select a LinkedIn account first.");
      const caption = automationTestCaptionInput?.value?.trim() || "Test image post from automation flow.";
      const signature = `${channelid}::TEST::${caption}`;
      if (automationLastPostedSignature === signature) {
        throw new Error("This same test post was already sent. Change the test caption to post again.");
      }

      showStatus("Running direct test image post...");
      addAutomationTimelineItem("Generating test template PNG...");
      const pngBlob = await generateJobTemplatePngBlob();
      await postImageToLinkedin(channelid, caption, pngBlob, signature);
      showStatus("Test image post completed.");
    } catch (err) {
      addAutomationTimelineItem(`Test post error: ${err?.message || String(err)}`);
      showStatus("Test image post failed.");
    } finally {
      automationPostInFlight = false;
      runAutomationTestPostBtn.disabled = false;
    }
  });
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabName = btn.getAttribute("data-tab");
    showTab(tabName);
  });
});

navLinks.forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const tabName = a.getAttribute("data-tab");
    showTab(tabName);
  });
});

let connectedChannels = [];

function renderAccountsForSelectedChannel() {
  const selectedChannel = connectedChannels.find((c) => c.channel === channelSelect.value);

  accountSelect.innerHTML = "";
  const selectedAccounts = selectedChannel?.accounts || [];

  if (selectedAccounts.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No connected accounts for this channel";
    accountSelect.appendChild(opt);
    channelIdDisplayInput.value = "";
    channelIdHiddenInput.value = "";
    return;
  }

  for (const acc of selectedAccounts) {
    const opt = document.createElement("option");
    opt.value = acc.id;
    opt.textContent = acc.label ? `${acc.label}` : `${acc.id}`;
    if (acc.type) opt.textContent += ` (${acc.type})`;
    accountSelect.appendChild(opt);
  }

  // Auto-select first connected account.
  const first = accountSelect.options[0];
  if (first?.value) {
    accountSelect.value = first.value;
    channelIdDisplayInput.value = first.value;
    channelIdHiddenInput.value = first.value;
  }
}

async function loadConnectedChannels() {
  try {
    const res = await fetch("/api/socialmedia/channels", { method: "GET" });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data?.ok) {
      showStatus(`Warning: could not load connected channels: ${data?.error || "unknown error"}`);
      return;
    }

    connectedChannels = Array.isArray(data.channels) ? data.channels : [];

    // Clear and rebuild channel options.
    channelSelect.innerHTML = "";
    if (connectedChannels.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "No connected channels found";
      channelSelect.appendChild(opt);
      accountSelect.innerHTML = "";
      channelIdDisplayInput.value = "";
      channelIdHiddenInput.value = "";
      populateAutomationLinkedinAccounts();
      return;
    }

    for (const ch of connectedChannels) {
      const opt = document.createElement("option");
      opt.value = ch.channel;
      opt.textContent = ch.name;
      channelSelect.appendChild(opt);
    }

    const first = channelSelect.options[0];
    if (first?.value) channelSelect.value = first.value;
    renderAccountsForSelectedChannel();

    if (calendarChannelsSelect) {
      calendarChannelsSelect.innerHTML = "";
      for (const c of CALENDAR_CHANNELS) {
        const allowed = c === "all" || connectedChannels.some((x) => x.channel === c);
        if (!allowed) continue;
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        calendarChannelsSelect.appendChild(opt);
      }
    }

    if (statsChannelsSelect) {
      statsChannelsSelect.innerHTML = "";
      for (const c of STATS_CHANNELS) {
        const allowed = c === "all" || connectedChannels.some((x) => x.channel === c);
        if (!allowed) continue;
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        statsChannelsSelect.appendChild(opt);
      }
    }
    populateAutomationLinkedinAccounts();
  } catch (err) {
    showStatus(`Warning: could not load connected channels: ${err?.message || String(err)}`);
  }
}

channelSelect.addEventListener("change", () => {
  renderAccountsForSelectedChannel();
});

accountSelect.addEventListener("change", () => {
  const v = accountSelect.value || "";
  channelIdDisplayInput.value = v;
  channelIdHiddenInput.value = v;
});

// Kick off channel loading right away.
loadConnectedChannels();
renderJobTemplatePreview();
buildCronConfigPreview();
showTab("compose");

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseVboutDatetimeToInputs(datetimeText) {
  if (!datetimeText) return null;
  const s = String(datetimeText).trim();

  // Format: YYYY-MM-DD HH:MM:SS or YYYY-MM-DD HH:MM
  let m = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(s);
  if (m) {
    const yyyy = m[1];
    const mm = m[2];
    const dd = m[3];
    const hh = String(m[4]).padStart(2, "0");
    const mi = m[5];
    return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${mi}` };
  }

  // Format: MM/DD/YYYY H:MM AM|PM
  m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(s);
  if (m) {
    const month = String(m[1]).padStart(2, "0");
    const day = String(m[2]).padStart(2, "0");
    const year = m[3];
    const minute = m[5];
    const ampm = m[6].toUpperCase();
    let hour = Number(m[4]);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    const hh = String(hour).padStart(2, "0");
    return { date: `${year}-${month}-${day}`, time: `${hh}:${minute}` };
  }

  return null;
}

function renderPostsList(container, items) {
  if (!container) return;
  container.innerHTML = "";

  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = `<div class="hint">No items found.</div>`;
    return;
  }

  for (const it of items) {
    const id = it?.id ?? it?.ID ?? "";
    const type = it?.type ?? it?.channel ?? "";
    const datetime = it?.datetime ?? it?.scheduleddatetime ?? "";
    const title = it?.title ?? it?.message ?? "";

    const el = document.createElement("div");
    el.className = "mediaBox";
    el.style.marginTop = "10px";
    el.innerHTML = `
      <div style="font-weight:800;margin-bottom:6px;">#${escapeHtml(id || "unknown")} ${type ? `(${escapeHtml(type)})` : ""}</div>
      <div class="hint" style="margin-top:0;">${datetime ? `Datetime: ${escapeHtml(datetime)}` : "Datetime: -"}</div>
      <div style="margin-top:10px;font-weight:650;white-space:pre-wrap;">${title ? escapeHtml(title) : "(no message)"}</div>
    `;
    container.appendChild(el);
  }
}

function parseVboutItemToDateKey(it) {
  const datetime = it?.datetime || it?.scheduleddatetime || "";
  const parsed = parseVboutDatetimeToInputs(datetime);
  if (parsed?.date) return parsed.date; // YYYY-MM-DD
  return null;
}

function renderCalendarMonthGrid(container, items, monthDate) {
  if (!container) return;
  container.innerHTML = "";

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth(); // 0-based
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Convert JS Sunday=0..Saturday=6 into Monday-first index.
  const startWeekday = (firstDay.getDay() + 6) % 7;

  const buckets = new Map();
  for (const it of items) {
    const key = parseVboutItemToDateKey(it);
    if (!key) continue;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(it);
  }

  const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startWeekday + 1;
    const cell = document.createElement("div");
    cell.className = "calendarCell";

    if (dayNum < 1 || dayNum > daysInMonth) {
      cell.style.opacity = "0.45";
      cell.innerHTML = `<div class="calendarDay"><span>-</span></div>`;
      container.appendChild(cell);
      continue;
    }

    const yyyy = String(year);
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(dayNum).padStart(2, "0");
    const key = `${yyyy}-${mm}-${dd}`;

    const dayItems = buckets.get(key) || [];

    const header = document.createElement("div");
    header.className = "calendarDay";
    header.innerHTML = `<span>${dayNum}</span>${dayItems.length ? `<span class="calendarBadge">${dayItems.length}</span>` : ""}`;
    cell.appendChild(header);

    // show up to 3 items
    const max = 3;
    for (const it of dayItems.slice(0, max)) {
      const type = it?.type ?? it?.channel ?? "";
      const title = it?.title ?? it?.message ?? "";
      const itemEl = document.createElement("div");
      itemEl.className = "calendarItem";
      itemEl.textContent = `${type ? `[${type}] ` : ""}${title}`.slice(0, 140);
      cell.appendChild(itemEl);
    }
    if (dayItems.length > max) {
      const more = document.createElement("div");
      more.className = "hint";
      more.style.marginTop = "8px";
      more.textContent = `+${dayItems.length - max} more`;
      cell.appendChild(more);
    }

    container.appendChild(cell);
  }
}

loadCalendarBtn?.addEventListener("click", async () => {
  try {
    showStatus("Loading calendar...");

    const channels = calendarChannelsSelect?.value || "all";
    const sort = calendarSortSelect?.value || "asc";
    const from = calendarFromInput?.value || "none";
    const to = calendarToInput?.value || "none";
    const includeposted = calendarIncludepostedInput?.checked ? "true" : "false";
    const limit = calendarLimitInput?.value || 10;
    const page = calendarPageInput?.value || 1;

    const q = new URLSearchParams({
      channels,
      from,
      to,
      includeposted,
      limit,
      page,
      sort,
    });

    const res = await fetch(`/api/socialmedia/calendar?${q.toString()}`);
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      showStatus(`Error: ${data.error || "Failed to load calendar"}`);
      return;
    }

    const calendar = data.response?.calendar || data.response || {};
    const itemsObj = calendar?.items;
    const items = Array.isArray(itemsObj)
      ? itemsObj
      : itemsObj && typeof itemsObj === "object"
        ? Object.values(itemsObj)
        : [];

    // Render month grid based on current From date if provided; otherwise current month.
    const monthBase = calendarFromInput?.value
      ? new Date(`${calendarFromInput.value}T00:00:00`)
      : new Date();

    if (calendarGrid) {
      calendarGrid.classList.remove("hidden");
      renderCalendarMonthGrid(calendarGrid, items, monthBase);
    }

    // Keep list as a fallback below the grid.
    renderPostsList(calendarList, items);
    showStatus("Calendar loaded.");
  } catch (err) {
    showStatus(`Error: ${err?.message || String(err)}`);
  }
});

loadStatsBtn?.addEventListener("click", async () => {
  try {
    showStatus("Loading stats...");

    const channels = statsChannelsSelect?.value || "all";
    const sort = statsSortSelect?.value || "asc";
    const q = new URLSearchParams({ channels, sort });

    const res = await fetch(`/api/socialmedia/stats?${q.toString()}`);
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      showStatus(`Error: ${data.error || "Failed to load stats"}`);
      return;
    }

    const items = data.response?.stats?.items || data.response?.stats?.items || data.response?.items || [];
    const arr = Array.isArray(items) ? items : Object.values(items || {});

    if (statsList) {
      statsList.innerHTML = "";
      if (!arr.length) {
        statsList.innerHTML = `<div class="hint">No stats items.</div>`;
      } else {
        for (const it of arr) {
          const el = document.createElement("div");
          el.className = "mediaBox";
          el.style.marginTop = "10px";
          el.innerHTML = `<pre style="margin:0;white-space:pre-wrap;">${escapeHtml(JSON.stringify(it, null, 2))}</pre>`;
          statsList.appendChild(el);
        }
      }
    }

    showStatus("Stats loaded.");
  } catch (err) {
    showStatus(`Error: ${err?.message || String(err)}`);
  }
});

function setManageEditorVisible(visible) {
  if (!manageEditor) return;
  manageEditor.classList.toggle("hidden", !visible);
}

function getManageSendMode() {
  const scheduled = document.querySelector('input[name="manageSendMode"]:checked')?.value === "scheduled";
  return scheduled ? "scheduled" : "immediate";
}

loadPostBtn?.addEventListener("click", async () => {
  try {
    const id = managePostIdInput?.value;
    const channel = manageChannelSelect?.value;
    if (!id) {
      showStatus("Enter a Post ID to load.");
      return;
    }

    showStatus("Loading post...");
    const q = new URLSearchParams({ id, channel });
    const res = await fetch(`/api/socialmedia/getpost?${q.toString()}`);
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      showStatus(`Error: ${data.error || "Failed to load post"}`);
      return;
    }

    const item = data.response?.item || data.response?.data?.item || data.response?.item || {};
    const message = item?.title || item?.message || "";
    const datetime = item?.datetime || "";

    manageMessageTextarea.value = message;

    const parsed = parseVboutDatetimeToInputs(datetime);
    const scheduledRadio = document.querySelector('input[name="manageSendMode"][value="scheduled"]');
    const immediateRadio = document.querySelector('input[name="manageSendMode"][value="immediate"]');

    if (parsed) {
      if (scheduledRadio) scheduledRadio.checked = true;
      if (immediateRadio) immediateRadio.checked = false;
      manageScheduledDateInput.value = parsed.date;
      manageScheduledTimeInput.value = parsed.time;
    } else {
      if (immediateRadio) immediateRadio.checked = true;
      if (scheduledRadio) scheduledRadio.checked = false;
      if (manageScheduledDateInput) manageScheduledDateInput.value = "";
      if (manageScheduledTimeInput) manageScheduledTimeInput.value = "";
    }

    if (manageInfo) {
      manageInfo.textContent = datetime ? `Loaded datetime: ${datetime}` : "Post loaded (datetime not found).";
    }

    setManageEditorVisible(true);
    showStatus("Post loaded.");
  } catch (err) {
    showStatus(`Error: ${err?.message || String(err)}`);
  }
});

deletePostBtn?.addEventListener("click", async () => {
  try {
    const id = managePostIdInput?.value;
    const channel = manageChannelSelect?.value;
    if (!id) {
      showStatus("Enter a Post ID to delete.");
      return;
    }

    showStatus("Deleting post...");
    const res = await fetch("/api/socialmedia/deletepost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, channel }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      showStatus(`Error: ${data.error || "Failed to delete post"}`);
      return;
    }

    setManageEditorVisible(false);
    if (manageInfo) manageInfo.textContent = "Delete requested. Check VBOUT response.";
    showStatus("Delete done.");
  } catch (err) {
    showStatus(`Error: ${err?.message || String(err)}`);
  }
});

updatePostBtn?.addEventListener("click", async () => {
  try {
    const id = managePostIdInput?.value;
    const channel = manageChannelSelect?.value;
    const message = manageMessageTextarea?.value || "";
    if (!id || !message.trim()) {
      showStatus("Enter Post ID and message.");
      return;
    }

    const mode = getManageSendMode();
    const payload = { id, channel, message };

    if (mode === "scheduled") {
      const d = manageScheduledDateInput?.value;
      const t = manageScheduledTimeInput?.value;
      if (!d || !t) {
        showStatus("Scheduled mode selected; pick scheduled date and time.");
        return;
      }
      payload.scheduleddatetime = `${d} ${t}:00`;
    }

    showStatus("Updating post...");
    const res = await fetch("/api/socialmedia/editpost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      showStatus(`Error: ${data.error || "Failed to update post"}`);
      return;
    }

    if (manageInfo) manageInfo.textContent = "Update requested. Check VBOUT response.";
    showStatus("Update done.");
  } catch (err) {
    showStatus(`Error: ${err?.message || String(err)}`);
  }
});

function setThreadModeUI(enabled) {
  threadModeCheckbox.checked = enabled;

  if (enabled) {
    singleMessageBlock.classList.add("hidden");
    threadBlock.classList.remove("hidden");

    const messageEl = document.getElementById("message");
    if (messageEl) messageEl.required = false;

    // Ensure at least 2 items for a sequence.
    if (!tweetList.querySelector("textarea[data-thread-item]")) {
      tweetList.innerHTML = "";
      addTweetItem("Tweet 1...");
      addTweetItem("Tweet 2...");
    }
  } else {
    singleMessageBlock.classList.remove("hidden");
    threadBlock.classList.add("hidden");

    const messageEl = document.getElementById("message");
    if (messageEl) messageEl.required = true;
  }
}

function addTweetItem(initialValue = "") {
  const existing = tweetList.querySelectorAll("textarea[data-thread-item]").length;
  if (existing >= 10) return;

  const wrapper = document.createElement("div");
  wrapper.className = "tweetListItem";
  wrapper.style.marginTop = "10px";

  const label = document.createElement("div");
  label.className = "hint";
  label.style.fontWeight = "700";
  label.style.marginTop = "0";
  label.textContent = `Item ${existing + 1}`;

  const textarea = document.createElement("textarea");
  textarea.dataset.threadItem = "true";
  textarea.placeholder = `Item ${existing + 1} message`;
  textarea.value = initialValue;
  textarea.required = true;

  wrapper.appendChild(label);
  wrapper.appendChild(textarea);
  tweetList.appendChild(wrapper);
}

addTweetBtn.addEventListener("click", () => addTweetItem(""));
removeTweetBtn.addEventListener("click", () => {
  const items = tweetList.querySelectorAll("textarea[data-thread-item]");
  if (items.length <= 2) return;
  const last = items[items.length - 1];
  last.closest(".tweetListItem")?.remove();
});

threadModeCheckbox.addEventListener("change", () => {
  setThreadModeUI(threadModeCheckbox.checked);
});

// Initialize default UI state.
setThreadModeUI(false);

function setMediaPreviewFromFile(file) {
  if (!file) {
    mediaPreview.textContent = "No media selected.";
    return;
  }

  const type = file.type || "";
  if (type.startsWith("image/")) {
    mediaPreview.textContent = `Selected image: ${file.name}`;
  } else if (type.startsWith("video/")) {
    mediaPreview.textContent = `Selected video: ${file.name}`;
  } else {
    mediaPreview.textContent = `Selected media: ${file.name}`;
  }
}

function setMediaPreviewSummary(filesCount, uploadedCount) {
  if (!filesCount) {
    mediaPreview.textContent = "No media selected.";
    return;
  }
  if (uploadedCount >= filesCount) {
    mediaPreview.textContent = `Selected ${filesCount} file(s). Uploaded ${uploadedCount}.`;
  } else {
    mediaPreview.textContent = `Selected ${filesCount} file(s). Uploading... (${uploadedCount}/${filesCount})`;
  }
}

function clearMedia() {
  mediaFileInput.value = "";
  photoUrlInput.value = "";
  photoHiddenInput.value = "";
  setMediaPreviewFromFile(null);
  if (mediaGrid) {
    mediaGrid.innerHTML = "";
    mediaGrid.classList.add("hidden");
  }
  uploadedMedia = [];
  primaryMediaIndex = 0;
  localMedia = [];
  updatePreview();
}

clearMediaBtn.addEventListener("click", clearMedia);

async function uploadMediaFile(file) {
  const formData = new FormData();
  formData.append("media", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Upload failed");
  }
  // New API returns { files: [{url,...}] }
  const url = data?.files?.[0]?.url;
  if (!url) throw new Error("Upload succeeded but no URL returned");
  return url;
}

async function handlePickedFiles(files) {
  const picked = Array.isArray(files) ? files : [];
  if (!picked.length) return;

  const onlyMedia = picked.filter((f) => {
    const t = f?.type || "";
    return t.startsWith("image/") || t.startsWith("video/");
  });

  if (!onlyMedia.length) {
    showStatus("No valid media files detected (image/*, video/*).");
    return;
  }

  // Clear URL input if user chose local media.
  photoUrlInput.value = "";

  // Show local previews immediately (before upload).
  if (mediaGrid) {
    mediaGrid.innerHTML = "";
    mediaGrid.classList.remove("hidden");
  }

  localMedia = [];
  uploadedMedia = [];
  primaryMediaIndex = 0;

  setMediaPreviewSummary(onlyMedia.length, 0);
  showStatus("Uploading media...");

  // Upload all files in one request for better UX.
  const fd = new FormData();
  for (const f of onlyMedia) fd.append("media", f);

  // Render local preview tiles immediately.
  const tileEls = [];
  for (const file of onlyMedia) {
    let objectUrl;
    try {
      objectUrl = URL.createObjectURL(file);
    } catch {
      objectUrl = null;
    }

    const tile = document.createElement("div");
    tile.className = "mediaTile";

    const type = file.type || "";
    if (objectUrl && type.startsWith("image/")) {
      const img = document.createElement("img");
      img.className = "mediaThumb";
      img.src = objectUrl;
      img.alt = file.name;
      tile.appendChild(img);
    } else if (objectUrl && type.startsWith("video/")) {
      const vid = document.createElement("video");
      vid.className = "mediaThumb";
      vid.src = objectUrl;
      vid.muted = true;
      vid.playsInline = true;
      vid.controls = true;
      tile.appendChild(vid);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "mediaThumb";
      placeholder.style.display = "flex";
      placeholder.style.alignItems = "center";
      placeholder.style.justifyContent = "center";
      placeholder.textContent = "Preview unavailable";
      tile.appendChild(placeholder);
    }

    const meta = document.createElement("div");
    meta.className = "mediaMeta";
    const name = document.createElement("div");
    name.className = "mediaName";
    name.textContent = file.name;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn ghost";
    removeBtn.style.marginTop = "0";
    removeBtn.style.padding = "6px 10px";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      clearMedia();
      showStatus("Media cleared. Re-select files to upload.");
    });

    meta.appendChild(name);
    meta.appendChild(removeBtn);
    tile.appendChild(meta);
    mediaGrid && mediaGrid.appendChild(tile);
    tileEls.push(tile);

    localMedia.push({
      objectUrl,
      mimeType: type,
      name: file.name,
    });
  }

  const upRes = await fetch("/api/upload", { method: "POST", body: fd });
  const upData = await upRes.json().catch(() => ({}));
  if (!upRes.ok || !upData.ok) throw new Error(upData.error || "Upload failed");

  const returned = Array.isArray(upData.files) ? upData.files : [];
  uploadedMedia = returned.map((f) => ({
    url: f.url,
    mimeType: f.mimeType || "",
    name: f.originalName || "",
  }));

  setMediaPreviewSummary(onlyMedia.length, uploadedMedia.length);

  function setPrimary(idx) {
    primaryMediaIndex = idx;
    const url = uploadedMedia[idx]?.url || "";
    photoHiddenInput.value = url;
    tileEls.forEach((el, i) => el.classList.toggle("selected", i === idx));
    updatePreview();
  }

  tileEls.forEach((el, idx) => {
    el.addEventListener("click", () => setPrimary(idx));
    el.style.cursor = "pointer";
    el.title = "Click to set as primary attachment";
  });

  tileEls.forEach((el, idx) => el.classList.toggle("selected", idx === 0));
  updatePreview();

  setPrimary(0);
  showStatus("Media uploaded. Ready to post.");
}

mediaFileInput.addEventListener("change", async () => {
  try {
    const files = Array.from(mediaFileInput.files || []);
    if (!files.length) return;
    await handlePickedFiles(files);
    return;

    // Clear URL input if user chose local media.
    photoUrlInput.value = "";

    // Show local previews immediately (before upload).
    if (mediaGrid) {
      mediaGrid.innerHTML = "";
      mediaGrid.classList.remove("hidden");
    }

    localMedia = [];
    uploadedMedia = [];
    primaryMediaIndex = 0;

    let uploadedCount = 0;
    setMediaPreviewSummary(files.length, uploadedCount);
    showStatus("Uploading media...");

    // Upload all files in one request for better UX.
    const fd = new FormData();
    for (const f of files) fd.append("media", f);

    // Render local preview tiles immediately.
    const tileEls = [];
    for (const file of files) {
      // Tile
      let objectUrl;
      try {
        objectUrl = URL.createObjectURL(file);
      } catch {
        objectUrl = null;
      }

      const tile = document.createElement("div");
      tile.className = "mediaTile";

      const type = file.type || "";
      if (objectUrl && type.startsWith("image/")) {
        const img = document.createElement("img");
        img.className = "mediaThumb";
        img.src = objectUrl;
        img.alt = file.name;
        tile.appendChild(img);
      } else if (objectUrl && type.startsWith("video/")) {
        const vid = document.createElement("video");
        vid.className = "mediaThumb";
        vid.src = objectUrl;
        vid.muted = true;
        vid.playsInline = true;
        vid.controls = true;
        tile.appendChild(vid);
      } else {
        const placeholder = document.createElement("div");
        placeholder.className = "mediaThumb";
        placeholder.style.display = "flex";
        placeholder.style.alignItems = "center";
        placeholder.style.justifyContent = "center";
        placeholder.textContent = "Preview unavailable";
        tile.appendChild(placeholder);
      }

      const meta = document.createElement("div");
      meta.className = "mediaMeta";
      const name = document.createElement("div");
      name.className = "mediaName";
      name.textContent = file.name;

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn ghost";
      removeBtn.style.marginTop = "0";
      removeBtn.style.padding = "6px 10px";
      removeBtn.textContent = "Remove";

      // Removing after selection: easiest UX is to clear all and re-select, so we just clear.
      removeBtn.addEventListener("click", () => {
        clearMedia();
        showStatus("Media cleared. Re-select files to upload.");
      });

      meta.appendChild(name);
      meta.appendChild(removeBtn);
      tile.appendChild(meta);
      mediaGrid && mediaGrid.appendChild(tile);
      tileEls.push(tile);

      localMedia.push({
        objectUrl,
        mimeType: type,
        name: file.name,
      });
    }

    const upRes = await fetch("/api/upload", { method: "POST", body: fd });
    const upData = await upRes.json().catch(() => ({}));
    if (!upRes.ok || !upData.ok) throw new Error(upData.error || "Upload failed");

    const returned = Array.isArray(upData.files) ? upData.files : [];
    uploadedMedia = returned.map((f) => ({
      url: f.url,
      mimeType: f.mimeType || "",
      name: f.originalName || "",
    }));

    uploadedCount = uploadedMedia.length;
    setMediaPreviewSummary(files.length, uploadedCount);

    // Choose a “primary” attachment (first by default). User can click tiles to change.
    function setPrimary(idx) {
      primaryMediaIndex = idx;
      const url = uploadedMedia[idx]?.url || "";
      photoHiddenInput.value = url;
      tileEls.forEach((el, i) => el.classList.toggle("selected", i === idx));
      updatePreview();
    }

    tileEls.forEach((el, idx) => {
      el.addEventListener("click", () => setPrimary(idx));
      el.style.cursor = "pointer";
      el.title = "Click to set as primary attachment";
    });

    // While uploading (or if VBOUT needs the public URL), show local preview immediately using the selected tile.
    tileEls.forEach((el, idx) => el.classList.toggle("selected", idx === 0));
    updatePreview();

    setPrimary(0);
    showStatus("Media uploaded. Ready to post.");
  } catch (err) {
    clearMedia();
    showStatus(`Media upload error: ${err?.message || String(err)}`);
  }
});

function setupMediaDropzone() {
  if (!mediaDrop) return;

  function openPicker() {
    if (mediaFileInput) mediaFileInput.click();
  }

  mediaPickBtn?.addEventListener("click", openPicker);
  mediaDrop.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.closest && target.closest("button")) return;
    openPicker();
  });
  mediaDrop.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  });

  mediaDrop.addEventListener("dragover", (e) => {
    e.preventDefault();
    mediaDrop.classList.add("dragover");
  });
  mediaDrop.addEventListener("dragleave", () => mediaDrop.classList.remove("dragover"));
  mediaDrop.addEventListener("drop", async (e) => {
    e.preventDefault();
    mediaDrop.classList.remove("dragover");
    const dt = e.dataTransfer;
    const files = Array.from(dt?.files || []);
    try {
      await handlePickedFiles(files);
    } catch (err) {
      showStatus(`Media upload error: ${err?.message || String(err)}`);
    }
  });
}

setupMediaDropzone();

let localMedia = [];
let uploadedMedia = [];
let primaryMediaIndex = 0;

function updatePreview() {
  if (previewChannelBadge) previewChannelBadge.textContent = channelSelect.value || "—";
  if (previewText) {
    const threadEnabled = threadModeCheckbox.checked;
    if (threadEnabled) {
      const first = tweetList?.querySelector("textarea[data-thread-item]")?.value || "";
      previewText.textContent = first || "Add messages to preview…";
    } else {
      previewText.textContent = form.message?.value || "Write a message to preview…";
    }
  }

  if (previewMedia) {
    previewMedia.innerHTML = "";

    // Prefer showing all selected media (uploaded or local). Fallback to remote URL.
    const items =
      (uploadedMedia && uploadedMedia.length
        ? uploadedMedia.map((m) => ({ src: m.url, mimeType: m.mimeType, name: m.name, kind: "uploaded" }))
        : localMedia && localMedia.length
          ? localMedia.map((m) => ({ src: m.objectUrl, mimeType: m.mimeType, name: m.name, kind: "local" }))
          : []);

    if (!items.length) {
      const url = photoUrlInput.value || "";
      if (!url) {
        const hint = document.createElement("div");
        hint.className = "hint";
        hint.textContent = "No media";
        previewMedia.appendChild(hint);
        return;
      }
      items.push({ src: url, mimeType: "", name: "remote", kind: "remote" });
    }

    // Show primary media large; show the rest as mini thumbnails below.
    const primary = items[Math.min(primaryMediaIndex, items.length - 1)];
    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "100%";

    const isVideo = (mime, src) => {
      if (mime && String(mime).startsWith("video/")) return true;
      const lower = String(src || "").toLowerCase();
      return (
        lower.endsWith(".mp4") ||
        lower.endsWith(".mov") ||
        lower.endsWith(".webm") ||
        lower.endsWith(".m4v") ||
        lower.endsWith(".avi") ||
        lower.endsWith(".mkv")
      );
    };

    if (isVideo(primary.mimeType, primary.src)) {
      const vid = document.createElement("video");
      vid.src = primary.src;
      vid.controls = true;
      vid.playsInline = true;
      container.appendChild(vid);
    } else {
      const img = document.createElement("img");
      img.src = primary.src;
      img.alt = primary.name ? `Preview: ${primary.name}` : "Preview";
      container.appendChild(img);
    }

    previewMedia.appendChild(container);
  }
}

form.message?.addEventListener("input", updatePreview);
photoUrlInput?.addEventListener("input", () => {
  // If user pastes a URL, prefer that and clear uploads.
  if (photoUrlInput.value) {
    photoHiddenInput.value = "";
    if (mediaGrid) {
      mediaGrid.innerHTML = "";
      mediaGrid.classList.add("hidden");
    }
  }
  updatePreview();
});

threadModeCheckbox?.addEventListener("change", updatePreview);
tweetList?.addEventListener("input", updatePreview);
channelSelect?.addEventListener("change", updatePreview);
accountSelect?.addEventListener("change", updatePreview);

let calendarMonthBase = new Date();
function setCalendarMonthBaseFromInputs() {
  if (calendarFromInput?.value) calendarMonthBase = new Date(`${calendarFromInput.value}T00:00:00`);
}

function formatMonthTitle(d) {
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

function bumpMonth(delta) {
  calendarMonthBase = new Date(calendarMonthBase.getFullYear(), calendarMonthBase.getMonth() + delta, 1);
  if (calendarTitle) calendarTitle.textContent = formatMonthTitle(calendarMonthBase);
  if (calendarFromInput) calendarFromInput.value = `${calendarMonthBase.getFullYear()}-${String(calendarMonthBase.getMonth()+1).padStart(2,"0")}-01`;
  if (calendarToInput) {
    const last = new Date(calendarMonthBase.getFullYear(), calendarMonthBase.getMonth()+1, 0);
    calendarToInput.value = `${last.getFullYear()}-${String(last.getMonth()+1).padStart(2,"0")}-${String(last.getDate()).padStart(2,"0")}`;
  }
}

calPrevBtn?.addEventListener("click", () => bumpMonth(-1));
calNextBtn?.addEventListener("click", () => bumpMonth(1));

// Initialize preview + calendar title.
updatePreview();
if (calendarTitle) calendarTitle.textContent = formatMonthTitle(calendarMonthBase);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  showStatus("Submitting...");

  const selected = form.querySelector('input[name="sendMode"]:checked');
  const sendMode = selected ? selected.value : "immediate";

  const basePhoto = photoHiddenInput.value || photoUrlInput.value || undefined;
  const trackableLinks = form.trackableLinks.checked;

  const threadEnabled = threadModeCheckbox.checked;

  const payload = {
    channel: form.channel.value,
    channelid: channelIdHiddenInput.value,
    photo: basePhoto,
    trackableLinks,
    sendMode,
    mode: threadEnabled ? "thread" : "single",
  };

  if (threadEnabled) {
    const messages = Array.from(tweetList.querySelectorAll("textarea[data-thread-item]"))
      .map((t) => t.value.trim())
      .filter((v) => v.length > 0);

    const intervalMinutes = Number(threadIntervalMinutesInput.value || 2);
    payload.thread = {
      messages,
      intervalMinutes,
    };
  } else {
    payload.message = form.message.value;
  }

  if (sendMode === "scheduled") {
    payload.scheduledDate = form.scheduledDate.value;
    payload.scheduledTime = form.scheduledTime.value;
  }

  try {
    const res = await fetch("/api/socialmedia/addpost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      showStatus(`Error: ${data.error || "Request failed"}`);
      return;
    }

    showStatus(`Success. VBOUT response:\n${JSON.stringify(data.response, null, 2)}`);
  } catch (err) {
    showStatus(`Error: ${err?.message || String(err)}`);
  }
});

