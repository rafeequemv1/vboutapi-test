const path = require("path");
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { put } = require("@vercel/blob");

function getPublicUrl(req, filename) {
  const configuredBase = String(process.env.PUBLIC_BASE_URL || "").trim();
  const base =
    configuredBase.length > 0
      ? configuredBase.replace(/\/+$/, "")
      : `${req.protocol}://${req.get("host")}`;
  return `${base}/uploads/${filename}`;
}

const uploadsDir = path.join(__dirname, "../../uploads");

function makeFilename(originalName) {
  const ext = path.extname(originalName || "").toLowerCase();
  const safeExt = ext && ext.length <= 10 ? ext : "";
  const unique = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `media-${unique}${safeExt}`;
}

const upload = multer({
  storage: multer.memoryStorage(),
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
  (async () => {
    const files = req.files || [];
    if (!Array.isArray(files) || files.length === 0) {
      res.status(400).json({ ok: false, error: "No media file uploaded." });
      return;
    }

    const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    fs.mkdirSync(uploadsDir, { recursive: true });

    const out = [];
    for (const f of files) {
      const filename = makeFilename(f.originalname || "");
      let url;
      if (useBlob) {
        const blob = await put(`uploads/${filename}`, f.buffer, {
          access: "public",
          contentType: f.mimetype || "application/octet-stream",
        });
        url = blob.url;
      } else {
        const filepath = path.join(uploadsDir, filename);
        fs.writeFileSync(filepath, f.buffer);
        url = getPublicUrl(req, filename);
      }

      out.push({
        url,
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
      });
    }

    res.json({
      ok: true,
      files: out,
    });
  })().catch((err) => {
    res.status(400).json({ ok: false, error: err?.message || "Upload failed" });
  });
});

module.exports = { router };

