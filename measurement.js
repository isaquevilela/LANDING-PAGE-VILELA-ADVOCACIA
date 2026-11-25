const adsId = "AW-18588684549";
const adsConversion = adsId + "/nvJpCIWZpb8dEIWi459F";
const storageKey = "vilela.measurement.v2";
const sourceKey = "vilela.google-ads-visit";
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

  function updateConsent(choice) {
    const previous = consent;
    consent = choice;
    refreshMessages();
    if (choice === "granted" && previous !== "granted") {
      enableMeasurement();
    } else if (choice !== "granted" && previous === "granted") {
      gtag("consent", "update", consentSignals("denied"));
    }
  }

  settings.hidden = false;
  settings.addEventListener("click", () => {
    dialog.returnValue = "";
    dialog.showModal();
  });
  dialog.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const choice = event.submitter?.value;
    if (choice !== "granted" && choice !== "denied") return;
    try {
      localStorage.setItem(storageKey, choice);
    } catch {
      // In-memory choice still controls this visit.
    }
    updateConsent(choice);
    dialog.close();
  });
  if (consent === "granted") enableMeasurement();
  refreshMessages();
  if (!consent) dialog.showModal();
  window.addEventListener("storage", (event) => {
    if (event.key === storageKey || event.key === null) {
      updateConsent(localStorage.getItem(storageKey) || "");
    }
  });
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    try { updateConsent(localStorage.getItem(storageKey) || ""); } catch {}
  });

  function trackWhatsApp(event) {
    if (consent !== "granted" || event.defaultPrevented) return;
    const link = event.target.closest("a[href]");
    if (!link) return;
    if (!isWhatsApp(new URL(link.href))) return;
    window.dataLayer.push({ event: "whatsapp_click" });
    gtag("event", "conversion", { send_to: adsConversion });
  }

  document.addEventListener("click", trackWhatsApp);
  document.addEventListener("auxclick", (event) => {
    if (event.button === 1) trackWhatsApp(event);
  });
}
