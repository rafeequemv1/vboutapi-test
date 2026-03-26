const { createVboutClient } = require("./client");

function ensureEnum(value, allowed, fieldName) {
  if (!allowed.includes(value)) {
    throw new Error(`${fieldName} must be one of: ${allowed.join(", ")}`);
  }
}

const ALLOWED_CHANNELS = ["facebook", "twitter", "linkedin", "pinterest", "instagram"];

const ALLOWED_CALENDAR_CHANNELS = ["all", "facebook", "twitter", "linkedin"];

const ALLOWED_STATS_CHANNELS = ["all", "facebook", "twitter", "linkedin", "pinterest"];

function ensureOneOf(value, allowed, fieldName) {
  if (!allowed.includes(value)) {
    throw new Error(`${fieldName} must be one of: ${allowed.join(", ")}`);
  }
}

/**
 * @param {object} args
 * @param {string} args.message
 * @param {string} args.channel
 * @param {number|string} args.channelid
 * @param {string=} args.photo
 * @param {boolean=} args.isScheduled
 * @param {string=} args.scheduleddate (m/d/Y or Y-m-d)
 * @param {string|number=} args.scheduledhours (1-12)
 * @param {string=} args.scheduledampm (AM|PM)
 * @param {boolean=} args.trackableLinks
 */
async function addPost(args) {
  const {
    message,
    channel,
    channelid,
    photo,
    isScheduled,
    scheduleddate,
    scheduledhours,
    scheduledampm,
    trackableLinks,
  } = args;

  ensureEnum(channel, ALLOWED_CHANNELS, "channel");
  if (channelid === undefined || channelid === null || channelid === "") {
    throw new Error("channelid is required (numeric).");
  }

  const vbout = createVboutClient();

  const params = {
    message,
    channel,
    channelid: String(channelid),
  };

  if (photo) params.photo = photo;
  if (typeof trackableLinks === "boolean") params.trackableLinks = trackableLinks;

  if (isScheduled) {
    params.isscheduled = true;
    if (!scheduleddate) throw new Error("scheduleddate is required when isScheduled=true");
    if (!scheduledhours) throw new Error("scheduledhours is required when isScheduled=true");
    if (!scheduledampm) throw new Error("scheduledampm is required when isScheduled=true");
    params.scheduleddate = scheduleddate;
    params.scheduledhours = String(scheduledhours);
    params.scheduledampm = String(scheduledampm).toUpperCase();
  } else {
    params.isscheduled = false;
  }

  // Endpoint per VBOUT docs.
  return vbout.post("socialmedia/addpost.json", params);
}

async function getChannels() {
  const vbout = createVboutClient();
  return vbout.get("socialmedia/channels.json", {});
}

async function getCalendar(args) {
  const { channels = "all", from, to, includeposted = false, limit = 10, page = 1, sort = "asc" } =
    args || {};

  ensureOneOf(channels, ALLOWED_CALENDAR_CHANNELS, "channels");
  ensureOneOf(sort, ["asc", "desc"], "sort");

  const vbout = createVboutClient();
  // Docs show POST for calendar requests.
  return vbout.post("socialmedia/calendar.json", {
    channels,
    from,
    to,
    includeposted,
    limit,
    page,
    sort,
  });
}

async function getStats(args) {
  const { channels = "all", sort = "asc" } = args || {};

  ensureOneOf(channels, ALLOWED_STATS_CHANNELS, "channels");
  ensureOneOf(sort, ["asc", "desc"], "sort");

  const vbout = createVboutClient();
  // Docs show GET for stats requests.
  return vbout.get("socialmedia/stats.json", { channels, sort });
}

async function getPost(args) {
  const { id, channel } = args || {};
  ensureEnum(channel, ALLOWED_CHANNELS, "channel");
  if (id === undefined || id === null || id === "") throw new Error("id is required");

  const vbout = createVboutClient();
  return vbout.get("socialmedia/getpost.json", { id, channel });
}

async function editPost(args) {
  const { id, channel, message, scheduleddatetime } = args || {};
  ensureEnum(channel, ALLOWED_CHANNELS, "channel");
  if (id === undefined || id === null || id === "") throw new Error("id is required");
  if (!message) throw new Error("message is required");

  const vbout = createVboutClient();
  const params = {
    id,
    channel,
    message,
  };

  if (scheduleddatetime) params.scheduleddatetime = scheduleddatetime;

  return vbout.post("socialmedia/editpost.json", params);
}

async function deletePost(args) {
  const { id, channel } = args || {};
  ensureEnum(channel, ALLOWED_CHANNELS, "channel");
  if (id === undefined || id === null || id === "") throw new Error("id is required");

  const vbout = createVboutClient();
  return vbout.post("socialmedia/deletepost.json", { id, channel });
}

module.exports = {
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
};

