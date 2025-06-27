export function homepage() {
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
            autofocus
          />
          <button class="copy-button" title="Copy">
            <img src="/clipboard.svg" alt="Copy" />
          </button>
          <div class="copy-message" hidden>
            <a>Copied!</a>
          </div>
        </div>
        <div class="searchbar">You can also use the !Bangs directly from the <a href="/searchbar">searchbar<a>.</div>
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
  const copyMessage = app.querySelector<HTMLDivElement>(".copy-message")!;
  const copyIcon = copyButton.querySelector("img")!;
  const urlInput = app.querySelector<HTMLInputElement>(".url-input")!;

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyIcon.src = "/clipboard-check.svg";
    copyMessage.hidden = false;
    setTimeout(() => {
      copyIcon.src = "/clipboard.svg";
      copyMessage.hidden = true;
    }, 1500);
  });
}