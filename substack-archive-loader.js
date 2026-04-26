(() => {
  const SCRIPT_ID = "substack-archive-enhancer-page-script";

  if (document.getElementById(SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = chrome.runtime.getURL("substack-archive-enhancer.js");
  script.onload = () => script.remove();

  (document.head || document.documentElement).appendChild(script);
})();