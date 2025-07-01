import {
  users,
  tailors,
  designs,
  measurements,
  stylePreferences,
  orders,
  reviews,
  type User,
  type InsertUser,
  type Tailor,
  type InsertTailor,
  type Design,
  type InsertDesign,
  type Measurement,
  type InsertMeasurement,
  type StylePreference,
  type InsertStylePreference,
  type Order,
  type InsertOrder,
  type Review,
  type InsertReview,
  type DesignWithTailor,
  type OrderWithDetails,
  type TailorWithStats,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;

  // Tailor operations
  getTailor(id: number): Promise<Tailor | undefined>;
  getTailorByEmail(email: string): Promise<Tailor | undefined>;
  createTailor(tailor: InsertTailor): Promise<Tailor>;
  updateTailor(id: number, updates: Partial<InsertTailor>): Promise<Tailor>;
  getAllTailors(): Promise<Tailor[]>;
  getTailorWithStats(id: number): Promise<TailorWithStats | undefined>;

  // Design operations
  getDesign(id: number): Promise<Design | undefined>;
  getDesignWithTailor(id: number): Promise<DesignWithTailor | undefined>;
  createDesign(design: InsertDesign): Promise<Design>;
  updateDesign(id: number, updates: Partial<InsertDesign>): Promise<Design>;
  getDesignsByTailor(tailorId: number): Promise<Design[]>;
  getAllDesigns(): Promise<DesignWithTailor[]>;
  searchDesigns(query?: string, category?: string): Promise<DesignWithTailor[]>;
  getTrendingDesigns(): Promise<DesignWithTailor[]>;

  // Measurement operations
  getMeasurement(id: number): Promise<Measurement | undefined>;
  getMeasurementByUser(userId: number): Promise<Measurement | undefined>;
  createMeasurement(measurement: InsertMeasurement): Promise<Measurement>;
  updateMeasurement(id: number, updates: Partial<InsertMeasurement>): Promise<Measurement>;

  // Style preference operations
  getStylePreference(id: number): Promise<StylePreference | undefined>;
  getStylePreferenceByUser(userId: number): Promise<StylePreference | undefined>;
  createStylePreference(preference: InsertStylePreference): Promise<StylePreference>;
  updateStylePreference(id: number, updates: Partial<InsertStylePreference>): Promise<StylePreference>;

  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getOrderWithDetails(id: number): Promise<OrderWithDetails | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, updates: Partial<Order>): Promise<Order>;
  getOrdersByUser(userId: number): Promise<OrderWithDetails[]>;
  getOrdersByTailor(tailorId: number): Promise<OrderWithDetails[]>;
  getAllOrders(): Promise<OrderWithDetails[]>;

  // Review operations
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByTailor(tailorId: number): Promise<Review[]>;
  getReviewsByUser(userId: number): Promise<Review[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private tailors: Map<number, Tailor> = new Map();
  private designs: Map<number, Design> = new Map();
  private measurements: Map<number, Measurement> = new Map();
  private stylePreferences: Map<number, StylePreference> = new Map();
  private orders: Map<number, Order> = new Map();
  private reviews: Map<number, Review> = new Map();
  private currentId: number = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed tailors
    const tailor1: Tailor = {
      id: 1,
      name: "Adebayo Tailoring",
      email: "adebayo@tailoring.com",
      phone: "+234 803 555 0101",
      address: "123 Fashion Street, Lagos, Nigeria",
      description: "Master tailor specializing in traditional Nigerian wear with over 20 years of experience.",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      rating: "4.9",
      totalReviews: 127,
      totalOrders: 23,
      revenue: "1200000",
      isVerified: true,
      createdAt: new Date(),
    };

    const tailor2: Tailor = {
      id: 2,
      name: "Kemi's Couture",
      email: "kemi@couture.com",
      phone: "+234 805 555 0102",
      address: "456 Craft Avenue, Abuja, Nigeria",
      description: "Contemporary African fashion designer known for innovative Ankara styles.",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b407?w=100",
      rating: "4.7",
      totalReviews: 89,
      totalOrders: 15,
      revenue: "850000",
      isVerified: true,
      createdAt: new Date(),
    };

    const tailor3: Tailor = {
      id: 3,
      name: "Emeka Designs",
      email: "emeka@designs.com",
      phone: "+234 807 555 0103",
      address: "789 Heritage Road, Kano, Nigeria",
      description: "Specializes in classic Dashiki and traditional ceremonial wear.",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      rating: "5.0",
      totalReviews: 203,
      totalOrders: 31,
      revenue: "1500000",
      isVerified: true,
      createdAt: new Date(),
    };

    this.tailors.set(1, tailor1);
    this.tailors.set(2, tailor2);
    this.tailors.set(3, tailor3);

    // Seed designs
    const design1: Design = {
      id: 1,
      tailorId: 1,
      name: "Premium Agbada Collection",
      description: "Handcrafted traditional Agbada with modern cuts. Available in various colors and patterns.",
      category: "agbada",
      price: "45000",
      images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"],
      tags: ["traditional", "formal", "wedding"],
      isActive: true,
      isTrending: true,
      createdAt: new Date(),
    };

    const design2: Design = {
      id: 2,
      tailorId: 2,
      name: "Modern Ankara Styles",
      description: "Contemporary Ankara designs perfect for any occasion. Custom fitting guaranteed.",
      category: "ankara",
      price: "32000",
      images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"],
      tags: ["contemporary", "colorful", "everyday"],
      isActive: true,
      isTrending: false,
      createdAt: new Date(),
    };

    const design3: Design = {
      id: 3,
      tailorId: 3,
      name: "Classic Dashiki Collection",
      description: "Authentic Dashiki designs with traditional embroidery. Perfect for cultural events.",
      category: "dashiki",
      price: "28000",
      images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"],
      tags: ["authentic", "embroidered", "cultural"],
      isActive: true,
      isTrending: false,
      createdAt: new Date(),
    };

    this.designs.set(1, design1);
    this.designs.set(2, design2);
    this.designs.set(3, design3);

    this.currentId = 4;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentId++;
    const newUser: User = { 
      ...user, 
      id, 
      createdAt: new Date(),
      address: user.address || null,
      phone: user.phone || null
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Tailor operations
  async getTailor(id: number): Promise<Tailor | undefined> {
    return this.tailors.get(id);
  }

  async getTailorByEmail(email: string): Promise<Tailor | undefined> {
    return Array.from(this.tailors.values()).find(tailor => tailor.email === email);
  }

  async createTailor(tailor: InsertTailor): Promise<Tailor> {
    const id = this.currentId++;
    const newTailor: Tailor = {
      ...tailor,
      id,
      description: tailor.description || null,
      profileImage: tailor.profileImage || null,
      rating: "0",
      totalReviews: 0,
      totalOrders: 0,
      revenue: "0",
      isVerified: false,
      createdAt: new Date(),
    };
    this.tailors.set(id, newTailor);
    return newTailor;
  }

  async updateTailor(id: number, updates: Partial<InsertTailor>): Promise<Tailor> {
    const tailor = this.tailors.get(id);
    if (!tailor) throw new Error("Tailor not found");
    const updatedTailor = { ...tailor, ...updates };
    this.tailors.set(id, updatedTailor);
    return updatedTailor;
  }

  async getAllTailors(): Promise<Tailor[]> {
    return Array.from(this.tailors.values());
  }

  async getTailorWithStats(id: number): Promise<TailorWithStats | undefined> {
    const tailor = this.tailors.get(id);
    if (!tailor) return undefined;

    const designs = await this.getDesignsByTailor(id);
    const recentOrders = (await this.getOrdersByTailor(id)).slice(0, 5);

    return { ...tailor, designs, recentOrders };
  }

  // Design operations
  async getDesign(id: number): Promise<Design | undefined> {
    return this.designs.get(id);
  }

  async getDesignWithTailor(id: number): Promise<DesignWithTailor | undefined> {
    const design = this.designs.get(id);
    if (!design) return undefined;

    const tailor = this.tailors.get(design.tailorId);
    if (!tailor) return undefined;

    return { ...design, tailor };
  }

  async createDesign(design: InsertDesign): Promise<Design> {
    const id = this.currentId++;
    const newDesign: Design = {
      ...design,
      id,
      isActive: true,
      isTrending: false,
      createdAt: new Date(),
    };
    this.designs.set(id, newDesign);
    return newDesign;
  }

  async updateDesign(id: number, updates: Partial<InsertDesign>): Promise<Design> {
    const design = this.designs.get(id);
    if (!design) throw new Error("Design not found");
    const updatedDesign = { ...design, ...updates };
    this.designs.set(id, updatedDesign);
    return updatedDesign;
  }

  async getDesignsByTailor(tailorId: number): Promise<Design[]> {
    return Array.from(this.designs.values()).filter(design => design.tailorId === tailorId);
  }

  async getAllDesigns(): Promise<DesignWithTailor[]> {
    const designsWithTailors: DesignWithTailor[] = [];
    for (const design of this.designs.values()) {
      const tailor = this.tailors.get(design.tailorId);
      if (tailor) {
        designsWithTailors.push({ ...design, tailor });
      }
    }
    return designsWithTailors;
  }

  async searchDesigns(query?: string, category?: string): Promise<DesignWithTailor[]> {
    let designs = await this.getAllDesigns();

    if (category && category !== "all") {
      designs = designs.filter(design => design.category === category);
    }

    if (query) {
      const searchTerm = query.toLowerCase();
      designs = designs.filter(design =>
        design.name.toLowerCase().includes(searchTerm) ||
        design.description.toLowerCase().includes(searchTerm) ||
        design.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        design.tailor.name.toLowerCase().includes(searchTerm)
      );
    }

    return designs;
  }

  async getTrendingDesigns(): Promise<DesignWithTailor[]> {
    const designs = await this.getAllDesigns();
    return designs.filter(design => design.isTrending);
  }

  // Measurement operations
  async getMeasurement(id: number): Promise<Measurement | undefined> {
    return this.measurements.get(id);
  }

  async getMeasurementByUser(userId: number): Promise<Measurement | undefined> {
    return Array.from(this.measurements.values()).find(measurement => measurement.userId === userId);
  }

  async createMeasurement(measurement: InsertMeasurement): Promise<Measurement> {
    const id = this.currentId++;
    const newMeasurement: Measurement = { ...measurement, id, createdAt: new Date() };
    this.measurements.set(id, newMeasurement);
    return newMeasurement;
  }

  async updateMeasurement(id: number, updates: Partial<InsertMeasurement>): Promise<Measurement> {
    const measurement = this.measurements.get(id);
    if (!measurement) throw new Error("Measurement not found");
    const updatedMeasurement = { ...measurement, ...updates };
    this.measurements.set(id, updatedMeasurement);
    return updatedMeasurement;
  }

  // Style preference operations
  async getStylePreference(id: number): Promise<StylePreference | undefined> {
    return this.stylePreferences.get(id);
  }

  async getStylePreferenceByUser(userId: number): Promise<StylePreference | undefined> {
    return Array.from(this.stylePreferences.values()).find(pref => pref.userId === userId);
  }

  async createStylePreference(preference: InsertStylePreference): Promise<StylePreference> {
    const id = this.currentId++;
    const newPreference: StylePreference = { ...preference, id, completedAt: new Date() };
    this.stylePreferences.set(id, newPreference);
    return newPreference;
  }

  async updateStylePreference(id: number, updates: Partial<InsertStylePreference>): Promise<StylePreference> {
    const preference = this.stylePreferences.get(id);
    if (!preference) throw new Error("Style preference not found");
    const updatedPreference = { ...preference, ...updates };
    this.stylePreferences.set(id, updatedPreference);
    return updatedPreference;
  }

  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderWithDetails(id: number): Promise<OrderWithDetails | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const design = this.designs.get(order.designId);
    const tailor = this.tailors.get(order.tailorId);
    const user = this.users.get(order.userId);

    if (!design || !tailor || !user) return undefined;

    return { ...order, design, tailor, user };
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentId++;
    const newOrder: Order = {
      ...order,
      id,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrder(id: number, updates: Partial<Order>): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) throw new Error("Order not found");
    const updatedOrder = { ...order, ...updates, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getOrdersByUser(userId: number): Promise<OrderWithDetails[]> {
    const orders: OrderWithDetails[] = [];
    for (const order of this.orders.values()) {
      if (order.userId === userId) {
        const orderWithDetails = await this.getOrderWithDetails(order.id);
        if (orderWithDetails) orders.push(orderWithDetails);
      }
    }
    return orders;
  }

  async getOrdersByTailor(tailorId: number): Promise<OrderWithDetails[]> {
    const orders: OrderWithDetails[] = [];
    for (const order of this.orders.values()) {
      if (order.tailorId === tailorId) {
        const orderWithDetails = await this.getOrderWithDetails(order.id);
        if (orderWithDetails) orders.push(orderWithDetails);
      }
    }
    return orders;
  }

  async getAllOrders(): Promise<OrderWithDetails[]> {
    const orders: OrderWithDetails[] = [];
    for (const order of this.orders.values()) {
      const orderWithDetails = await this.getOrderWithDetails(order.id);
      if (orderWithDetails) orders.push(orderWithDetails);
    }
    return orders;
  }

  // Review operations
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentId++;
    const newReview: Review = { ...review, id, createdAt: new Date() };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async getReviewsByTailor(tailorId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.tailorId === tailorId);
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.userId === userId);
  }
}

export const storage = new MemStorage();
