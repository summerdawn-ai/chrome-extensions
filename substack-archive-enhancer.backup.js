(() => {
  const PATCH_KEY = "__substackArchiveEnhancer";
  const DESKTOP_ITEM_ATTR = "data-substack-archive-menu-item";
  const MOBILE_BUTTON_ATTR = "data-substack-archive-mobile-button";
  const TOAST_ATTR = "data-substack-archive-toast";
  const SIGNED_OUT_HIDDEN_ATTR = "data-substack-archive-hidden-while-signed-out";

  if (window[PATCH_KEY]?.installed) {
    console.log("Substack archive enhancer already installed");
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
      post,
      inboxItem,
      postId,
      publicationId,
      isArchived: !!inboxItem?.archived_at,
    };
  }

  function isViewerLoggedIn() {
    if (window._preloads?.confirmedLogin === false) {
      return false;
    }

    if (window._preloads?.confirmedLogin === true) {
      return true;
    }

    return !!window._preloads?.post?.inboxItem;
  }

  function setSignedOutVisibility(element, shouldShow) {
    if (!element) return;

    if (shouldShow) {
      if (element.hasAttribute(SIGNED_OUT_HIDDEN_ATTR)) {
        element.style.removeProperty("display");
        element.removeAttribute(SIGNED_OUT_HIDDEN_ATTR);
      }
      return;
    }

    if (element.hasAttribute(SIGNED_OUT_HIDDEN_ATTR)) return;

    element.setAttribute(SIGNED_OUT_HIDDEN_ATTR, "true");
    element.style.setProperty("display", "none", "important");
  }

  function updateSaveVisibility() {
    const shouldShow = isViewerLoggedIn();

    document
      .querySelectorAll('[role="menuitem"], button.post-ufi-button.style-tabs')
      .forEach((element) => {
        const label = [element.getAttribute("aria-label"), element.textContent]
          .filter(Boolean)
          .join(" ")
          .trim();

        if (/\b(save|unsave)\b/i.test(label)) {
          setSignedOutVisibility(element, shouldShow);
        }
      });
  }

  function removeInjectedControls() {
    document.querySelectorAll(`[${DESKTOP_ITEM_ATTR}]`).forEach((el) => el.remove());
    document.querySelectorAll(`[${MOBILE_BUTTON_ATTR}]`).forEach((el) => el.remove());
  }

  function setLocalArchiveState(isArchived) {
    const inboxItem = window._preloads?.post?.inboxItem;
    if (!inboxItem) return;

    const now = new Date().toISOString();
    inboxItem.archived_at = isArchived ? now : null;
    inboxItem.updated_at = now;
  }

  async function setArchiveState(isArchived) {
    if (!isViewerLoggedIn()) {
      throw new Error("Archive controls require a logged-in Substack session");
    }

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
    return { postId, publicationId, isArchived };
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

  function showToast({ message, icon = "archive", actionText, onAction }) {
    document.querySelectorAll(`[${TOAST_ATTR}]`).forEach((el) => el.remove());

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

    const actionButton = toast.querySelector(
      ".priority_secondary-outline-MgyjoK"
    );
    const closeButton = toast.querySelector('[aria-label="Close"]');

    actionButton?.addEventListener("click", async () => {
      actionButton.disabled = true;
      try {
        await onAction?.();
      } catch (error) {
        console.error(error);
      } finally {
        dismissToast(toast);
      }
    });

    closeButton?.addEventListener("click", () => dismissToast(toast));

    viewport.appendChild(toast);
    setTimeout(() => dismissToast(toast), 4500);
    return toast;
  }

  function updateDesktopItem(button) {
    if (!button) return;
    const label = button.querySelector("div:last-child");
    if (label) {
      label.textContent = getPostContext().isArchived ? "Unarchive" : "Archive";
    }
  }

  function archiveIconSvg(size) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive icon">
        <rect width="20" height="5" x="2" y="3" rx="1"></rect>
        <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
        <path d="M10 12h4"></path>
      </svg>`;
  }

  async function toggleArchive(nextState, refreshUi) {
    await setArchiveState(nextState);
    refreshUi?.();

    showToast({
      message: nextState ? "Post archived" : "Post unarchived",
      icon: nextState ? "archive" : "undo",
      actionText: "Undo",
      onAction: async () => {
        await setArchiveState(!nextState);
        refreshUi?.();
        showToast({
          message: !nextState ? "Post archived" : "Post unarchived",
          icon: !nextState ? "archive" : "undo",
        });
      },
    });
  }

  function buildDesktopItem(templateButton) {
    const button = templateButton.cloneNode(true);
    button.setAttribute(DESKTOP_ITEM_ATTR, "true");
    button.disabled = false;

    const iconWrap = button.querySelector("div");
    if (iconWrap) {
      iconWrap.innerHTML = archiveIconSvg(16);
    }

    updateDesktopItem(button);

    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const nextState = !getPostContext().isArchived;
      const label = button.querySelector("div:last-child");
      const busyText = nextState ? "Archiving..." : "Unarchiving...";
      const previousText = label?.textContent;

      if (label) label.textContent = busyText;
      button.disabled = true;

      try {
        await toggleArchive(nextState, () => {
          document
            .querySelectorAll(`[${DESKTOP_ITEM_ATTR}]`)
            .forEach(updateDesktopItem);
          document
            .querySelectorAll(`[${MOBILE_BUTTON_ATTR}]`)
            .forEach(updateMobileButton);
        });
      } catch (error) {
        console.error(error);
        if (label && previousText) label.textContent = previousText;
        showToast({ message: "Archive request failed" });
      } finally {
        button.disabled = false;
      }
    });

    return button;
  }

  function patchDesktopMenu(menu) {
    if (!menu) return;

    if (!isViewerLoggedIn()) {
      updateSaveVisibility();
      menu.querySelectorAll(`[${DESKTOP_ITEM_ATTR}]`).forEach((el) => el.remove());
      return;
    }

    if (menu.querySelector(`[${DESKTOP_ITEM_ATTR}]`)) return;

    const items = [...menu.querySelectorAll('[role="menuitem"]')];
    const saveItem = items.find((item) => {
      const text = item.textContent?.trim();
      return text === "Save" || text === "Unsave";
    });

    if (!saveItem || !saveItem.parentElement) return;

    const archiveItem = buildDesktopItem(saveItem);
    saveItem.parentElement.insertBefore(archiveItem, saveItem.nextSibling);
  }

  function updateMobileButton(button) {
    if (!button) return;

    const { isArchived } = getPostContext();
    button.setAttribute("aria-label", isArchived ? "Unarchive" : "Archive");
    button.setAttribute("aria-pressed", isArchived ? "true" : "false");
    button.classList.toggle("state-saved", isArchived);
  }

  function buildMobileButton(templateButton) {
    const button = templateButton.cloneNode(true);
    button.setAttribute(MOBILE_BUTTON_ATTR, "true");
    button.removeAttribute("data-href");

    const label = button.querySelector(".label");
    if (label) label.remove();

    button.classList.remove("has-label");
    button.classList.add("no-label");

    const icon = button.querySelector(".icon");
    if (icon) {
      icon.outerHTML = archiveIconSvg(24);
    }

    updateMobileButton(button);

    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const nextState = !getPostContext().isArchived;
      button.disabled = true;

      try {
        await toggleArchive(nextState, () => {
          document
            .querySelectorAll(`[${MOBILE_BUTTON_ATTR}]`)
            .forEach(updateMobileButton);
          document
            .querySelectorAll(`[${DESKTOP_ITEM_ATTR}]`)
            .forEach(updateDesktopItem);
        });
      } catch (error) {
        console.error(error);
        showToast({ message: "Archive request failed" });
      } finally {
        button.disabled = false;
      }
    });

    return button;
  }

  function patchMobileBar() {
    if (!isViewerLoggedIn()) {
      updateSaveVisibility();
      document.querySelectorAll(`[${MOBILE_BUTTON_ATTR}]`).forEach((el) => el.remove());
      return;
    }

    if (document.querySelector(`[${MOBILE_BUTTON_ATTR}]`)) return;

    const saveButton = [...document.querySelectorAll("button.post-ufi-button.style-tabs")]
      .find((button) => button.getAttribute("aria-label") === "Save");

    if (!saveButton || !saveButton.parentElement) return;

    const mobileButton = buildMobileButton(saveButton);
    saveButton.parentElement.insertBefore(mobileButton, saveButton);
  }

  function refreshUi() {
    updateSaveVisibility();

    if (!isViewerLoggedIn()) {
      removeInjectedControls();
      return;
    }

    document.querySelectorAll('[role="menu"]').forEach(patchDesktopMenu);
    document.querySelectorAll(`[${DESKTOP_ITEM_ATTR}]`).forEach(updateDesktopItem);
    patchMobileBar();
    document.querySelectorAll(`[${MOBILE_BUTTON_ATTR}]`).forEach(updateMobileButton);
  }

  const observer = new MutationObserver(() => refreshUi());
  observer.observe(document.body, { childList: true, subtree: true });

  refreshUi();

  window[PATCH_KEY] = {
    installed: true,
    cleanup() {
      observer.disconnect();
      removeInjectedControls();
      document
        .querySelectorAll(`[${SIGNED_OUT_HIDDEN_ATTR}]`)
        .forEach((el) => setSignedOutVisibility(el, true));
      document.querySelectorAll(`[${TOAST_ATTR}]`).forEach((el) => el.remove());
      delete window[PATCH_KEY];
    },
    getState() {
      return {
        ...getPostContext(),
        isLoggedIn: isViewerLoggedIn(),
      };
    },
    refreshUi,
  };

  console.log("Substack archive enhancer installed", {
    archivedAt: window._preloads?.post?.inboxItem?.archived_at ?? null,
  });
})();
