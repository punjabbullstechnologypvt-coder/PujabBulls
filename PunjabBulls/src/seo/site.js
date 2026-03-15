export const SITE_URL = "https://www.punjabbulls.com";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const SITE_NAME = "PunjabBulls Technology Pvt. Ltd.";

export function normalizePath(path = "/") {
  if (!path || path === "/") {
    return "";
  }

  const ensuredLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return ensuredLeadingSlash.replace(/\/+$/, "");
}

export function toAbsoluteUrl(path = "/") {
  if (!path) {
    return SITE_URL;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path.endsWith("/") && path !== `${SITE_URL}/`
      ? path.replace(/\/+$/, "")
      : path === `${SITE_URL}/`
        ? SITE_URL
        : path;
  }

  return `${SITE_URL}${normalizePath(path)}`;
}
