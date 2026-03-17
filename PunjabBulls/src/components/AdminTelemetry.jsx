import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  isTrackedAdminPath,
  startTrackedAdminSession,
  syncStoredAdminIdentity,
  trackAdminEvent,
} from "../services/adminTelemetry";

export default function AdminTelemetry() {
  const location = useLocation();
  const previousTrackedRef = useRef(false);

  useEffect(() => {
    const isTrackedRoute = isTrackedAdminPath(location.pathname);

    if (!isTrackedRoute) {
      previousTrackedRef.current = false;
      return;
    }

    if (!previousTrackedRef.current) {
      startTrackedAdminSession();
    } else {
      syncStoredAdminIdentity();
    }

    trackAdminEvent("admin_page_view", {
      path: location.pathname,
    });

    previousTrackedRef.current = true;
  }, [location.pathname]);

  return null;
}
