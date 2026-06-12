const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

const BLOCKED_PARAM_KEYS = [
  "name",
  "email",
  "phone",
  "mobile",
  "resume",
  "resumeText",
  "generatedResume",
  "jobDescription",
  "file",
  "fileContent",
  "uploadedFile",
];

let analyticsInitialized = false;
let lastTrackedPath = "";

function hasAnalyticsId() {
  return Boolean(GA_MEASUREMENT_ID);
}

function normalizeEventName(eventName) {
  return String(eventName || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function sanitizeParams(params = {}) {
  return Object.entries(params).reduce((safeParams, [key, value]) => {
    if (BLOCKED_PARAM_KEYS.includes(key)) {
      return safeParams;
    }

    if (["string", "number", "boolean"].includes(typeof value)) {
      safeParams[key] =
        typeof value === "string" ? value.slice(0, 120) : value;
    }

    return safeParams;
  }, {});
}

export function initializeAnalytics() {
  if (!hasAnalyticsId() || analyticsInitialized || typeof window === "undefined") {
    return;
  }

  analyticsInitialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function trackPageView(path) {
  if (!hasAnalyticsId() || typeof window === "undefined") {
    return;
  }

  if (path === lastTrackedPath) {
    return;
  }

  lastTrackedPath = path;
  initializeAnalytics();

  window.gtag?.("config", GA_MEASUREMENT_ID, {
    page_path: path,
  });
}

export function trackEvent(eventName, params = {}) {
  if (!hasAnalyticsId() || typeof window === "undefined") {
    return;
  }

  const normalizedEventName = normalizeEventName(eventName);
  if (!normalizedEventName) {
    return;
  }

  initializeAnalytics();

  window.gtag?.("event", normalizedEventName, {
    event_label: eventName,
    ...sanitizeParams(params),
  });
}
