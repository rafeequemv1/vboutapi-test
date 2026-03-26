const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const { router: socialMediaRouter } = require("./routes/socialMedia");
const { router: uploadRouter } = require("./routes/upload");
const { router: firecrawlRouter } = require("./routes/firecrawl");

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static files for the UI.
app.use(express.static(path.join(__dirname, "../public")));

// Serve uploaded media files.
const uploadsPath = path.join(__dirname, "../uploads");
fs.mkdirSync(uploadsPath, { recursive: true });
app.use("/uploads", express.static(uploadsPath));

app.use(socialMediaRouter);
app.use(uploadRouter);
app.use(firecrawlRouter);

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`VBOUT Social Poster listening on http://localhost:${port}`);
  });
}

module.exports = app;

