import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { GoogleReCaptchaProvider } from "@google-recaptcha/react";
import App from "./App";
import "./index.css";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const container = document.getElementById("root");
const isPrerenderedShell = Boolean(
  document.querySelector('meta[name="prerendered-route"]')
);
const app = (
  <HelmetProvider>
    <BrowserRouter>
      <GoogleReCaptchaProvider type="v2-checkbox" siteKey={RECAPTCHA_SITE_KEY}>
        <App />
      </GoogleReCaptchaProvider>
    </BrowserRouter>
  </HelmetProvider>
);

if (container.hasChildNodes() && !isPrerenderedShell) {
  ReactDOM.hydrateRoot(container, app);
} else {
  if (isPrerenderedShell) {
    container.innerHTML = "";
  }
  ReactDOM.createRoot(container).render(app);
}
