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
## How is it that much faster?

DuckDuckGo does their redirects server side. Their DNS is...not always great. Result is that it often takes ages.

I solved this by doing all of the work client side. Once you've went to https://search.timmatheis.com once, the JS is all cache'd and will never need to be downloaded again. Your device does the redirects, not me.

---

This was forked from https://github.com/t3dotgg/unduck by Theo
