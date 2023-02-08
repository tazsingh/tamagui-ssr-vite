import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const createServer = async () => {
  const app = express();

  const vite = await createViteServer({
    configFile: path.resolve(__dirname, "./vite.config.ts"),
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res) => {
    const url = req.originalUrl;

    console.log("RENDERING", url);

    const template = await vite.transformIndexHtml(
      req.originalUrl,
      await fs.readFile(path.resolve(__dirname, "./index.html"), "utf-8")
    );

    console.log("TRANSFORMED TEMPLATE");

    const render = (
      await vite.ssrLoadModule(
        "/src/entry-server.tsx",
        { fixStacktrace: true }
      )
    ).render;

    // TODO: Doesn't arrive at this step
    console.log("LOADED SSR MODULE");

    const ssrContent = render(url);

    console.log("RENDERED SSR CONTENT");

    const finalHtml = template.replace("<!--ssr-content-->", ssrContent);

    res.status(200).set({ "Content-Type": "text/html" }).end(finalHtml);
  });

  await new Promise<void>((resolve) => app.listen(8888, "0.0.0.0", resolve));

  console.log("VITE DEV SERVER LISTENING ON 0.0.0.0:8888");
};

createServer();
