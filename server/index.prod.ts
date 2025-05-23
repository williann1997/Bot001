import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { bot } from "./bot.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging for production
function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit", 
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// Health check endpoint for hosting platforms
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    bot: bot.client.isReady() ? "online" : "offline"
  });
});

async function startServer() {
  try {
    // Start Discord bot
    await bot.start();
    log('Discord bot started successfully');
    
    // Register API routes
    const server = await registerRoutes(app);
    
    // Error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    // Use environment port for production
    const port = process.env.PORT || 5000;
    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      log("SIGTERM received, shutting down gracefully");
      await bot.stop();
      process.exit(0);
    });

    process.on("SIGINT", async () => {
      log("SIGINT received, shutting down gracefully");
      await bot.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();