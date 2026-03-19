// Simple local server for StratiQ
// Run: node serve.js
// Then open: http://localhost:3000

const http = require("http");
const fs   = require("fs");
const path = require("path");

const PORT = 3000;
const DIR  = __dirname;

const MIME = {
  ".html": "text/html",
  ".js":   "application/javascript",
  ".css":  "text/css",
  ".json": "application/json",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon"
};

http.createServer((req, res) => {
  let filePath = path.join(DIR, req.url === "/" ? "dashboard.html" : req.url);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found: " + req.url);
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[ext] || "text/plain" });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log("✅ StratiQ running at http://localhost:" + PORT);
  console.log("   Open this URL in your browser.");
  console.log("   Press Ctrl+C to stop.");
});