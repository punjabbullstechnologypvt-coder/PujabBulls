import Lead from "../models/Lead.js";
import resend from "../config/resend.js";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone) => {
  const normalized = phone.replace(/[\s\-().]/g, "");
  return /^\+?\d{8,15}$/.test(normalized);
};

// Create a new lead (Request Callback / Free Demo form)
export const createLead = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim();
    const businessName = req.body.businessName?.trim() || "";
    const phone = req.body.phone?.trim();
    const industry = req.body.industry?.trim() || "";
    const message = req.body.message?.trim() || "";
    const source = req.body.source?.trim() || "landing-page";

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone number are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact number",
      });
    }

    // 1. Save to database first — this is the source of truth.
    //    Even if the emails below fail, the lead is never lost.
    const lead = await Lead.create({
      name,
      email,
      businessName,
      phone,
      industry,
      message,
      source,
    });

    // 2. Send admin notification email (best effort — doesn't block the response)
    resend.emails
      .send({
        from: process.env.RESEND_FROM_EMAIL,
        to: [process.env.MY_EMAIL],
        cc: process.env.CC_EMAIL ? [process.env.CC_EMAIL] : undefined,
        subject: `New Demo Request from ${name}${businessName ? ` (${businessName})` : ""}`,
        html: `
          <h2>New Demo / Callback Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Business Name:</strong> ${businessName || "-"}</p>
          <p><strong>Industry:</strong> ${industry || "-"}</p>
          <p><strong>Message:</strong><br/>${message || "-"}</p>
          <hr />
          <p style="color:#888;font-size:12px;">Source: ${source} · Lead ID: ${lead._id}</p>
        `,
      })
      .then(({ error }) => {
        if (error) {
          console.error("Admin notification email error:", error);
          return;
        }
        Lead.findByIdAndUpdate(lead._id, { adminEmailSent: true }).catch(() => {});
      })
      .catch((err) => console.error("Admin notification email error:", err));

    // 3. Send confirmation email to the user (best effort)
    resend.emails
      .send({
        from: process.env.RESEND_FROM_EMAIL,
        to: [email],
        subject: "We've received your request — PunjabBulls Technology",
        html: `
          <h2>Thank you, ${name}!</h2>
          <p>We've received your request and our Dynamics 365 specialists will get back to you within one business day.</p>
          <p><strong>Here's what you submitted:</strong></p>
          <ul>
            <li><strong>Business Name:</strong> ${businessName || "-"}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Industry:</strong> ${industry || "-"}</li>
            <li><strong>Message:</strong> ${message || "-"}</li>
          </ul>
          <p>If anything above needs correcting, just reply to this email or call us at +91 9711270115.</p>
          <br />
          <p>Regards,<br/>PunjabBulls Technology Pvt. Ltd.</p>
        `,
      })
      .then(({ error }) => {
        if (error) {
          console.error("User confirmation email error:", error);
          return;
        }
        Lead.findByIdAndUpdate(lead._id, { userEmailSent: true }).catch(() => {});
      })
      .catch((err) => console.error("User confirmation email error:", err));

    return res.status(201).json({
      success: true,
      message: "Request received. We'll be in touch within one business day.",
      leadId: lead._id,
    });
  } catch (err) {
    console.error("Create lead error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// Get all leads (admin only)
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, leads });
  } catch (err) {
    console.error("Get leads error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
