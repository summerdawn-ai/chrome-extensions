(() => {
  const SCRIPT_ID = "substack-archive-enhancer-page-script";
  const { pathname } = window.location;

  if (!pathname.startsWith("/p/")) {
    return;
  }

  if (document.getElementById(SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = chrome.runtime.getURL("page-script.js");
  script.onload = () => script.remove();

  (document.head || document.documentElement).appendChild(script);
})();
