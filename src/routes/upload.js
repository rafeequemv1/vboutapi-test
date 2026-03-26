const path = require("path");
const express = require("express");
const multer = require("multer");

function getPublicUrl(req, filename) {
  const configuredBase = String(process.env.PUBLIC_BASE_URL || "").trim();
  const base =
    configuredBase.length > 0
      ? configuredBase.replace(/\/+$/, "")
      : `${req.protocol}://${req.get("host")}`;
  return `${base}/uploads/${filename}`;
}

const uploadsDir = path.join(__dirname, "../../uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = ext && ext.length <= 10 ? ext : "";
    const unique = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    cb(null, `media-${unique}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
  },
  fileFilter: (req, file, cb) => {
    const mime = file.mimetype || "";
    const ok = mime.startsWith("image/") || mime.startsWith("video/");
    cb(ok ? null : new Error("Only image/* or video/* files are allowed"), ok);
  },
});

const router = express.Router();

router.post("/api/upload", upload.array("media", 10), (req, res) => {
  try {
    const files = req.files || [];
    if (!Array.isArray(files) || files.length === 0) {
      res.status(400).json({ ok: false, error: "No media file uploaded." });
      return;
    }

    res.json({
      ok: true,
      files: files.map((f) => ({
        url: getPublicUrl(req, f.filename),
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
      })),
    });
  } catch (err) {
    res.status(400).json({ ok: false, error: err?.message || "Upload failed" });
  }
});

module.exports = { router };

