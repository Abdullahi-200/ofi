import express, { type Request, Response, NextFunction } from "express";
import { Server } from "socket.io";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Production optimizations and security
if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  
  // Comprehensive security headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;");
    next();
  });

  // Rate limiting
  const rateLimit = new Map();
  app.use((req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000");
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100");
    
    if (!rateLimit.has(ip)) {
      rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const limit = rateLimit.get(ip);
    if (now > limit.resetTime) {
      limit.count = 1;
      limit.resetTime = now + windowMs;
      return next();
    }
    
    if (limit.count >= maxRequests) {
      return res.status(429).json({ message: "Too many requests" });
    }
    
    limit.count++;
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
      origin: process.env.NODE_ENV === "production" 
        ? process.env.SOCKET_IO_CORS_ORIGIN || false
        : "*",
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000
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

  // Enhanced error handling
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = process.env.NODE_ENV === "production" 
      ? (status < 500 ? err.message : "Internal Server Error")
      : err.message || "Internal Server Error";

    // Log error details in production
    if (process.env.NODE_ENV === "production") {
      console.error(`Error ${status} on ${req.method} ${req.path}:`, {
        message: err.message,
        stack: err.stack,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
    }

    res.status(status).json({ message });
  });

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
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
  const port = parseInt(process.env.PORT || "5000");
  
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`🚀 Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
    log(`📡 Health check available at /health`);
  });

  // Graceful shutdown
  const gracefulShutdown = (signal: string) => {
    log(`Received ${signal}. Graceful shutdown initiated.`);
    
    server.close(() => {
      log("HTTP server closed.");
      
      io.close(() => {
        log("Socket.IO server closed.");
        process.exit(0);
      });
    });

    // Force close after 10 seconds
    setTimeout(() => {
      log("Force closing server after timeout.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
})();
