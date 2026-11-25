import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

export const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const route = pathname === "/" ? "/index.html" : pathname;
    const path = resolve(root, "." + (extname(route) ? route : route + ".html"));
    const type = types[extname(path)];
    if (!path.startsWith(root + sep) || !type || !(await stat(path)).isFile()) {
      throw new Error("File not found");
    }
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });
    createReadStream(path).pipe(res);
  } catch {
    res.writeHead(404).end("Not found");
  }
});

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  server.listen(Number(process.argv[2] || 8788), "127.0.0.1", () => {
    console.log("http://127.0.0.1:" + server.address().port);
  });
}
