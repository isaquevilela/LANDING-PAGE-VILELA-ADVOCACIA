const adsId = "AW-18588684549";
const adsConversion = adsId + "/nvJpCIWZpb8dEIWi459F";
const analyticsId = "G-40LS8KMKGJ";
const analyticsDisable = "ga-disable-" + analyticsId;
const analyticsKey = "vilela.analytics.v1";
const storageKey = "vilela.measurement.v2";
const sourceKey = "vilela.google-ads-visit";
const pageId = document.body.dataset.pageId;
const dialog = document.querySelector(".privacy-dialog");
const settings = document.querySelector("[data-open-privacy]");

let consent = "";
let analyticsConsent = "";
let tagLoaded = false;
let adsConfigured = false;
let analyticsConfigured = false;
let pageViewSent = false;
window[analyticsDisable] = true;
try {
  consent = localStorage.getItem(storageKey) || "";
  analyticsConsent = localStorage.getItem(analyticsKey) || "";
} catch {
  // The current page still honors a choice when persistent storage is unavailable.
}

function consentSignals(choice) {
  const status = choice === "granted" ? "granted" : "denied";
  return {
    analytics_storage: choice === "default" || analyticsConsent !== "granted" ? "denied" : "granted",
    ad_storage: status,
    ad_user_data: status,
    ad_personalization: "denied",
  };
}

function gtag() {
  window.dataLayer.push(arguments);
}

function enableMeasurement() {
  window.dataLayer ||= [];
  tagLoaded = true;
  gtag("consent", "default", {
    ...consentSignals("default"),
    ad_storage: "denied",
    ad_user_data: "denied",
  });
  gtag("consent", "update", consentSignals(consent));
  gtag("set", {
    ...analyticsContext(),
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    allow_enhanced_conversions: false,
  });
  gtag("js", new Date());
  const script = document.createElement("script");
  script.async = true;
  script.referrerPolicy = "no-referrer";
  script.src = "https://www.googletagmanager.com/gtag/js?id=" +
    (consent === "granted" ? adsId : analyticsId);
  document.head.append(script);
}

function configureAds() {
  adsConfigured = true;
  gtag("config", adsId, {
    allow_ad_personalization_signals: false,
    page_location: location.origin + location.pathname,
    page_referrer: "",
  });
}

function analyticsContext() {
  const page = new URL(location.pathname, location.origin);
  const query = new URLSearchParams(location.search);
  if (consent === "granted") {
    for (const key of ["gclid", "gbraid", "wbraid"]) {
      const value = query.get(key) || "";
      if (/^[A-Za-z0-9_-]{10,200}$/.test(value)) page.searchParams.set(key, value);
    }
  }
  const referrer = document.referrer ? new URL(document.referrer) : null;
  const source = query.get("utm_source");
  const medium = query.get("utm_medium");
  return {
    page_location: page.href,
    page_referrer: referrer && ["http:", "https:"].includes(referrer.protocol) ? referrer.origin + "/" : "",
    ...(["google", "bing", "facebook", "instagram", "newsletter"].includes(source) ? { campaign_source: source } : {}),
    ...(["cpc", "ppc", "organic", "social", "email", "referral", "paid_social"].includes(medium) ? { campaign_medium: medium } : {}),
    ...(/^\d{1,12}$/.test(query.get("utm_id") || "") ? { campaign_id: query.get("utm_id") } : {}),
  };
}

function applyMeasurementConsent() {
  const analyticsAllowed = analyticsConsent === "granted";
  window[analyticsDisable] = !analyticsAllowed;
  if (tagLoaded) {
    gtag("consent", "update", consentSignals(consent));
  } else if (consent === "granted" || analyticsAllowed) {
    enableMeasurement();
  }
  if (consent === "granted" && !adsConfigured) configureAds();
  if (!analyticsAllowed) return;

  gtag("config", analyticsId, {
    ...analyticsContext(),
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ...(analyticsConfigured ? { update: true } : {}),
  });
  analyticsConfigured = true;
  if (!pageViewSent) {
    pageViewSent = true;
    gtag("event", "page_view", { send_to: analyticsId, ...analyticsContext() });
  }
}

function isWhatsApp(url) {
  return url.protocol === "whatsapp:" ||
    (url.protocol === "https:" && ["wa.me", "api.whatsapp.com", "web.whatsapp.com"].includes(url.hostname));
}

function googleAdsVisit() {
  if (consent !== "granted") {
    try { sessionStorage.removeItem(sourceKey); } catch {}
    return false;
  }
  const query = new URLSearchParams(location.search);
  const campaignClick = ["gclid", "gbraid", "wbraid"].some((key) =>
    /^[A-Za-z0-9_-]+$/.test(query.get(key) || "")
  );
  try {
    if (campaignClick) sessionStorage.setItem(sourceKey, "1");
    return sessionStorage.getItem(sourceKey) === "1";
  } catch {
    return campaignClick;
  }
}

if (pageId && dialog && settings) {
  const form = dialog.querySelector("form");
  const analyticsChoice = form.elements.namedItem("analytics");
  const whatsappLinks = [...document.querySelectorAll("a[href]")]
    .map((link) => ({ link, original: new URL(link.href) }))
    .filter(({ original }) => isWhatsApp(original));

  function refreshMessages() {
    const attributed = googleAdsVisit();
    for (const { link, original } of whatsappLinks) {
      const message = original.searchParams.get("text");
      const revised = attributed && message?.replace(
        /Acessei (?:sua página de Direito (?:Trabalhista|do Consumidor)|o site da Vilela Advocacia Especializada)/,
        "Encontrei seu site pelo Google"
      );
      if (revised && revised !== message) {
        const destination = new URL(original);
        destination.searchParams.set("text", revised);
        link.href = destination.href;
      } else {
        link.href = original.href;
      }
    }
  }

  function updateConsent(choice, analytics) {
    if (choice === consent && analytics === analyticsConsent && tagLoaded) return;
    consent = choice;
    analyticsConsent = analytics;
    analyticsChoice.checked = analytics === "granted";
    refreshMessages();
    applyMeasurementConsent();
  }

  settings.hidden = false;
  settings.addEventListener("click", () => {
    analyticsChoice.checked = analyticsConsent === "granted";
    dialog.showModal();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const choice = event.submitter?.value;
    if (choice !== "granted" && choice !== "denied") return;
    const analytics = analyticsChoice.checked ? "granted" : "denied";
    try {
      localStorage.setItem(storageKey, choice);
      localStorage.setItem(analyticsKey, analytics);
    } catch {
      // In-memory choice still controls this visit.
    }
    updateConsent(choice, analytics);
    dialog.close();
  });
  updateConsent(consent, analyticsConsent);
  if (!consent) dialog.showModal();
  window.addEventListener("storage", (event) => {
    if (event.key === storageKey || event.key === analyticsKey || event.key === null) {
      updateConsent(localStorage.getItem(storageKey) || "", localStorage.getItem(analyticsKey) || "");
    }
  });
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    try { updateConsent(localStorage.getItem(storageKey) || "", localStorage.getItem(analyticsKey) || ""); } catch {}
  });

  function trackWhatsApp(event) {
    if (event.defaultPrevented || (consent !== "granted" && analyticsConsent !== "granted")) return;
    const link = event.target.closest("a[href]");
    if (!link) return;
    if (!isWhatsApp(new URL(link.href))) return;
    window.dataLayer.push({ event: "whatsapp_click" });
    if (consent === "granted") gtag("event", "conversion", { send_to: adsConversion });
    if (analyticsConsent === "granted") {
      const position = link.dataset.buttonPosition;
      gtag("event", "whatsapp_click", {
        send_to: analyticsId,
        ...analyticsContext(),
        button_position: ["hero", "middle", "footer", "floating"].includes(position) ? position :
          link.closest("footer") ? "footer" :
          link.closest(".hero") ? "hero" :
          link.matches(".floating-whatsapp") ? "floating" : "middle",
      });
    }
  }

  document.addEventListener("click", trackWhatsApp);
  document.addEventListener("auxclick", (event) => {
    if (event.button === 1) trackWhatsApp(event);
  });
}
