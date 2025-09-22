import cors from "cors";
import "dotenv/config";
import express from "express";
import { handleDemo } from "./routes/demo";
import { generateFlashcardsHandler, healthCheckHandler } from "./routes/flashcards";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Trust proxy for rate limiting (if behind reverse proxy)
  app.set('trust proxy', 1);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Flashcard generation routes
  app.post("/api/flashcards/generate", generateFlashcardsHandler);
  app.get("/api/flashcards/health", healthCheckHandler);

  return app;
}
