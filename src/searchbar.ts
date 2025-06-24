export default function searchBar() {
  const container = document.querySelector<HTMLDivElement>("#searchbar-container")!;
  container.innerHTML = `
    <div class="search-page">
      <button id="back-button" class="back-button" aria-label="Go back">
        ←
      </button>
      <h1>Unduck</h1>
      <div class="search-box">
        <button id="searchbar-button" class="icon-button search-icon" aria-label="Search">
          <img src="/search.svg" alt="" class="icon" />
        </button>
        <input
          type="text"
          id="searchbar-input"
          placeholder="Search…"
          autocomplete="off"
          autofocus
        />
        <button id="clear-button" class="icon-button clear-icon" aria-label="Clear" style="display: none;">
          <img src="/clear.svg" alt="" class="icon" />
        </button>
      </div>
    </div>
  `;
  const backBtn    = container.querySelector<HTMLButtonElement>("#back-button")!;
  const input       = container.querySelector<HTMLInputElement>("#searchbar-input")!;
  const searchBtn   = container.querySelector<HTMLButtonElement>("#searchbar-button")!;
  const clearBtn    = container.querySelector<HTMLButtonElement>("#clear-button")!;

  const doSearch = () => {
    const term = input.value.trim();
    if (!term) return;
    window.location.href = `/?q=${encodeURIComponent(term)}`;
  };

  backBtn.addEventListener("click", () => {
    window.location.href = "/";
  });

    // show/hide clear button on input
  input.addEventListener("input", () => {
    if (input.value.length > 0) {
      clearBtn.style.display = "";
    } else {
      clearBtn.style.display = "none";
    }
  });

  // search on click or Enter
  searchBtn.addEventListener("click", doSearch);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") doSearch();
  });

  // clear input
  clearBtn.addEventListener("click", () => {
    input.value = "";
    input.focus();
  });
}
