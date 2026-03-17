import LogRocket from "logrocket";

const PROJECT_ID = import.meta.env.VITE_LOGROCKET_PROJECT_ID?.trim();
const ADMIN_EMAIL_KEY = "adminEmail";

let initialized = false;
let hasStartedTrackedSession = false;

const TRACKED_ADMIN_PATHS = [
  "/admin/login",
  "/admin/blogs",
  "/admin/blogs/create",
  "/admin/blogs/edit/",
  "/admin/upload-video",
  "/admin/manage-videos",
  "/admin/image-audit-logs",
];

export function isTrackedAdminPath(pathname = "") {
  return TRACKED_ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(path));
}

function canUseTelemetry() {
  return typeof window !== "undefined" && Boolean(PROJECT_ID);
}

export function ensureAdminTelemetryInitialized() {
  if (!canUseTelemetry() || initialized) {
    return initialized;
  }

  LogRocket.init(PROJECT_ID, {
    shouldSendData: () => isTrackedAdminPath(window.location.pathname),
  });

  initialized = true;
  return true;
}

export function persistAdminIdentity(email) {
  if (typeof window === "undefined" || !email) {
    return;
  }

  localStorage.setItem(ADMIN_EMAIL_KEY, email);
}

export function clearAdminIdentity() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ADMIN_EMAIL_KEY);
}

export function syncAdminIdentity(email) {
  if (!email) {
    return;
  }

  persistAdminIdentity(email);

  if (!ensureAdminTelemetryInitialized()) {
    return;
  }

  LogRocket.identify(email, {
    email,
    role: "admin",
  });
}

export function syncStoredAdminIdentity() {
  if (typeof window === "undefined") {
    return;
  }

  syncAdminIdentity(localStorage.getItem(ADMIN_EMAIL_KEY));
}

export function startTrackedAdminSession() {
  if (!ensureAdminTelemetryInitialized()) {
    return false;
  }

  if (hasStartedTrackedSession) {
    LogRocket.startNewSession();
  } else {
    hasStartedTrackedSession = true;
  }

  syncStoredAdminIdentity();
  return true;
}

export function trackAdminEvent(eventName, eventProperties = {}) {
  if (!ensureAdminTelemetryInitialized() || !isTrackedAdminPath(window.location.pathname)) {
    return;
  }

  LogRocket.track(eventName, eventProperties);
}
