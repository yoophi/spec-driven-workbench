import { serve } from "@hono/node-server";

import { createApp } from "./app.js";

const app = createApp();
const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const hostname = process.env.HOST ?? "127.0.0.1";

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
