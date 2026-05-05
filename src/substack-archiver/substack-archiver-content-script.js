(() => {
  const SCRIPT_ID = "substack-archive-enhancer-page-script";
  const { pathname } = window.location;

  if (!pathname.startsWith("/p/")) {
    return;
  }

  const saveButtonSelector =
    'button.post-ufi-button.style-tabs[aria-label="Save"],' +
    'button.post-ufi-button.style-tabs[aria-label="Unsave"]';

  if (!document.querySelector(saveButtonSelector)) {
    return;
  }

  if (document.getElementById(SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = chrome.runtime.getURL("substack-archiver-page-script.js");
  script.onload = () => script.remove();

  (document.head || document.documentElement).appendChild(script);
})();