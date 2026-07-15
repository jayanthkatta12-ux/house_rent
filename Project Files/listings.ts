import { Router } from "express";
import { db } from "@workspace/db";
import { listingsTable } from "@workspace/db";
import { eq, and, gte, lte, sql, ilike, or } from "drizzle-orm";

const router = Router();

// GET /listings
router.get("/listings", async (req, res) => {
  try {
    const { city, minPrice, maxPrice, bedrooms, type, status, search } = req.query;

    const conditions = [];

    if (city && typeof city === "string") {
      conditions.push(ilike(listingsTable.city, `%${city}%`));
    }
    if (minPrice) {
      conditions.push(gte(listingsTable.price, Number(minPrice)));
    }
    if (maxPrice) {
      conditions.push(lte(listingsTable.price, Number(maxPrice)));
    }
    if (bedrooms) {
      conditions.push(eq(listingsTable.bedrooms, Number(bedrooms)));
    }
    if (type && typeof type === "string") {
      conditions.push(eq(listingsTable.type, type as any));
    }
    if (status && typeof status === "string") {
      conditions.push(eq(listingsTable.status, status as any));
    }
    if (search && typeof search === "string") {
      conditions.push(
        or(
          ilike(listingsTable.title, `%${search}%`),
          ilike(listingsTable.city, `%${search}%`),
          ilike(listingsTable.address, `%${search}%`),
          ilike(listingsTable.description, `%${search}%`),
        )!,
      );
    }

    const listings = await db
      .select()
      .from(listingsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(sql`${listingsTable.createdAt} desc`);

    res.json(listings.map(formatListing));
  } catch (err) {
    req.log.error({ err }, "Failed to get listings");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /listings/featured
router.get("/listings/featured", async (req, res) => {
  try {
    const listings = await db
      .select()
      .from(listingsTable)
      .where(and(eq(listingsTable.featured, true), eq(listingsTable.status, "available")))
      .orderBy(sql`${listingsTable.createdAt} desc`)
      .limit(6);

    res.json(listings.map(formatListing));
  } catch (err) {
    req.log.error({ err }, "Failed to get featured listings");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /listings/summary
router.get("/listings/summary", async (req, res) => {
  try {
    const [totals] = await db
      .select({
        total: sql<number>`count(*)::int`,
        available: sql<number>`count(*) filter (where ${listingsTable.status} = 'available')::int`,
        rented: sql<number>`count(*) filter (where ${listingsTable.status} = 'rented')::int`,
        avgPrice: sql<number>`coalesce(avg(${listingsTable.price}), 0)`,
      })
      .from(listingsTable);

    const inquiryResult = await db.execute<{ count: string }>(
      sql`SELECT count(*)::int as count FROM inquiries`,
    );
    const inquiryCount = inquiryResult.rows[0];

    const cityCounts = await db
      .select({
        city: listingsTable.city,
        count: sql<number>`count(*)::int`,
      })
      .from(listingsTable)
      .groupBy(listingsTable.city)
      .orderBy(sql`count(*) desc`)
      .limit(5);

    res.json({
      total: totals.total,
      available: totals.available,
      rented: totals.rented,
      avgPrice: Math.round(totals.avgPrice),
      totalInquiries: Number((inquiryCount as any).count ?? 0),
      cityCounts,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get listings summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /listings/:id
router.get("/listings/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [listing] = await db.select().from(listingsTable).where(eq(listingsTable.id, id));
    if (!listing) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }
    res.json(formatListing(listing));
  } catch (err) {
    req.log.error({ err }, "Failed to get listing");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /listings
router.post("/listings", async (req, res) => {
  try {
    const { title, description, address, city, state, price, bedrooms, bathrooms, area, type, status, featured, amenities, images } = req.body;
    const [listing] = await db
      .insert(listingsTable)
      .values({
        title,
        description,
        address,
        city,
        state,
        price: Number(price),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area: Number(area),
        type,
        status: status ?? "available",
        featured: featured ?? false,
        amenities: amenities ?? [],
        images: images ?? [],
      })
      .returning();
    res.status(201).json(formatListing(listing));
  } catch (err) {
    req.log.error({ err }, "Failed to create listing");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /listings/:id
router.patch("/listings/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updates: Record<string, any> = {};
    const fields = ["title", "description", "address", "city", "state", "price", "bedrooms", "bathrooms", "area", "type", "status", "featured", "amenities", "images"];
    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    const [listing] = await db.update(listingsTable).set(updates).where(eq(listingsTable.id, id)).returning();
    if (!listing) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }
    res.json(formatListing(listing));
  } catch (err) {
    req.log.error({ err }, "Failed to update listing");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /listings/:id
router.delete("/listings/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [deleted] = await db.delete(listingsTable).where(eq(listingsTable.id, id)).returning();
    if (!deleted) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete listing");
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatListing(l: typeof listingsTable.$inferSelect) {
  return {
    ...l,
    amenities: l.amenities ?? [],
    images: l.images ?? [],
    createdAt: l.createdAt.toISOString(),
  };
}

export default router;
