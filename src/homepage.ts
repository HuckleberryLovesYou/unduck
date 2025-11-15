import { bangs } from "./bang";

export function homepage() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `
    <div class="homepage">
      <div class="homepage-content">
        <h1 class="homepage-title">Unduck</h1>
        <p class="homepage-description">
          DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. 
          Enables all <a href="https://duckduckgo.com/bang.html" target="_blank">DuckDuckGo's&nbsp;bangs</a>.
        </p>
        <div class="url-container-wrapper">
          <div class="url-container"> 
            <input 
              type="text" 
              class="url-input"
              value="https://search.timmatheis.com?q=%s"
              readonly
              autofocus
            />
            <div class="copy-section">
              <button class="copy-button" title="Copy">
                <img src="/clipboard-icon.svg" alt="Copy" />
              </button>
              <div class="copy-message" hidden>
                <span>Copied!</span>
              </div>
            </div>
          </div>
        </div>
        <div class="homepage-links">
          <p class="searchbar-link">You can also use the !Bangs directly from the <a href="/searchbar" id="searchbar-link">searchbar</a>.</p>
          <a href="https://github.com/HuckleberryLovesYou/unduck#changed-bangs" target="_blank" class="bangs-link">List of changed bangs</a>
        </div>
      </div>
      <button id="homepage-settings-button" class="homepage-settings-button" title="Settings" aria-label="Settings">
        <img src="/settings-icon.svg" alt="" class="icon" />
      </button>
      <div id="homepage-settings-popup" class="settings-popup" style="display: none;">
        <div class="settings-popup-header">
          <h2>Settings</h2>
          <button id="homepage-settings-close" class="settings-close" aria-label="Close settings">×</button>
        </div>
        <div class="settings-popup-content">
          <div class="settings-item">
            <label class="settings-toggle">
              <input type="checkbox" id="homepage-open-in-new-tab" />
              <span class="settings-toggle-slider"></span>
              <span class="settings-toggle-label">Open searches in a new tab</span>
            </label>
          </div>
          <div class="settings-item">
            <div class="settings-input-row">
              <label class="settings-label-inline" for="default-bang-input">Default Bang</label>
              <input 
                type="text" 
                id="default-bang-input" 
                class="settings-input-inline" 
                placeholder="e.g., g, h, ai or duckai"
                maxlength="50"
              />
            </div>
            <div class="settings-input-hint">Enter a bang tag (without !) to use when no bang is specified</div>
            <div id="default-bang-error" class="settings-error" style="display: none;"></div>
          </div>
        </div>
      </div>
      <div id="homepage-settings-overlay" class="settings-overlay" style="display: none;"></div>
      <div id="homepage-toast" class="toast" style="display: none;">Settings saved</div>
      <footer class="footer">
        <a href="https://timmatheis.com" target="_blank">portfolio</a>
        <span class="footer-separator">•</span>
        <a href="https://linktr.ee/HuckleberryLovesYou" target="_blank">linktr.ee</a>
        <span class="footer-separator">•</span>
        <a href="https://github.com/HuckleberryLovesYou/unduck" target="_blank">Forked Source</a>
        <span class="footer-separator">•</span>
        <a href="https://github.com/t3dotgg/unduck" target="_blank">Origin Source</a>
      </footer>
    </div>
  `;

  const copyButton = app.querySelector<HTMLButtonElement>(".copy-button")!;
  const copyMessage = app.querySelector<HTMLDivElement>(".copy-message")!;
  const copyIcon = copyButton.querySelector("img")!;
  const urlInput = app.querySelector<HTMLInputElement>(".url-input")!;
  const settingsBtn = app.querySelector<HTMLButtonElement>("#homepage-settings-button")!;
  const settingsPopup = app.querySelector<HTMLDivElement>("#homepage-settings-popup")!;
  const settingsOverlay = app.querySelector<HTMLDivElement>("#homepage-settings-overlay")!;
  const settingsClose = app.querySelector<HTMLButtonElement>("#homepage-settings-close")!;
  const openInNewTabToggle = app.querySelector<HTMLInputElement>("#homepage-open-in-new-tab")!;
  const defaultBangInput = app.querySelector<HTMLInputElement>("#default-bang-input")!;
  const defaultBangError = app.querySelector<HTMLDivElement>("#default-bang-error")!;
  const toast = app.querySelector<HTMLDivElement>("#homepage-toast")!;

  // Show toast notification
  const showToast = () => {
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    }, 10);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => {
        toast.style.display = "none";
      }, 300);
    }, 2000);
  };

  // Load settings from localStorage
  const loadSettings = () => {
    const openInNewTab = localStorage.getItem("openInNewTab") === "true";
    openInNewTabToggle.checked = openInNewTab;
    
    const defaultBang = localStorage.getItem("default-bang") || "g";
    defaultBangInput.value = defaultBang;
    validateBang(defaultBang);
  };

  // Validate bang exists
  const validateBang = (bangTag: string): boolean => {
    const trimmed = bangTag.trim().toLowerCase();
    if (!trimmed) {
      defaultBangError.textContent = "";
      defaultBangError.style.display = "none";
      return false;
    }

    const bangExists = bangs.some((b) => b.t === trimmed);
    if (!bangExists) {
      defaultBangError.textContent = `Bang "!${trimmed}" not found`;
      defaultBangError.style.display = "block";
      return false;
    }

    defaultBangError.textContent = "";
    defaultBangError.style.display = "none";
    return true;
  };

  // Show bang name in settings
  const updateBangNameInSettings = () => {
    const bangTag = defaultBangInput.value.trim().toLowerCase();
    const bang = bangs.find((b) => b.t === bangTag);
    if (bang && !defaultBangError.textContent) {
      const existingName = defaultBangInput.parentElement?.querySelector(".bang-name-in-settings");
      if (existingName) {
        existingName.textContent = bang.s;
      } else {
        const nameSpan = document.createElement("span");
        nameSpan.className = "bang-name-in-settings";
        nameSpan.textContent = bang.s;
        defaultBangInput.parentElement?.appendChild(nameSpan);
      }
    } else {
      const existingName = defaultBangInput.parentElement?.querySelector(".bang-name-in-settings");
      if (existingName) {
        existingName.remove();
      }
    }
  };

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem("openInNewTab", openInNewTabToggle.checked.toString());
    
    const bangTag = defaultBangInput.value.trim().toLowerCase();
    if (bangTag && validateBang(bangTag)) {
      localStorage.setItem("default-bang", bangTag);
    } else if (!bangTag) {
      // Allow empty to reset to default
      localStorage.setItem("default-bang", "g");
    }
    showToast();
  };

  // Show/hide settings popup
  const showSettings = () => {
    settingsPopup.style.display = "block";
    settingsOverlay.style.display = "block";
  };

  const hideSettings = () => {
    settingsPopup.style.display = "none";
    settingsOverlay.style.display = "none";
  };

  // Load settings on init
  loadSettings();
  updateBangNameInSettings();
  
  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Close modals with Escape
    if (e.key === "Escape" && settingsPopup.style.display === "block") {
      hideSettings();
    }
  });

  // Settings button click
  settingsBtn.addEventListener("click", showSettings);

  // Close settings
  settingsClose.addEventListener("click", hideSettings);
  settingsOverlay.addEventListener("click", hideSettings);

  // Save settings when toggle changes
  openInNewTabToggle.addEventListener("change", saveSettings);
  
  // Validate bang on input and show name
  defaultBangInput.addEventListener("input", () => {
    validateBang(defaultBangInput.value);
    updateBangNameInSettings();
  });

  // Save settings on blur
  defaultBangInput.addEventListener("blur", saveSettings);

  // Save settings on Enter key
  defaultBangInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      saveSettings();
      defaultBangInput.blur();
    }
  });

  // Close settings on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && settingsPopup.style.display === "block") {
      hideSettings();
    }
  });

  // Copy button functionality
  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyIcon.src = "/clipboard-check-icon.svg";
    copyMessage.hidden = false;
    setTimeout(() => {
      copyIcon.src = "/clipboard-icon.svg";
      copyMessage.hidden = true;
    }, 1500);
  });

  // Client-side navigation to searchbar to prevent white flash in Firefox
  const searchbarLink = app.querySelector<HTMLAnchorElement>("#searchbar-link")!;
  searchbarLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.history.pushState({}, "", "/searchbar");
    // Trigger a custom event that main.ts will listen to
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
}