import { Router } from "express";
import { db, leadsTable } from "@workspace/db";
import { serializeDates } from "../lib/serialize";
import { SubmitLeadBody, SubmitLeadResponse } from "@workspace/api-zod";
import { getInquiryEmail } from "./contact-settings";
import { sendInquiryEmail } from "../lib/send-inquiry-email";

const router = Router();

// POST /leads
router.post("/leads", async (req, res): Promise<void> => {
  const body = SubmitLeadBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [created] = await db.insert(leadsTable).values(body.data).returning();

  try {
    const inquiryEmail = await getInquiryEmail();
    await sendInquiryEmail({ to: inquiryEmail, lead: body.data });
  } catch (err) {
    console.error("[leads] Failed to send inquiry email:", err);
  }

  res.status(201).json(SubmitLeadResponse.parse(serializeDates(created)));
});

export default router;
