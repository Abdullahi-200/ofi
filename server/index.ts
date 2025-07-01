import express, { type Request, Response, NextFunction } from "express";
import { Server } from "socket.io";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Production optimizations
if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  app.use((req, res, next) => {
    // Security headers
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
  });
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Set up Socket.IO for real-time features
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Real-time event handlers
  io.on("connection", (socket) => {
    log(`User connected: ${socket.id}`);

    // Join room for order updates
    socket.on("join-order-room", (orderId) => {
      socket.join(`order-${orderId}`);
      log(`User ${socket.id} joined order room: ${orderId}`);
    });

    // Join room for tailor dashboard updates
    socket.on("join-tailor-room", (tailorId) => {
      socket.join(`tailor-${tailorId}`);
      log(`User ${socket.id} joined tailor room: ${tailorId}`);
    });

    // Handle measurement updates
    socket.on("measurement-update", (data) => {
      socket.broadcast.emit("measurement-updated", data);
    });

    // Handle order status updates
    socket.on("order-status-update", (data) => {
      io.to(`order-${data.orderId}`).emit("order-status-changed", data);
    });

    socket.on("disconnect", () => {
      log(`User disconnected: ${socket.id}`);
    });
  });

  // Make io available to routes
  app.set("socketio", io);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
