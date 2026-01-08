import { eq, desc, and, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, sections, products, events, sermons, settings, InsertSection, InsertProduct, InsertEvent, InsertSermon } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== SECTIONS QUERIES =====
export async function getSectionBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(sections).where(eq(sections.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getActiveSections(sectionType?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(sections.isActive, 1)];
  if (sectionType) conditions.push(eq(sections.sectionType, sectionType as any));
  return db.select().from(sections).where(and(...conditions)).orderBy(asc(sections.order));
}

export async function createSection(data: InsertSection) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(sections).values(data);
}

export async function updateSection(id: number, data: Partial<InsertSection>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(sections).set(data).where(eq(sections.id, id));
}

export async function deleteSection(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(sections).where(eq(sections.id, id));
}

// ===== PRODUCTS QUERIES =====
export async function getActiveProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.isActive, 1));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(products).values(data);
}

export async function updateProduct(id: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(products).where(eq(products.id, id));
}

// ===== EVENTS QUERIES =====
export async function getActiveEvents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events).where(eq(events.isActive, 1)).orderBy(asc(events.startDate));
}

export async function getEventById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createEvent(data: InsertEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(events).values(data);
}

export async function updateEvent(id: number, data: Partial<InsertEvent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(events).set(data).where(eq(events.id, id));
}

export async function deleteEvent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(events).where(eq(events.id, id));
}

// ===== SERMONS QUERIES =====
export async function getActiveSermons() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sermons).where(eq(sermons.isActive, 1)).orderBy(desc(sermons.publishedAt));
}

export async function getSermonById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(sermons).where(eq(sermons.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getSermonByYoutubeId(youtubeVideoId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(sermons).where(eq(sermons.youtubeVideoId, youtubeVideoId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSermon(data: InsertSermon) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(sermons).values(data);
}

export async function updateSermon(id: number, data: Partial<InsertSermon>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(sermons).set(data).where(eq(sermons.id, id));
}

export async function deleteSermon(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(sermons).where(eq(sermons.id, id));
}

// ===== SETTINGS QUERIES =====
export async function getSetting(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function setSetting(key: string, value: string, settingType: "string" | "number" | "boolean" | "json" = "string") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getSetting(key);
  if (existing) {
    await db.update(settings).set({ value, type: settingType }).where(eq(settings.key, key));
  } else {
    await db.insert(settings).values({ key, value, type: settingType });
  }
}
