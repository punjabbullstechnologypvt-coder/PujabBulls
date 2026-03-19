import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    excerpt: String,

    content: { type: Object, required: true },

    coverImage: {
      url: String,
      public_id: String,
    },

    thumbnailImage: {
      url: String,
      public_id: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    readingTimeMinutes: {
      type: Number,
      default: 1,
    },
    gallery: [
      {
        url: String,
        public_id: String,
        caption: String,
      },
    ],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      canonicalUrl: String,
      ogImageAlt: String,
      noindex: {
        type: Boolean,
        default: false,
      },
      schemaType: {
        type: String,
        default: "BlogPosting",
      },
      authorName: String,
      ogImage: {
        url: String,
        public_id: String,
      },
    },
  },
  { timestamps: true },
);

blogSchema.index({ title: "text", excerpt: "text" });
blogSchema.index({ status: 1 });
blogSchema.index({ createdAt: -1 });

export default mongoose.model("Blog", blogSchema);
