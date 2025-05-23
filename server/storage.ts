import { farms, sales, users, type Farm, type Sale, type User, type InsertFarm, type InsertSale, type InsertUser } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Farm methods
  getFarm(id: number): Promise<Farm | undefined>;
  getFarmsByUserId(userId: string): Promise<Farm[]>;
  createFarm(farm: InsertFarm): Promise<Farm>;
  getAllFarms(): Promise<Farm[]>;
  
  // Sale methods
  getSale(id: number): Promise<Sale | undefined>;
  getSalesByUserId(userId: string): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;
  getAllSales(): Promise<Sale[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private farms: Map<number, Farm>;
  private sales: Map<number, Sale>;
  private currentUserId: number;
  private currentFarmId: number;
  private currentSaleId: number;

  constructor() {
    this.users = new Map();
    this.farms = new Map();
    this.sales = new Map();
    this.currentUserId = 1;
    this.currentFarmId = 1;
    this.currentSaleId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Farm methods
  async getFarm(id: number): Promise<Farm | undefined> {
    return this.farms.get(id);
  }

  async getFarmsByUserId(userId: string): Promise<Farm[]> {
    return Array.from(this.farms.values()).filter(
      (farm) => farm.userId === userId
    );
  }

  async createFarm(insertFarm: InsertFarm): Promise<Farm> {
    const id = this.currentFarmId++;
    const farm: Farm = { 
      ...insertFarm, 
      id,
      registeredAt: new Date()
    };
    this.farms.set(id, farm);
    return farm;
  }

  async getAllFarms(): Promise<Farm[]> {
    return Array.from(this.farms.values());
  }

  // Sale methods
  async getSale(id: number): Promise<Sale | undefined> {
    return this.sales.get(id);
  }

  async getSalesByUserId(userId: string): Promise<Sale[]> {
    return Array.from(this.sales.values()).filter(
      (sale) => sale.userId === userId
    );
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const id = this.currentSaleId++;
    const sale: Sale = { 
      ...insertSale, 
      id,
      registeredAt: new Date()
    };
    this.sales.set(id, sale);
    return sale;
  }

  async getAllSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }
}

export const storage = new MemStorage();
