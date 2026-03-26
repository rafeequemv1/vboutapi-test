const path = require("path");
const express = require("express");
const { z } = require("zod");

const {
  addPost,
  getChannels,
  getCalendar,
  getStats,
  getPost,
  editPost,
  deletePost,
  ALLOWED_CHANNELS,
  ALLOWED_CALENDAR_CHANNELS,
  ALLOWED_STATS_CHANNELS,
} = require("../vbout/socialMedia");

function parseTimeForVBOUT(time24) {
  // Expects "HH:MM" (24h) and converts it to scheduledhours + scheduledampm.
  const match = /^(\d{2}):(\d{2})$/.exec(time24 || "");
  if (!match) throw new Error("scheduledTime must be in HH:MM format.");

  const hh = Number(match[1]);
  const mm = match[2];
  if (hh < 0 || hh > 23) throw new Error("scheduledTime hour out of range.");

  const ampm = hh >= 12 ? "PM" : "AM";
  const hour12 = ((hh + 11) % 12) + 1; // 0 -> 12, 12 -> 12

  // VBOUT uses `scheduledhours` + `scheduledampm`. The docs are ambiguous about minutes,
  // so we send "h:mm" to preserve the user input.
  return {
    scheduledhours: `${hour12}:${mm}`,
    scheduledampm: ampm,
  };
}

function toVBoutDate(dateStr) {
  // Accepts "YYYY-MM-DD" (from <input type="date">). VBOUT also accepts "Y-m-d".
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr || "");
  if (!match) throw new Error("scheduledDate must be in YYYY-MM-DD format.");
  return dateStr;
}

const schema = z
  .object({
    channel: z.enum(ALLOWED_CHANNELS),
    channelid: z.union([z.string(), z.number()]),
    photo: z
      .string()
      .url()
      .optional()
      .or(z.literal("").transform(() => undefined)),
    trackableLinks: z
      .union([z.boolean(), z.string()])
      .optional()
      .transform((v) => {
        if (v === undefined) return undefined;
        if (typeof v === "boolean") return v;
        const s = String(v).toLowerCase();
        if (s === "true") return true;
        if (s === "false") return false;
        return undefined;
      }),
    sendMode: z.enum(["immediate", "scheduled"]),
    mode: z.enum(["single", "thread"]).default("single"),
    message: z.string().min(1).max(5000).optional(),
    scheduledDate: z.string().optional(),
    scheduledTime: z.string().optional(),
    thread: z
      .object({
        messages: z.array(z.string().min(1).max(5000)).min(1).max(10),
        intervalMinutes: z.number().int().min(1).max(120).default(2),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.sendMode === "scheduled") {
      if (!data.scheduledDate) ctx.addIssue({ code: "custom", message: "scheduledDate is required" });
      if (!data.scheduledTime) ctx.addIssue({ code: "custom", message: "scheduledTime is required" });
    }

    if (data.mode === "single") {
      if (!data.message) ctx.addIssue({ code: "custom", message: "message is required for mode=single" });
    }

    if (data.mode === "thread") {
      if (!data.thread?.messages?.length) {
        ctx.addIssue({ code: "custom", message: "thread.messages is required for mode=thread" });
      }
    }
  });

const router = express.Router();

// GET / -> return the UI entry (client-side will post to the API).
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

router.get("/api/socialmedia/channels", async (req, res) => {
  try {
    const channelsResp = await getChannels();
    const rawChannels =
      channelsResp?.response?.data?.channels ||
      channelsResp?.data?.channels ||
      channelsResp?.channels ||
      {};

    const pickId = (v) => {
      if (v === undefined || v === null) return undefined;
      const s = String(v);
      return s.length ? s : undefined;
    };

    const buildAccounts = (arr, labelKey, extraFields = {}) => {
      if (!Array.isArray(arr)) return [];
      return arr
        .map((a) => {
          const id = pickId(a?.id);
          if (!id) return undefined;
          const label =
            (labelKey && a && a[labelKey] ? String(a[labelKey]) : undefined) ||
            (a?.name ? String(a.name) : undefined) ||
            (a?.screenname ? String(a.screenname) : undefined) ||
            id;
          return { id, label, ...extraFields, raw: a };
        })
        .filter(Boolean);
    };

    const normalized = Object.entries(rawChannels)
      .map(([name, obj]) => {
        const channel = String(name).toLowerCase().replace(/\s+/g, "");
        if (!ALLOWED_CHANNELS.includes(channel)) return undefined;

        // Best-effort account mapping from VBOUT `SocialMedia/Channels`.
        // Each channel has different arrays (`pages`, `profiles`, `companies`, ...).
        const accounts = [
          ...(channel === "facebook"
            ? buildAccounts(obj?.pages, "name", { type: "page" })
            : []),
          ...(channel === "twitter" ? buildAccounts(obj?.profiles, "name", { type: "profile" }) : []),
          ...(channel === "linkedin"
            ? [
                ...buildAccounts(obj?.profiles, "name", { type: "profile" }),
                ...buildAccounts(obj?.companies, "name", { type: "company" }),
              ]
            : []),
          ...(channel === "pinterest"
            ? [
                ...buildAccounts(obj?.profiles, "name", { type: "profile" }),
                ...buildAccounts(obj?.boards, "name", { type: "board" }),
              ]
            : []),
          ...(channel === "instagram" ? buildAccounts(obj?.profiles, "name", { type: "profile" }) : []),
        ].slice(0, 200);

        return { channel, name, accounts };
      })
      .filter(Boolean);

    res.json({ ok: true, channels: normalized, response: channelsResp });
  } catch (err) {
    const status = err?.status && Number(err.status) ? err.status : 500;
    res.status(status).json({
      ok: false,
      error: err?.message || "Failed to fetch channels",
    });
  }
});

const calendarQuerySchema = z.object({
  channels: z
    .enum(ALLOWED_CALENDAR_CHANNELS)
    .optional()
    .default("all"),
  from: z.string().optional().default("none"),
  to: z.string().optional().default("none"),
  includeposted: z
    .preprocess((v) => {
      if (v === true || v === false) return v;
      const s = String(v).toLowerCase();
      if (s === "true") return true;
      if (s === "false") return false;
      return undefined;
    }, z.boolean().optional().default(false)),
  limit: z.coerce.number().int().min(1).max(200).optional().default(10),
  page: z.coerce.number().int().min(1).optional().default(1),
  sort: z.enum(["asc", "desc"]).optional().default("asc"),
});

const statsQuerySchema = z.object({
  channels: z.enum(ALLOWED_STATS_CHANNELS).optional().default("all"),
  sort: z.enum(["asc", "desc"]).optional().default("asc"),
});

router.get("/api/socialmedia/calendar", async (req, res) => {
  try {
    const q = calendarQuerySchema.parse(req.query || {});
    const resp = await getCalendar(q);
    res.json({ ok: true, response: resp });
  } catch (err) {
    const message = err?.message || "Failed to load calendar";
    res.status(400).json({ ok: false, error: message });
  }
});

router.get("/api/socialmedia/stats", async (req, res) => {
  try {
    const q = statsQuerySchema.parse(req.query || {});
    const resp = await getStats(q);
    res.json({ ok: true, response: resp });
  } catch (err) {
    const message = err?.message || "Failed to load stats";
    res.status(400).json({ ok: false, error: message });
  }
});

router.get("/api/socialmedia/getpost", async (req, res) => {
  try {
    const id = z.coerce.number().int().min(1).parse(req.query.id);
    const channel = z.enum(ALLOWED_CHANNELS).parse(req.query.channel);

    const resp = await getPost({ id, channel });
    res.json({ ok: true, response: resp });
  } catch (err) {
    const message = err?.message || "Failed to load post";
    res.status(400).json({ ok: false, error: message });
  }
});

router.post("/api/socialmedia/editpost", async (req, res) => {
  try {
    const body = z
      .object({
        id: z.coerce.number().int().min(1),
        channel: z.enum(ALLOWED_CHANNELS),
        message: z.string().min(1).max(5000),
        // VBOUT uses `scheduleddatetime` with format: ISO-8601 (Y-m-d H:i:s)
        scheduleddatetime: z.string().optional(),
      })
      .parse(req.body || {});

    const resp = await editPost(body);
    res.json({ ok: true, response: resp });
  } catch (err) {
    const message = err?.message || "Failed to edit post";
    res.status(400).json({ ok: false, error: message, details: err?.response });
  }
});

router.post("/api/socialmedia/deletepost", async (req, res) => {
  try {
    const body = z
      .object({
        id: z.coerce.number().int().min(1),
        channel: z.enum(ALLOWED_CHANNELS),
      })
      .parse(req.body || {});

    const resp = await deletePost(body);
    res.json({ ok: true, response: resp });
  } catch (err) {
    const message = err?.message || "Failed to delete post";
    res.status(400).json({ ok: false, error: message });
  }
});

router.post("/api/socialmedia/addpost", async (req, res) => {
  try {
    const body = schema.parse(req.body || {});

    const photo = body.photo;
    const trackableLinks = body.trackableLinks;

    const isScheduled = body.sendMode === "scheduled";

    function scheduledFieldsFromDate(dt) {
      const year = dt.getFullYear();
      const month = String(dt.getMonth() + 1).padStart(2, "0");
      const day = String(dt.getDate()).padStart(2, "0");
      const scheduleddate = `${year}-${month}-${day}`;

      const hh = dt.getHours();
      const mm = String(dt.getMinutes()).padStart(2, "0");
      const ampm = hh >= 12 ? "PM" : "AM";
      const hour12 = ((hh + 11) % 12) + 1;

      return {
        scheduleddate,
        scheduledhours: `${hour12}:${mm}`,
        scheduledampm: ampm,
      };
    }

    function baseDateTime() {
      const [y, m, d] = String(body.scheduledDate).split("-").map(Number);
      const [hh, mm] = String(body.scheduledTime).split(":").map(Number);
      return new Date(y, m - 1, d, hh, mm, 0, 0);
    }

    if (body.mode === "thread") {
      const interval = body.thread?.intervalMinutes || 2;
      const messages = body.thread?.messages || [];

      const results = [];
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];

        let scheduleddate;
        let scheduledhours;
        let scheduledampm;
        if (isScheduled) {
          const dt = new Date(baseDateTime().getTime() + i * interval * 60 * 1000);
          const fields = scheduledFieldsFromDate(dt);
          scheduleddate = fields.scheduleddate;
          scheduledhours = fields.scheduledhours;
          scheduledampm = fields.scheduledampm;
        }

        // `addPost` sets isscheduled=false automatically when isScheduled=false.
        const vboutResp = await addPost({
          message,
          channel: body.channel,
          channelid: body.channelid,
          photo,
          isScheduled,
          scheduleddate,
          scheduledhours,
          scheduledampm,
          trackableLinks,
        });

        results.push(vboutResp);
      }

      res.json({ ok: true, response: results });
      return;
    }

    // mode=single
    const scheduleddate = isScheduled ? toVBoutDate(body.scheduledDate) : undefined;
    const { scheduledhours, scheduledampm } = isScheduled
      ? parseTimeForVBOUT(body.scheduledTime)
      : { scheduledhours: undefined, scheduledampm: undefined };

    const vboutResp = await addPost({
      message: body.message,
      channel: body.channel,
      channelid: body.channelid,
      photo,
      isScheduled,
      scheduleddate,
      scheduledhours,
      scheduledampm,
      trackableLinks,
    });

    res.json({ ok: true, response: vboutResp });
  } catch (err) {
    const status = err?.status && Number(err.status) ? err.status : 400;
    const message = err?.message || "Request failed";
    res.status(status).json({
      ok: false,
      error: message,
      details: err?.response,
    });
  }
});

module.exports = { router };

