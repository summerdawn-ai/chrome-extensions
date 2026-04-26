(() => {
  const PATCH_KEY = "__substackArchiveEnhancer";
  const MENU_ITEM_ATTR = "data-substack-archive-menu-item";
  const TOAST_ATTR = "data-substack-archive-toast";

  if (window[PATCH_KEY]?.installed) {
    return;
  }

  function getPostContext() {
    const post = window._preloads?.post;
    const inboxItem = post?.inboxItem;
    const postId = post?.id ?? inboxItem?.post_id;
    const publicationId =
      post?.publication_id ??
      inboxItem?.publication_id ??
      window._preloads?.pub?.id;

    if (!postId || !publicationId) {
      throw new Error("Could not resolve Substack post or publication id");
    }

    return {
      postId,
      publicationId,
      isArchived: !!inboxItem?.archived_at,
    };
  }

  function tryGetPostContext() {
    try {
      return getPostContext();
    } catch {
      return null;
    }
  }

  function setLocalArchiveState(isArchived) {
    const inboxItem = window._preloads?.post?.inboxItem;
    if (!inboxItem) return;

    const now = new Date().toISOString();
    inboxItem.archived_at = isArchived ? now : null;
    inboxItem.updated_at = now;
  }

  async function setArchiveState(isArchived) {
    const { postId, publicationId } = getPostContext();
    const body = {
      contentKey: `post:${postId}`,
      post_id: postId,
      publication_id: publicationId,
    };

    if (!isArchived) {
      body.archived = false;
    }

    const response = await fetch("/api/v1/inbox/archive", {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(
        `Archive request failed: ${response.status} ${await response.text()}`
      );
    }

    setLocalArchiveState(isArchived);
  }

  function getToastViewport() {
    let region = document.querySelector(
      '[role="region"][aria-label="Notifications (F8)"]'
    );

    if (!region) {
      region = document.createElement("div");
      region.setAttribute("role", "region");
      region.setAttribute("aria-label", "Notifications (F8)");
      region.style.pointerEvents = "none";
      region.tabIndex = -1;

      const viewport = document.createElement("ol");
      viewport.className = "viewport-_BM4Bg";
      viewport.style.zIndex = "1000";
      viewport.style.setProperty("--offset", "0px");
      viewport.tabIndex = -1;

      region.appendChild(viewport);
      document.body.appendChild(region);
    }

    let viewport = region.querySelector("ol");
    if (!viewport) {
      viewport = document.createElement("ol");
      viewport.className = "viewport-_BM4Bg";
      viewport.style.zIndex = "1000";
      viewport.style.setProperty("--offset", "0px");
      viewport.tabIndex = -1;
      region.appendChild(viewport);
    }

    return viewport;
  }

  function dismissToast(toast) {
    if (!toast?.isConnected) return;
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    setTimeout(() => toast.remove(), 180);
  }

  function toastIconMarkup(kind) {
    if (kind === "undo") {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--vibrance-dark-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 7v6h6"></path>
          <path d="M21 17a9 9 0 0 0-15-6.7L3 13"></path>
        </svg>`;
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--vibrance-dark-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="20" height="5" x="2" y="3" rx="1"></rect>
        <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
        <path d="M10 12h4"></path>
      </svg>`;
  }

  function showToast(message, icon = "archive", actionText, onAction) {
    document.querySelectorAll(`[${TOAST_ATTR}]`).forEach((element) => {
      element.remove();
    });

    const viewport = getToastViewport();
    const toast = document.createElement("li");
    toast.setAttribute(TOAST_ATTR, "true");
    toast.tabIndex = 0;
    toast.className = "toast-IVcFeu";
    toast.style.userSelect = "none";
    toast.style.touchAction = "none";
    toast.style.pointerEvents = "auto";
    toast.style.transition = "opacity 180ms ease, transform 180ms ease";
    toast.innerHTML = `
      <div class="pencraft pc-display-contents pc-reset dark-theme">
        <div class="pencraft pc-display-flex pc-flexDirection-row pc-gap-12 pc-paddingLeft-16 pc-paddingRight-16 pc-paddingTop-12 pc-paddingBottom-12 pc-alignItems-center pc-reset content-etG1Ty">
          ${toastIconMarkup(icon)}
          <div class="pencraft pc-display-flex pc-flexDirection-row pc-alignItems-center pc-gap-32 pc-reset flex-grow-rzmknG">
            <div class="pencraft pc-display-flex pc-flexDirection-column pc-gap-4 pc-reset flex-grow-rzmknG">
              <div class="pencraft pc-reset color-vibrance-primary-KHCdqV line-height-20-t4M0El font-text-qe4AeH size-15-Psle70 weight-regular-mUq6Gb reset-IxiVJZ">${message}</div>
            </div>
            ${
              actionText
                ? `<button type="button" class="pencraft pc-reset pencraft buttonBase-GK1x3M buttonText-X0uSmG buttonStyle-r7yGCK priority_secondary-outline-MgyjoK size_sm-G3LciD">${actionText}</button>`
                : ""
            }
          </div>
          <button type="button" aria-label="Close" class="pencraft pc-reset pencraft iconButton-mq_Et5 iconButtonBase-dJGHgN buttonBase-GK1x3M buttonStyle-r7yGCK size_xs-Q62jAa priority_quaternary-kpMibu">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--vibrance-dark-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
      </div>`;

    toast
      .querySelector(".priority_secondary-outline-MgyjoK")
      ?.addEventListener("click", async () => {
        try {
          await onAction?.();
        } finally {
          dismissToast(toast);
        }
      });

    toast
      .querySelector('[aria-label="Close"]')
      ?.addEventListener("click", () => dismissToast(toast));

    viewport.appendChild(toast);
    setTimeout(() => dismissToast(toast), 4500);
  }

  function archiveIconSvg(size) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive icon">
        <rect width="20" height="5" x="2" y="3" rx="1"></rect>
        <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
        <path d="M10 12h4"></path>
      </svg>`;
  }

  function updateMenuItem(button) {
    const context = tryGetPostContext();
    if (!button || !context) return;

    const label = context.isArchived ? "Unarchive" : "Archive";
    const labelNode = button.querySelector("div:last-child");

    if (labelNode) {
      labelNode.textContent = label;
    } else {
      button.textContent = label;
    }

    button.setAttribute("aria-label", label);
  }

  function refreshInjectedItems() {
    document.querySelectorAll(`[${MENU_ITEM_ATTR}]`).forEach(updateMenuItem);
  }

  function buildMenuItem(templateButton) {
    const button = templateButton.cloneNode(true);
    button.setAttribute(MENU_ITEM_ATTR, "true");
    button.removeAttribute("href");
    button.removeAttribute("data-href");
    button.removeAttribute("aria-checked");
    button.removeAttribute("aria-pressed");
    button.disabled = false;

    const iconWrap = button.querySelector("div");
    if (iconWrap) {
      iconWrap.innerHTML = archiveIconSvg(16);
    }

    updateMenuItem(button);

    button.addEventListener("click", async (event) => {
      event.preventDefault();

      const context = tryGetPostContext();
      if (!context) return;

      const nextState = !context.isArchived;
      const labelNode = button.querySelector("div:last-child");
      const previousLabel = labelNode?.textContent ?? button.textContent;
      const busyLabel = nextState ? "Archiving..." : "Unarchiving...";

      if (labelNode) {
        labelNode.textContent = busyLabel;
      } else {
        button.textContent = busyLabel;
      }

      button.setAttribute("aria-label", busyLabel);
      button.disabled = true;

      try {
        await setArchiveState(nextState);
        refreshInjectedItems();
        showToast(
          nextState ? "Post archived" : "Post unarchived",
          nextState ? "archive" : "undo",
          nextState ? "View" : undefined,
          nextState
            ? () => {
                window.location.href = "https://substack.com/home/archive";
              }
            : undefined
        );
        queueMicrotask(() => {
          document.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: "Escape",
              bubbles: true,
            })
          );
        });
      } catch (error) {
        console.error(error);

        if (labelNode) {
          labelNode.textContent = previousLabel;
        } else {
          button.textContent = previousLabel;
        }

        button.setAttribute("aria-label", previousLabel);
        showToast("Archive request failed");
      } finally {
        button.disabled = false;
      }
    });

    return button;
  }

  function patchMenu(menu) {
    if (!menu || menu.querySelector(`[${MENU_ITEM_ATTR}]`)) {
      return;
    }

    const items = [...menu.querySelectorAll('[role="menuitem"]')];
    const saveItem = items.find((item) => {
      const text = item.textContent?.trim();
      return text === "Save" || text === "Unsave";
    });

    if (!saveItem || !saveItem.parentElement) {
      return;
    }

    const archiveItem = buildMenuItem(saveItem);
    saveItem.parentElement.insertBefore(archiveItem, saveItem.nextSibling);
  }

  function removeInjectedControls() {
    document.querySelectorAll(`[${MENU_ITEM_ATTR}]`).forEach((element) => {
      element.remove();
    });
  }

  let refreshQueued = false;

  function refreshUi() {
    document.querySelectorAll('[role="menu"]').forEach(patchMenu);
    refreshInjectedItems();
  }

  function scheduleRefresh() {
    if (refreshQueued) return;

    refreshQueued = true;
    requestAnimationFrame(() => {
      refreshQueued = false;
      refreshUi();
    });
  }

  const observer = new MutationObserver(() => scheduleRefresh());
  observer.observe(document.body, { childList: true, subtree: true });

  refreshUi();

  window[PATCH_KEY] = {
    installed: true,
    cleanup() {
      observer.disconnect();
      removeInjectedControls();
      document.querySelectorAll(`[${TOAST_ATTR}]`).forEach((element) => {
        element.remove();
      });
      delete window[PATCH_KEY];
    },
    getState() {
      return tryGetPostContext();
    },
    refreshUi,
  };
})();
