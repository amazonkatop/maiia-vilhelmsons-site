type InquiryLead = {
  name: string;
  email: string;
  phone?: string | null;
  projectType: string;
  message?: string | null;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendInquiryEmail(params: {
  to: string;
  lead: InquiryLead;
}): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[leads] RESEND_API_KEY not set — inquiry saved but email not sent");
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }

  const from =
    process.env.RESEND_FROM_EMAIL ??
    "Maiia Vilhelmsons <onboarding@resend.dev>";

  const lines = [
    `<p><strong>Name:</strong> ${escapeHtml(params.lead.name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(params.lead.email)}</p>`,
    params.lead.phone
      ? `<p><strong>Phone:</strong> ${escapeHtml(params.lead.phone)}</p>`
      : "",
    `<p><strong>Project type:</strong> ${escapeHtml(params.lead.projectType)}</p>`,
    params.lead.message
      ? `<p><strong>Message:</strong><br>${escapeHtml(params.lead.message).replaceAll("\n", "<br>")}</p>`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject: `New inquiry from ${params.lead.name}`,
      html: `<h2>New contact form inquiry</h2>${lines}`,
      reply_to: params.lead.email,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[leads] Resend failed:", err);
    return { sent: false, error: err };
  }

  return { sent: true };
}
