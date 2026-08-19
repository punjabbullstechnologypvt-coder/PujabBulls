// Verifies a Google reCAPTCHA v2 token against Google's siteverify endpoint.
//
// Behavior:
//   - If RECAPTCHA_SECRET_KEY is not set, skips verification and logs a warning
//     (dev-friendly — lets you run the app locally without configuring reCAPTCHA).
//   - If the client didn't send a token, rejects with 400.
//   - If Google says the token is invalid, rejects with 400.
//   - If Google's siteverify endpoint itself is unreachable or errors, FAILS OPEN
//     (lets the request through). Chosen deliberately: prefer occasional spam over
//     blocking every legitimate user during a Google outage. All such incidents are
//     logged to the console so you can spot patterns.
//
// Expects the token in `req.body.recaptchaToken`.

const SITEVERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

function normalizeIp(ipAddress) {
  if (!ipAddress) return "";
  return ipAddress.startsWith("::ffff:") ? ipAddress.slice(7) : ipAddress;
}

export const verifyRecaptcha = async (req, res, next) => {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  // Dev-friendly: no secret configured → skip verification
  if (!secret) {
    console.warn(
      "[reCAPTCHA] RECAPTCHA_SECRET_KEY not set — skipping verification"
    );
    return next();
  }

  const token = req.body?.recaptchaToken;

  if (!token || typeof token !== "string") {
    return res.status(400).json({
      success: false,
      message: "reCAPTCHA verification required",
    });
  }

  const remoteip = normalizeIp(req.ip || req.socket?.remoteAddress);

  const params = new URLSearchParams({
    secret,
    response: token,
  });
  if (remoteip) params.append("remoteip", remoteip);

  let verification;

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!response.ok) {
      console.error(
        `[reCAPTCHA] siteverify HTTP ${response.status} — failing open`
      );
      return next();
    }

    verification = await response.json();
  } catch (err) {
    // Network error, DNS failure, timeout — fail open, log for monitoring
    console.error(
      "[reCAPTCHA] siteverify network error — failing open:",
      err.message
    );
    return next();
  }

  if (!verification?.success) {
    return res.status(400).json({
      success: false,
      message: "reCAPTCHA verification failed",
      errors: verification?.["error-codes"] || [],
    });
  }

  // Expose the full Google response for downstream use if needed
  req.recaptcha = verification;
  return next();
};
