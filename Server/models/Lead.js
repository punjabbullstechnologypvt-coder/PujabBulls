import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    businessName: { type: String, trim: true },
    phone: { type: String, required: true, trim: true },
    industry: { type: String, trim: true },
    message: { type: String, trim: true },

    source: {
      type: String,
      default: "landing-page",
    },

    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },

    adminEmailSent: { type: Boolean, default: false },
    userEmailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
