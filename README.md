# Unduck

A blazing fast, privacy-focused search redirect tool.
DuckDuckGo's bang redirects are too slow. Unduck moves the logic client-side, making redirects instant.
Forked from [t3dotgg/unduck](https://github.com/t3dotgg/unduck).

## 🚀 Why Use Unduck?

-   **Speed**: Redirects happen entirely in your browser. No server round-trips for the redirect logic.
-   **Privacy**: No tracking. Your queries stay on your device until they hit the target search engine.
-   **Customization**: Add your own bangs, change themes, and configure default behaviors.
-   **Modern Stack**: Built with [Preact](https://preactjs.com/) and [Vite](https://vitejs.dev/) for a lightweight, optimized experience.

## ✨ Features

-   **⚡ Client-Side Redirects**: Instant routing to thousands of supported sites.
-   **🎨 Theming System**:
    -   **Dark Mode** (Default)
    -   **Light Mode**
    -   **System Sync** (Follows your OS preference)
-   **🛠️ Power User Settings**:
    -   **Custom Bangs**: Add your own shortcuts (e.g., `!mybang` -> `https://example.com/search?q=%s`).
    -   **Default Bang**: Change the fallback search engine (default is `!g` / Google).
    -   **Open in New Tab**: Configure search behavior.
-   **📝 Changelog**: Built-in update tracker to see what's new.

## 🛠️ Usage

### Add to Browser

Add the following URL as a custom search engine in your browser settings (Chrome, Firefox, Edge, etc.):

```
https://search.timmatheis.com?q=%s
```

Now you can use it just like DuckDuckGo!

-   Type `!yt cat videos` -> Redirects to YouTube.
-   Type `!w rust lang` -> Redirects to Wikipedia.
-   Type `cats` -> Searches Google (or your configured default).

### Changed Bangs

This fork includes several custom bang overrides for better utility:

| Original | Changed    | Description                                                                     |
| -------- | ---------- | ------------------------------------------------------------------------------- |
| None     | `!t3`      | [T3.chat](https://t3.chat) by [Theo](https://x.com/theo) - AI Chat aggregation. |
| `!html`  | `!h`       | A [simple DDG Search Engine](https://html.duckduckgo.com/html/).                |
| `!g`     | `!g`       | Google Search ('Web' mode `&udm=14` by default).                                |
| `!ai`    | `!duckai`  | Renamed original !ai to !duckai.                                                |
| None     | `!ai`      | Added [ChatGPT](https://chatgpt.com).                                           |
| None     | `!grok`    | Addedd [Grok](https://grok.com).                                                |
| -        | -          | Fixed Google Maps (`.../search/...` path).                                      |
| `nix`    | `nix`      | Fixed NixOS Wiki domain.                                                        |
| None     | `grepcode` | Added [Grep.app](https://grep.app/).                                            |
| None     | `modr`     | Added [Modrinth](https://modrinth.com/).                                        |
| None     | `gem`      | Added [Gemini](https://gemini.google.com). (Extension required)                 |
| `docs`   | None     | Removed [Scribd.com](www.scribd.com).                                             |
| None     | `docs`     | Added [Docs](https://docs.timmatheis.com). (Extension required)                 |

## 🤝 Credits

-   Originally created by [Theo (t3dotgg)](https://github.com/t3dotgg).
-   Forked and maintained by [Tim Matheis](https://timmatheis.com).
-   [Watch how it works](https://www.youtube.com/watch?v=_DnNzRaBWUU).
