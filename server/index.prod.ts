import express, { type Request, Response } from "express";
import { bot } from "./bot";
import { registerRoutes } from "./routes";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static("dist/public"));

// Health check endpoint for hosting platforms
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    bot: bot.client.isReady() ? "online" : "offline"
  });
});

// Serve static files for any other route
app.get("*", (_req: Request, res: Response) => {
  res.sendFile("index.html", { root: "dist/public" });
});

async function startServer() {
  try {
    // Start Discord bot
    await bot.start();
    
    // Register API routes
    const server = await registerRoutes(app);
    
    server.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📱 Discord bot is ${bot.client.isReady() ? "online" : "offline"}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received, shutting down gracefully");
      await bot.stop();
      process.exit(0);
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT received, shutting down gracefully");
      await bot.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();