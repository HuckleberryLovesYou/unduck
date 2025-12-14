# Unduck

DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables all of DuckDuckGo's bangs to work, but much faster.

```
https://search.timmatheis.com?q=%s
```

## Changed Bangs
The Bangs changed or added in comparison to the original list at https://duckduckgo.com/bang.js:

| Original | Changed | Description |
| --- | --- | --- |
| None | !t3 | [T3.chat](https://t3.chat) by [Theo](https://x.com/theo) is a AI Chat with Models of multiple companies. |
| !html | !h | A [simple DDG Search Engine](https://html.duckduckgo.com/html/) using mostly HTML for higher performance. |
| !g | !g | Changed the default Google Search View 'All' to 'Web' using &udm=14 |
| !ai | !duckai | Changed the default !Bang to make room for ChatGPT |
| None | !ai | Added [ChatGPT](https://chatgpt.com) and made it the default ai in the bangs as it is the largest LLM frontier lab |
| - | - | Fix for the Bang for Google Maps through #1. It used the .../place/... path, but this has now changed to .../search/... |
| nix | nix | Fix for the Bang for NixOS Wiki domain change |
| nixos | nixos | Fix for the Bang for NixOS Wiki domain change |
| nixoswiki | nixoswiki | Fix for the Bang for NixOS Wiki domain change |

## How is it that much faster?

DuckDuckGo does their redirects server side. Their DNS is...not always great. Result is that it often takes ages.

I solved this by doing all of the work client side. Once you've went to https://search.timmatheis.com once, the JS is all cache'd and will never need to be downloaded again. Your device does the redirects, not me.

## How it works

[![Unduck - Making DuckDuckGo Bangs Faster](https://img.youtube.com/vi/_DnNzRaBWUU/0.jpg)](https://www.youtube.com/watch?v=_DnNzRaBWUU)

Click here to watch how it works.

---

This was forked from https://github.com/t3dotgg/unduck by Theo
