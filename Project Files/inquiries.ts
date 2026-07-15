import { Router } from "express";
import { db } from "@workspace/db";
import { inquiriesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

// GET /listings/:id/inquiries
router.get("/listings/:id/inquiries", async (req, res) => {
  try {
    const listingId = Number(req.params.id);
    const inquiries = await db
      .select()
      .from(inquiriesTable)
      .where(eq(inquiriesTable.listingId, listingId))
      .orderBy(sql`${inquiriesTable.createdAt} desc`);

    res.json(inquiries.map(formatInquiry));
  } catch (err) {
    req.log.error({ err }, "Failed to get inquiries for listing");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /listings/:id/inquiries
router.post("/listings/:id/inquiries", async (req, res) => {
  try {
    const listingId = Number(req.params.id);
    const { name, email, phone, message } = req.body;
    const [inquiry] = await db
      .insert(inquiriesTable)
      .values({ listingId, name, email, phone: phone ?? null, message })
      .returning();
    res.status(201).json(formatInquiry(inquiry));
  } catch (err) {
    req.log.error({ err }, "Failed to create inquiry");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /inquiries
router.get("/inquiries", async (req, res) => {
  try {
    const inquiries = await db
      .select()
      .from(inquiriesTable)
      .orderBy(sql`${inquiriesTable.createdAt} desc`);

    res.json(inquiries.map(formatInquiry));
  } catch (err) {
    req.log.error({ err }, "Failed to get inquiries");
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatInquiry(i: typeof inquiriesTable.$inferSelect) {
  return {
    ...i,
    phone: i.phone ?? null,
    createdAt: i.createdAt.toISOString(),
  };
}

export default router;
