const adsId = "AW-18588684549";
const adsConversion = adsId + "/nvJpCIWZpb8dEIWi459F";
const storageKey = "vilela.measurement.v2";
const pageId = document.body.dataset.pageId;
const dialog = document.querySelector(".privacy-dialog");
const settings = document.querySelector("[data-open-privacy]");

let consent = "";
let tagLoaded = false;
try {
  consent = localStorage.getItem(storageKey) || "";
} catch {
  // The current page still honors a choice when persistent storage is unavailable.
}

function consentSignals(choice) {
  const status = choice === "granted" ? "granted" : "denied";
  return {
    analytics_storage: "denied",
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
  if (tagLoaded) {
    gtag("consent", "update", consentSignals("granted"));
    return;
  }
  tagLoaded = true;
  gtag("consent", "default", consentSignals("denied"));
  gtag("consent", "update", consentSignals("granted"));
  gtag("js", new Date());
  gtag("config", adsId, {
    allow_ad_personalization_signals: false,
    page_location: location.origin + location.pathname,
    page_referrer: "",
  });
  const script = document.createElement("script");
  script.async = true;
  script.referrerPolicy = "no-referrer";
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + adsId;
  document.head.append(script);
}

if (pageId && dialog && settings) {
  settings.hidden = false;
  settings.addEventListener("click", () => {
    dialog.returnValue = "";
    dialog.showModal();
  });
  dialog.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const choice = event.submitter?.value;
    if (choice !== "granted" && choice !== "denied") return;
    const previous = consent;
    consent = choice;
    try {
      localStorage.setItem(storageKey, choice);
    } catch {
      // In-memory choice still controls this visit.
    }
    if (choice === "granted" && previous !== "granted") {
      enableMeasurement();
    } else if (choice === "denied" && previous === "granted") {
      gtag("consent", "update", consentSignals("denied"));
    }
    dialog.close();
  });
  if (consent === "granted") enableMeasurement();
  if (!consent) dialog.showModal();

  function trackWhatsApp(event) {
    if (consent !== "granted" || event.defaultPrevented) return;
    const link = event.target.closest("a[href]");
    if (!link) return;
    const { protocol, hostname } = new URL(link.href, location.href);
    const isWhatsApp = protocol === "whatsapp:" ||
      (protocol === "https:" && ["wa.me", "api.whatsapp.com", "web.whatsapp.com"].includes(hostname));
    if (isWhatsApp) gtag("event", "conversion", { send_to: adsConversion });
  }

  document.addEventListener("click", trackWhatsApp);
  document.addEventListener("auxclick", (event) => {
    if (event.button === 1) trackWhatsApp(event);
  });
}
