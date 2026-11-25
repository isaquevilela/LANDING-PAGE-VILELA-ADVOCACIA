// Set after the consent, Google Tag Manager and destination settings are approved.
const gtmId = "";
const storageKey = "vilela.measurement.v1";
const pageId = document.body.dataset.pageId;
const dialog = document.querySelector(".privacy-dialog");
const settings = document.querySelector("[data-open-privacy]");
const configured = /^GTM-[A-Z0-9]+$/.test(gtmId);

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
    analytics_storage: status,
    ad_storage: status,
    ad_user_data: status,
    ad_personalization: "denied",
  };
}

function pushConsent() {
  window.dataLayer.push(arguments);
}

function enableMeasurement() {
  const layer = window.dataLayer ||= [];
  if (tagLoaded) {
    pushConsent("consent", "update", consentSignals("granted"));
    return;
  }
  tagLoaded = true;
  pushConsent("consent", "default", consentSignals("denied"));
  pushConsent("consent", "update", consentSignals("granted"));
  layer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.referrerPolicy = "no-referrer";
  script.src = "https://www.googletagmanager.com/gtm.js?id=" + gtmId;
  document.head.append(script);
}

if (configured && pageId && dialog && settings) {
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
      pushConsent("consent", "update", consentSignals("denied"));
    }
    dialog.close();
  });
  if (consent === "granted") enableMeasurement();
  if (!consent) dialog.showModal();

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-whatsapp-cta]");
    if (!button || consent !== "granted") return;
    window.dataLayer.push({
      event: "whatsapp_click",
      page_id: pageId,
      button_position: button.dataset.buttonPosition,
      cta_id: button.dataset.whatsappCta,
    });
  });
}
