import { bangs } from "./bang";

export function searchBar() {
  function searchBar() {
    const container = document.querySelector<HTMLDivElement>(
      "#searchbar-container"
    )!;
    container.innerHTML = `
      <div class="search-page">
        <button id="back-button" class="back-button" title="Back" aria-label="Go back">
          ←
        </button>
        <div class="search-page-content">
          <h1 class="search-page-title">Unduck</h1>
          <div class="search-box-wrapper">
            <div id="bang-name-display" class="bang-name-display" style="display: none;"></div>
            <div class="search-box-container">
              <button id="searchbar-button" class="icon-button search-icon" title="Search" aria-label="Search">
                <img src="/search-icon.svg" alt="" class="icon" />
              </button>
              <input
                type="text"
                id="searchbar-input"
                placeholder="Search…"
                autocomplete="off"
                autofocus
              />
              <div class="history-dropdown">
              </div>
              <button id="clear-button" class="icon-button clear-icon" title="Clear" aria-label="Clear" style="display: none;">
                <img src="/clear-icon.svg" alt="" class="icon" />
              </button>
            </div>
          </div>
        </div>
        <button id="settings-button" class="settings-button" title="Settings" aria-label="Settings">
          <img src="/settings-icon.svg" alt="" class="icon" />
        </button>
        <div id="settings-popup" class="settings-popup" style="display: none;">
          <div class="settings-popup-header">
            <h2>Settings</h2>
            <button id="settings-close" class="settings-close" aria-label="Close settings">×</button>
          </div>
          <div class="settings-popup-content">
            <div class="settings-item">
              <label class="settings-toggle">
                <input type="checkbox" id="open-in-new-tab" />
                <span class="settings-toggle-slider"></span>
                <span class="settings-toggle-label">Open searches in a new tab</span>
              </label>
            </div>
            <div class="settings-item">
              <div class="settings-input-row">
                <label class="settings-label-inline" for="searchbar-default-bang-input">Default Bang</label>
                <input 
                  type="text" 
                  id="searchbar-default-bang-input" 
                  class="settings-input-inline" 
                  placeholder="e.g., g, h, ai or duckai"
                  maxlength="50"
                />
              </div>
              <div class="settings-input-hint">Enter a bang tag (without !) to use when no bang is specified</div>
              <div id="searchbar-default-bang-error" class="settings-error" style="display: none;"></div>
            </div>
          </div>
        </div>
        <div id="settings-overlay" class="settings-overlay" style="display: none;"></div>
        <div id="toast" class="toast" style="display: none;">Settings saved</div>
      </div>
    `;
    const backBtn    = container.querySelector<HTMLButtonElement>("#back-button")!;
    const input       = container.querySelector<HTMLInputElement>("#searchbar-input")!;
    const searchBtn   = container.querySelector<HTMLButtonElement>("#searchbar-button")!;
    const clearBtn    = container.querySelector<HTMLButtonElement>("#clear-button")!;
    const historyDropDown = container.querySelector<HTMLDivElement>(".history-dropdown")!;
    const settingsBtn = container.querySelector<HTMLButtonElement>("#settings-button")!;
    const settingsPopup = container.querySelector<HTMLDivElement>("#settings-popup")!;
    const settingsOverlay = container.querySelector<HTMLDivElement>("#settings-overlay")!;
    const settingsClose = container.querySelector<HTMLButtonElement>("#settings-close")!;
    const openInNewTabToggle = container.querySelector<HTMLInputElement>("#open-in-new-tab")!;
    const defaultBangInput = container.querySelector<HTMLInputElement>("#searchbar-default-bang-input")!;
    const defaultBangError = container.querySelector<HTMLDivElement>("#searchbar-default-bang-error")!;
    const bangNameDisplay = container.querySelector<HTMLDivElement>("#bang-name-display")!;
    const toast = container.querySelector<HTMLDivElement>("#toast")!;
    
    // Initially hide the history dropdown
    historyDropDown.style.display = "none";
    
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
    
    // Show bang name when typing
    const updateBangDisplay = () => {
      const value = input.value;
      const match = value.match(/!(\S+)/i);
      if (match) {
        const bangTag = match[1].toLowerCase();
        const bang = bangs.find((b) => b[0] === bangTag);
        if (bang) {
          bangNameDisplay.textContent = bang[1];
          bangNameDisplay.style.display = "block";
        } else {
          bangNameDisplay.style.display = "none";
        }
      } else {
        bangNameDisplay.style.display = "none";
      }
    };
    
    // Validate bang exists
    const validateBang = (bangTag: string): boolean => {
      const trimmed = bangTag.trim().toLowerCase();
      if (!trimmed) {
        defaultBangError.textContent = "";
        defaultBangError.style.display = "none";
        return false;
      }

      const bangExists = bangs.some((b) => b[0] === trimmed);
      if (!bangExists) {
        defaultBangError.textContent = `Bang "!${trimmed}" not found`;
        defaultBangError.style.display = "block";
        return false;
      }

      defaultBangError.textContent = "";
      defaultBangError.style.display = "none";
      return true;
    };
    
    // Load settings from localStorage
    const loadSettings = () => {
      const openInNewTab = localStorage.getItem("openInNewTab") === "true";
      openInNewTabToggle.checked = openInNewTab;
      
      const defaultBang = localStorage.getItem("default-bang") || "g";
      defaultBangInput.value = defaultBang;
      validateBang(defaultBang);
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
    
    // Show bang name in settings
    const updateBangNameInSettings = () => {
      const bangTag = defaultBangInput.value.trim().toLowerCase();
      const bang = bangs.find((b) => b[0] === bangTag);
      if (bang && !defaultBangError.textContent) {
        const existingName = defaultBangInput.parentElement?.querySelector(".bang-name-in-settings");
        if (existingName) {
          existingName.textContent = bang[1];
        } else {
          const nameSpan = document.createElement("span");
          nameSpan.className = "bang-name-in-settings";
          nameSpan.textContent = bang[1];
          defaultBangInput.parentElement?.appendChild(nameSpan);
        }
      } else {
        const existingName = defaultBangInput.parentElement?.querySelector(".bang-name-in-settings");
        if (existingName) {
          existingName.remove();
        }
      }
    };
    
    // Save settings on blur
    defaultBangInput.addEventListener("blur", saveSettings);
    
    // Save settings on Enter key
    defaultBangInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveSettings();
        defaultBangInput.blur();
      }
    });
    
    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Focus searchbar with /
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        input.focus();
      }
      
      // Close modals/dropdowns with Escape
      if (e.key === "Escape") {
        if (settingsPopup.style.display === "block") {
          hideSettings();
        } else if (historyDropDown.style.display === "block") {
          hideHistory();
        }
      }
    });
    
    // Update bang display and history on input
    input.addEventListener("input", () => {
      updateClearButton();
      updateBangDisplay();
      const currentValue = input.value;
      if (currentValue.trim()) {
        renderHistory(currentValue);
      } else {
        renderHistory();
      }
    });

    // Function to update clear button visibility
    const updateClearButton = () => {
      if (input.value.length > 0) {
        clearBtn.style.display = "";
      } else {
        clearBtn.style.display = "none";
      }
    };

    const doSearch = () => {
      const term = input.value.trim();
      if (!term) return;
      saveSearchTerms();
      hideHistory();
      const url = `/?q=${encodeURIComponent(term)}`;
      if (openInNewTabToggle.checked) {
        window.open(url, "_blank");
      } else {
        window.location.href = url;
      }
    };

    // Simple fuzzy match function
    const fuzzyMatch = (text: string, pattern: string): boolean => {
      if (!pattern) return true;
      const textLower = text.toLowerCase();
      const patternLower = pattern.toLowerCase();
      let patternIndex = 0;
      for (let i = 0; i < textLower.length && patternIndex < patternLower.length; i++) {
        if (textLower[i] === patternLower[patternIndex]) {
          patternIndex++;
        }
      }
      return patternIndex === patternLower.length;
    };

    function renderHistory(filterText: string = "") {
      var searchTerms = getSearchTerms() || [];
      if (searchTerms.length === 0) {
        historyDropDown.style.display = "none";
        return;
      }
      
      let termsToShow: string[];
      
      if (filterText.trim()) {
        // Fuzzy search in last 20 searches
        const last20 = searchTerms.slice(0, 20);
        termsToShow = last20.filter(term => fuzzyMatch(term, filterText));
        // Limit to 5 results for fuzzy search
        termsToShow = termsToShow.slice(0, 5);
      } else {
        // Show only last 5 searches when no filter
        termsToShow = searchTerms.slice(0, 5);
      }
      
      if (termsToShow.length === 0) {
        historyDropDown.style.display = "none";
        return;
      }
      
      historyDropDown.innerHTML = "";
      historyDropDown.style.display = "block";
      
      termsToShow.forEach((term) => {
        const button = document.createElement("button");
        button.className = "history-button";
        button.textContent = term;
        button.addEventListener("click", () => {
          input.value = term;
          updateClearButton(); // Update clear button visibility
          input.focus();
          hideHistory();
          doSearch();
        });
        historyDropDown.appendChild(button);
      });
    }

    function showHistory() {
      renderHistory();
    }

    function hideHistory() {
      historyDropDown.style.display = "none";
    }

    function getSearchTerms(): string[] {
      try {
        const stored = localStorage.getItem("searchTerms");
        if (!stored) return [];
        return JSON.parse(stored) || [];
      } catch {
        return [];
      }
    }

    function saveSearchTerms() {
      const newSearchTerm = input.value.trim();
      if (!newSearchTerm) return;
      
      var searchTerms = getSearchTerms() || [];
      
      // Remove the term if it already exists
      const existingIndex = searchTerms.indexOf(newSearchTerm);
      if (existingIndex !== -1) {
        searchTerms.splice(existingIndex, 1);
      }
      
      // Add to the beginning (most recent first)
      searchTerms.unshift(newSearchTerm);
      
      // Limit to 20 items for fuzzy search
      if (searchTerms.length > 20) {
        searchTerms = searchTerms.slice(0, 20);
      }
      
      localStorage.setItem("searchTerms", JSON.stringify(searchTerms));
    }

    backBtn.addEventListener("click", () => {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    // Load settings on init - update bang name display
    loadSettings();
    updateBangNameInSettings();
    input.addEventListener("focus", () => {
      // Show 5 latest when focusing (not typing)
      if (!input.value.trim()) {
        showHistory();
      } else {
        // If there's text, show fuzzy matches
        renderHistory(input.value);
      }
    });

    // Hide history when clicking outside
    document.addEventListener("click", (e) => {
      if (!container.contains(e.target as Node)) {
        hideHistory();
      }
    });

    // Hide history on blur (with a small delay to allow history button clicks)
    input.addEventListener("blur", (e) => {
      // Don't hide if the focus is moving to a history button
      const relatedTarget = e.relatedTarget as HTMLElement;
      if (relatedTarget && historyDropDown.contains(relatedTarget)) {
        return;
      }
      setTimeout(() => {
        // Double-check that focus hasn't returned to input or history
        if (document.activeElement !== input && !historyDropDown.contains(document.activeElement)) {
          hideHistory();
        }
      }, 200);
    });

    // search on click or Enter
    searchBtn.addEventListener("click", doSearch);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") doSearch();
    });

    // clear input
    clearBtn.addEventListener("click", () => {
      input.value = "";
      input.focus();
    });
  }
  function renderSearchPage() {
    const app = document.querySelector<HTMLDivElement>("#app")!;
    app.innerHTML = `<div id="searchbar-container"></div>`;
    searchBar();
  }
  renderSearchPage();
}
