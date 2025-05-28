import { Hono } from "hono";
import { cors } from "hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./trpc/router";
import { createContext } from "./trpc/context";

const app = new Hono();

app.use(
  "/trpc/*",
  cors({
    origin: "https://mobitrade.aldinugraha.me",
    credentials: true,
  }),
);

app.use("/trpc/*", trpcServer({ router: appRouter, createContext }));

export default app;
