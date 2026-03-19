const DEFAULT_SITE_URL = "https://www.punjabbulls.com";
const DEFAULT_AUTHOR_NAME = "PunjabBulls Technology Pvt. Ltd.";

function normalizeWhitespace(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function truncateAtWord(value, maxLength) {
  const normalized = normalizeWhitespace(value);

  if (!normalized || normalized.length <= maxLength) {
    return normalized;
  }

  const slice = normalized.slice(0, maxLength + 1);
  const lastSpace = slice.lastIndexOf(" ");

  return `${slice.slice(0, lastSpace > 40 ? lastSpace : maxLength).trim()}...`;
}

function extractTextFromEditorNode(node) {
  if (typeof node === "string") {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromEditorNode).join(" ");
  }

  if (!node || typeof node !== "object") {
    return "";
  }

  return Object.values(node).map(extractTextFromEditorNode).join(" ");
}

export function extractPlainTextFromContent(content) {
  if (!content || typeof content !== "object") {
    return "";
  }

  const blocks = Array.isArray(content.blocks) ? content.blocks : [];
  const rawText = blocks
    .map((block) => extractTextFromEditorNode(block?.data))
    .join(" ");

  return normalizeWhitespace(rawText.replace(/<[^>]*>/g, " "));
}

export function calculateReadingTimeMinutes(content) {
  const text = extractPlainTextFromContent(content);
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;

  return Math.max(1, Math.ceil(wordCount / 200));
}

function normalizeKeywords(keywords) {
  if (Array.isArray(keywords)) {
    return keywords
      .map((keyword) => normalizeWhitespace(String(keyword || "")))
      .filter(Boolean);
  }

  if (typeof keywords === "string") {
    return keywords
      .split(",")
      .map((keyword) => normalizeWhitespace(keyword))
      .filter(Boolean);
  }

  return [];
}

function toAbsoluteCanonical(value, slug) {
  const candidate = normalizeWhitespace(value || "");
  const fallbackPath = `/blogs/${slug}`;

  if (!candidate) {
    return `${DEFAULT_SITE_URL}${fallbackPath}`;
  }

  if (/^https?:\/\//i.test(candidate)) {
    return candidate;
  }

  return `${DEFAULT_SITE_URL}${candidate.startsWith("/") ? candidate : fallbackPath}`;
}

export function buildBlogSeo({
  title,
  excerpt,
  content,
  slug,
  coverImage,
  seo = {},
}) {
  const bodyText = extractPlainTextFromContent(content);
  const metaTitle = truncateAtWord(
    seo.metaTitle || `${title} | PunjabBulls Blog`,
    60,
  );
  const metaDescription = truncateAtWord(
    seo.metaDescription || excerpt || bodyText || `Read ${title} on the PunjabBulls blog.`,
    160,
  );

  return {
    metaTitle,
    metaDescription,
    keywords: normalizeKeywords(seo.keywords),
    canonicalUrl: toAbsoluteCanonical(seo.canonicalUrl, slug),
    ogImageAlt: normalizeWhitespace(seo.ogImageAlt || title),
    noindex: Boolean(seo.noindex),
    schemaType: normalizeWhitespace(seo.schemaType || "BlogPosting"),
    authorName: normalizeWhitespace(seo.authorName || DEFAULT_AUTHOR_NAME),
    ogImage: {
      url: seo.ogImage?.url || coverImage?.url || "",
      public_id: seo.ogImage?.public_id || coverImage?.public_id || "",
    },
  };
}

