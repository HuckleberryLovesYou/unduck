import { bangs } from "./bang";
import "./global.css";
import searchBar from "./searchbar"

function DefaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div class="content-container">
        <h1>Unduck</h1>
        <p>DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables all <a href="https://duckduckgo.com/bang.html" target="_blank"> DuckDuckGo's bangs</a>.</p>
        <div class="url-container"> 
          <input 
            type="text" 
            class="url-input"
            value="https://search.timmatheis.com?q=%s"
            readonly 
          />
          <button class="copy-button">
            <img src="/clipboard.svg" alt="Copy" />
          </button>
        </div>
        <div class="searchbar">You can also use the searchbar directly <a href="https://search.timmatheis.com/searchbar">here<a>.</div>
         <a href="https://github.com/HuckleberryLovesYou/unduck#changed-bangs" target="_blank">List of changed bangs</a>
      </div>
      <footer class="footer">
        <a href="https://timmatheis.com" target="_blank">portfolio</a>
        •
        <a href="https://linktr.ee/HuckleberryLovesYou" target="_blank">linktr.ee</a>
        •
        <a href="https://github.com/HuckleberryLovesYou/unduck" target="_blank">Forked Source</a>
        •
        <a href="https://github.com/t3dotgg/unduck" target="_blank">Origin Source</a>
      </footer>
    </div>
  `;

  const copyButton = app.querySelector<HTMLButtonElement>(".copy-button")!;
  const copyIcon = copyButton.querySelector("img")!;
  const urlInput = app.querySelector<HTMLInputElement>(".url-input")!;

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyIcon.src = "/clipboard-check.svg";

    setTimeout(() => {
      copyIcon.src = "/clipboard.svg";
    }, 2000);
  });
}

function renderSearchPage() {
  console.log("🔍 rendering searchbar page—container exists?", !!document.querySelector("#app"));
  const app = document.querySelector<HTMLDivElement>("#app")!;
  // Just clear everything and mount the search bar
  app.innerHTML = `<div id="searchbar-container"></div>`;
  searchBar();  
}


const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
const defaultBang = bangs.find((b) => b.t === LS_DEFAULT_BANG);

function getBangredirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    DefaultPageRender();
    return null;
  }

  const match = query.match(/!(\S+)/i);

  const bangCandidate = match?.[1]?.toLowerCase();
  const selectedBang = bangs.find((b) => b.t === bangCandidate) ?? defaultBang;

  // Remove the first bang from the query
  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

  // If the query is just `!gh`, use `github.com` instead of `github.com/search?q=`
  if (cleanQuery === "")
    return selectedBang ? `https://${selectedBang.d}` : null;

  // Format of the url is:
  // https://www.google.com/search?q={{{s}}}
  const searchUrl = selectedBang?.u.replace(
    "{{{s}}}",
    // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/"),
  );
  if (!searchUrl) return null;

  return searchUrl;
}

function doRedirect() {
  const searchUrl = getBangredirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}

// main.ts, at the bottom
const path = window.location.pathname;
if (path.startsWith("/searchbar")) {
  renderSearchPage();
} else if (window.location.search.includes("q=")) {
  doRedirect();
} else {
  DefaultPageRender();
}
