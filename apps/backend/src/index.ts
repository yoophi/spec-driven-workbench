import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();
const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const hostname = process.env.HOST ?? "127.0.0.1";

app.get("/health", (context) =>
  context.json({
    status: "ok",
    service: "backend"
  })
);

serve(
  {
    fetch: app.fetch,
    hostname,
    port
  },
  (info) => {
    console.log(`backend server listening on http://${hostname}:${info.port}`);
  }
);
