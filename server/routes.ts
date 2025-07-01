import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerRoutes as registerAuthRoutes } from "./auth-routes";
import { registerPaymentRoutes } from "./payment-routes";
import {
  insertUserSchema,
  insertTailorSchema,
  insertDesignSchema,
  insertMeasurementSchema,
  insertStylePreferenceSchema,
  insertOrderSchema,
  insertReviewSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error: error instanceof Error ? error.message : error });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user", error: error instanceof Error ? error.message : error });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, updates);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user", error: error instanceof Error ? error.message : error });
    }
  });

  // Tailor routes
  app.post("/api/tailors", async (req, res) => {
    try {
      const tailorData = insertTailorSchema.parse(req.body);
      const tailor = await storage.createTailor(tailorData);
      res.json(tailor);
    } catch (error) {
      res.status(400).json({ message: "Invalid tailor data", error: error instanceof Error ? error.message : error });
    }
  });

  app.get("/api/tailors", async (req, res) => {
    try {
      const tailors = await storage.getAllTailors();
      res.json(tailors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tailors", error: error instanceof Error ? error.message : error });
    }
  });

  app.get("/api/tailors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tailor = await storage.getTailorWithStats(id);
      if (!tailor) {
        return res.status(404).json({ message: "Tailor not found" });
      }
      res.json(tailor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tailor", error: error instanceof Error ? error.message : error });
    }
  });

  // Design routes
  app.post("/api/designs", async (req, res) => {
    try {
      const designData = insertDesignSchema.parse(req.body);
      const design = await storage.createDesign(designData);
      res.json(design);
    } catch (error) {
      res.status(400).json({ message: "Invalid design data", error: error instanceof Error ? error.message : error });
    }
  });

  app.get("/api/designs", async (req, res) => {
    try {
      const { search, category } = req.query;
      const designs = await storage.searchDesigns(
        search as string,
        category as string
      );
      res.json(designs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch designs", error: error instanceof Error ? error.message : error });
    }
  });

  app.get("/api/designs/trending", async (req, res) => {
    try {
      const designs = await storage.getTrendingDesigns();
      res.json(designs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending designs", error: error instanceof Error ? error.message : error });
    }
  });

  app.get("/api/designs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const design = await storage.getDesignWithTailor(id);
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      res.json(design);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch design", error: error instanceof Error ? error.message : error });
    }
  });

  // Measurement routes
  app.post("/api/measurements", async (req, res) => {
    try {
      const measurementData = insertMeasurementSchema.parse(req.body);
      const measurement = await storage.createMeasurement(measurementData);
      res.json(measurement);
    } catch (error) {
      res.status(400).json({ message: "Invalid measurement data", error: error instanceof Error ? error.message : error });
    }
  });

  app.get("/api/measurements/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const measurement = await storage.getMeasurementByUser(userId);
      res.json(measurement);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch measurements", error: error instanceof Error ? error.message : error });
    }
  });

  app.put("/api/measurements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertMeasurementSchema.partial().parse(req.body);
      const measurement = await storage.updateMeasurement(id, updates);
      res.json(measurement);
    } catch (error) {
      res.status(400).json({ message: "Failed to update measurements", error: error instanceof Error ? error.message : error });
    }
  });

  // Style preference routes
  app.post("/api/style-preferences", async (req, res) => {
    try {
      const preferenceData = insertStylePreferenceSchema.parse(req.body);
      const preference = await storage.createStylePreference(preferenceData);
      res.json(preference);
    } catch (error) {
      res.status(400).json({ message: "Invalid style preference data", error: error instanceof Error ? error.message : error });
    }
  });

  app.get("/api/style-preferences/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const preference = await storage.getStylePreferenceByUser(userId);
      res.json(preference);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch style preferences", error: error instanceof Error ? error.message : error });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);

      // Emit real-time event for new order
      const io = app.get("socketio");
      if (io) {
        io.to(`tailor-${order.tailorId}`).emit("new-order", order);
      }

      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data", error: error instanceof Error ? error.message : error });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderWithDetails(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order", error: error instanceof Error ? error.message : error });
    }
  });

  app.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await storage.getOrdersByUser(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user orders", error: error instanceof Error ? error.message : error });
    }
  });

  app.get("/api/orders/tailor/:tailorId", async (req, res) => {
    try {
      const tailorId = parseInt(req.params.tailorId);
      const orders = await storage.getOrdersByTailor(tailorId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tailor orders", error: error instanceof Error ? error.message : error });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrder(id, { status });

      // Emit real-time event for order status update
      const io = app.get("socketio");
      if (io) {
        io.to(`order-${id}`).emit("order-status-changed", { orderId: id, status, order });
      }

      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Failed to update order status", error: error instanceof Error ? error.message : error });
    }
  });

  // Review routes
  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data", error: error instanceof Error ? error.message : error });
    }
  });

  app.get("/api/reviews/tailor/:tailorId", async (req, res) => {
    try {
      const tailorId = parseInt(req.params.tailorId);
      const reviews = await storage.getReviewsByTailor(tailorId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews", error: error instanceof Error ? error.message : error });
    }
  });

  // Dashboard and analytics routes
  app.get("/api/dashboard/stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      // Get user's orders count
      const userOrders = await storage.getOrdersByUser(userId);
      const totalOrders = userOrders.length;

      // Get user's measurements
      const measurements = await storage.getMeasurementByUser(userId);
      const completedMeasurements = !!measurements;

      // Mock additional stats
      const stats = {
        totalOrders,
        completedMeasurements,
        completedStyleQuiz: true,
        activeChatThreads: 2,
        favoriteDesigns: 8,
        rewardPoints: 150
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats", error: error instanceof Error ? error.message : error });
    }
  });

  app.get("/api/dashboard/activity/:userId/:timeframe", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const timeframe = req.params.timeframe;

      // Get recent user activity (orders, measurements, etc.)
      const userOrders = await storage.getOrdersByUser(userId);

      // Transform orders into activity items
      const activities = userOrders.slice(0, 5).map(order => ({
        id: order.id,
        type: 'order',
        title: `Order #${order.id}`,
        description: `Status: ${order.status}`,
        timestamp: order.createdAt,
        status: order.status
      }));

      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard activity", error: error instanceof Error ? error.message : error });
    }
  });

  app.get("/api/dashboard/active-orders/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userOrders = await storage.getOrdersByUser(userId);

      // Filter active orders (not completed or cancelled)
      const activeOrders = userOrders.filter(order => 
        !['completed', 'cancelled'].includes(order.status)
      );

      res.json(activeOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active orders", error: error instanceof Error ? error.message : error });
    }
  });

  // Health check endpoint for production monitoring
  app.get("/health", (_req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0"
    });
  });

  // Register payment routes
  registerPaymentRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}