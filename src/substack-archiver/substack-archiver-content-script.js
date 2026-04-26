(() => {
  const SCRIPT_ID = "substack-archive-enhancer-page-script";
  const { protocol, pathname } = window.location;

  if ((protocol !== "https:" && protocol !== "http:") || !pathname.startsWith("/p/")) {
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