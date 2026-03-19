import Blog from "../models/Blog.js";
import slugify from "slugify";
import {
  buildImageUpdatePlan,
  collectReferencedImagePublicIds,
} from "../utils/blogImageLifecycle.js";
import { writeAuditLog } from "../utils/auditLogger.js";
import { destroyCloudinaryAssets } from "../utils/cloudinaryAssetManager.js";
import { buildBlogSeo, calculateReadingTimeMinutes } from "../utils/blogSeo.js";

const SITE_URL = "https://www.punjabbulls.com";

function resolveSeoOverrides(existingBlog, incomingSeo = {}) {
  const previousAutoSeo = buildBlogSeo({
    title: existingBlog.title,
    excerpt: existingBlog.excerpt,
    content: existingBlog.content,
    slug: existingBlog.slug,
    coverImage: existingBlog.coverImage,
    seo: {},
  });
  const previousSeo = existingBlog.seo || {};

  const maybeAuto = (key) => {
    const nextValue = incomingSeo[key];

    if (nextValue === undefined) {
      return previousSeo[key] === previousAutoSeo[key] ? "" : previousSeo[key];
    }

    return nextValue === previousAutoSeo[key] ? "" : nextValue;
  };

  return {
    metaTitle: maybeAuto("metaTitle"),
    metaDescription: maybeAuto("metaDescription"),
    canonicalUrl: maybeAuto("canonicalUrl"),
    ogImageAlt: maybeAuto("ogImageAlt"),
    authorName: maybeAuto("authorName"),
    schemaType: incomingSeo.schemaType || previousSeo.schemaType,
    noindex:
      incomingSeo.noindex === undefined ? previousSeo.noindex : incomingSeo.noindex,
    keywords:
      incomingSeo.keywords === undefined ? previousSeo.keywords : incomingSeo.keywords,
    ogImage: incomingSeo.ogImage || previousSeo.ogImage,
  };
}

// Create a blog
export const createBlog = async (req, res) => {
  const { title, excerpt, content, status, coverImage, thumbnailImage, seo } =
    req.body;
  const uploadedImageIds = collectReferencedImagePublicIds({
    coverImage,
    thumbnailImage,
    content,
  });

  try {
    if (!title || !content) {
      await writeAuditLog({
        level: "warn",
        domain: "blog-image",
        eventType: "blog_create_validation_failed",
        req,
        details: {
          uploadedImageIds,
        },
      });
      await destroyCloudinaryAssets(uploadedImageIds, {
        req,
        reason: "create_validation_failed",
      });
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const normalizedSeo = buildBlogSeo({
      title,
      excerpt,
      content,
      slug,
      coverImage,
      seo,
    });

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      status,
      coverImage,
      thumbnailImage,
      seo: normalizedSeo,
      readingTimeMinutes: calculateReadingTimeMinutes(content),
    });

    await writeAuditLog({
      domain: "blog-image",
      eventType: "blog_created",
      req,
      blog: {
        id: blog._id?.toString?.() || null,
        slug: blog.slug,
        title: blog.title,
      },
      details: {
        status: blog.status,
        referencedImageIds: uploadedImageIds,
      },
    });

    res.status(201).json({
      success: true,
      blog,
    });
  } catch (err) {
    console.error(err);
    await writeAuditLog({
      level: "error",
      domain: "blog-image",
      eventType: "blog_create_failed",
      req,
      details: {
        error: err.message,
        uploadedImageIds,
      },
    });
    await destroyCloudinaryAssets(uploadedImageIds, {
      req,
      reason: "create_failed_cleanup",
    });
    res.status(500).json({ success: false });
  }
};

// Get All Blogs
export const getBlogs = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", status } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    const totalBlogs = await Blog.countDocuments(filter);

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs,
      blogs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// Get a single Blog by identifier
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOneAndUpdate(
      { slug, status: "published" },
      { $inc: { views: 1 } },
      { new: true },
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// Update a blog
export const updateBlog = async (req, res) => {
  let cleanupOnFailure = [];
  let blogId = null;

  try {
    const { id } = req.params;
    blogId = id;
    const { title, excerpt, content, status, coverImage, thumbnailImage, seo } =
      req.body;
    const uploadedImageIds = collectReferencedImagePublicIds({
      coverImage,
      thumbnailImage,
      content,
    });

    const blog = await Blog.findById(id);

    if (!blog) {
      await writeAuditLog({
        level: "warn",
        domain: "blog-image",
        eventType: "blog_update_missing_blog",
        req,
        blog: {
          id,
        },
        details: {
          uploadedImageIds,
        },
      });
      await destroyCloudinaryAssets(uploadedImageIds, {
        req,
        reason: "update_missing_blog_cleanup",
      });
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const { updates, deleteAfterSave, cleanupOnFailure: pendingCleanup } =
      buildImageUpdatePlan({
        currentBlog: blog,
        nextCoverImage: coverImage,
        nextThumbnailImage: thumbnailImage,
        nextContent: content,
      });

    cleanupOnFailure = pendingCleanup;

    await writeAuditLog({
      domain: "blog-image",
      eventType: "blog_update_plan_built",
      req,
      blog: {
        id: blog._id?.toString?.() || id,
        slug: blog.slug,
        title: blog.title,
      },
      details: {
        deleteAfterSave,
        cleanupOnFailure,
        nextStatus: status,
      },
    });

    if (updates.coverImage) {
      blog.coverImage = updates.coverImage;
    }

    if (updates.thumbnailImage) {
      blog.thumbnailImage = updates.thumbnailImage;
    }

    if (title && title !== blog.title) {
      const baseSlug = slugify(title, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;

      while (await Blog.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      blog.slug = slug;
      blog.title = title;
    }

    if (updates.content) {
      blog.content = updates.content;
    }

    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (status !== undefined) blog.status = status;
    blog.seo = buildBlogSeo({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      slug: blog.slug,
      coverImage: blog.coverImage,
      seo: resolveSeoOverrides(blog, seo || {}),
    });
    blog.readingTimeMinutes = calculateReadingTimeMinutes(blog.content);

    await blog.save();

    await writeAuditLog({
      domain: "blog-image",
      eventType: "blog_updated",
      req,
      blog: {
        id: blog._id?.toString?.() || id,
        slug: blog.slug,
        title: blog.title,
      },
      details: {
        status: blog.status,
        deletedImageIdsQueued: deleteAfterSave,
      },
    });

    res.status(200).json({
      success: true,
      blog,
    });

    await destroyCloudinaryAssets(deleteAfterSave, {
      req,
      reason: "update_replace_cleanup",
      blogId: blog._id?.toString?.() || id,
    });
  } catch (err) {
    console.error(err);
    await writeAuditLog({
      level: "error",
      domain: "blog-image",
      eventType: "blog_update_failed",
      req,
      blog: {
        id: blogId,
      },
      details: {
        error: err.message,
        cleanupOnFailure,
      },
    });
    await destroyCloudinaryAssets(cleanupOnFailure, {
      req,
      reason: "update_failure_rollback",
    });
    res.status(500).json({ success: false });
  }
};

// delete a blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const assetIds = collectReferencedImagePublicIds({
      coverImage: blog.coverImage,
      thumbnailImage: blog.thumbnailImage,
      content: blog.content,
    });

    await writeAuditLog({
      domain: "blog-image",
      eventType: "blog_delete_requested",
      req,
      blog: {
        id: blog._id?.toString?.() || id,
        slug: blog.slug,
        title: blog.title,
      },
      details: {
        assetIds,
      },
    });

    await blog.deleteOne();
    await destroyCloudinaryAssets(assetIds, {
      req,
      reason: "blog_deleted_cleanup",
      blogId: blog._id?.toString?.() || id,
    });

    res.status(200).json({
      success: true,
      message: "Blog and all images deleted",
    });
  } catch (err) {
    console.error(err);
    await writeAuditLog({
      level: "error",
      domain: "blog-image",
      eventType: "blog_delete_failed",
      req,
      blog: {
        id: req.params?.id || null,
      },
      details: {
        error: err.message,
      },
    });
    res.status(500).json({ success: false });
  }
};

// Get Blog by ID
export const getBlogById = async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  res.status(200).json({
    success: true,
    blog,
  });
};

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export const getBlogSitemap = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "published" })
      .sort({ updatedAt: -1 })
      .select("slug updatedAt createdAt");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogs
  .filter((blog) => blog.slug)
  .map((blog) => {
    const lastmod = new Date(blog.updatedAt || blog.createdAt || Date.now())
      .toISOString()
      .split("T")[0];

    return `  <url>
    <loc>${escapeXml(`${SITE_URL}/blogs/${blog.slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  })
  .join("\n")}
</urlset>
`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    return res.status(200).send(xml);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};
