export interface ChangedBang {
    original: string | null;
    changed: string | null;
    description: string;
    url?: string;
    isExtensionRequired?: boolean;
}

export const changedBangs: ChangedBang[] = [
    {
        original: null,
        changed: "!t3",
        description: "Added T3.chat by Theo.",
        url: "https://t3.chat"
    },
    {
        original: "!html",
        changed: "!h",
        description: "Renamed from !html to !h.",
        url: "https://html.duckduckgo.com/html/"
    },
    {
        original: "!g",
        changed: "!g",
        description: "Made Google Search use Web mode by default.",
        url: "https://google.com/search"
    },
    {
        original: "!ai",
        changed: "!duckai",
        description: "Renamed from !ai to !duckai.",
        url: "https://duck.ai/chat"
    },
    {
        original: null,
        changed: "!ai",
        description: "Added ChatGPT.",
        url: "https://chatgpt.com"
    },
    {
        original: null,
        changed: "!grok",
        description: "Added Grok.",
        url: "https://grok.com"
    },
    {
        original: "!gm, !gmaps, !maps",
        changed: "!gm, !gmaps, !maps",
        description: "Fixed Google Maps (.../search/... path).",
        url: "https://google.com/maps"
    },
    {
        original: "!nix",
        changed: "!nix",
        description: "Fixed NixOS Wiki domain.",
        url: "https://wiki.nixos.org/wiki/NixOS_Wiki"
    },
    {
        original: null,
        changed: "!grepcode",
        description: "Added Grep.app.",
        url: "https://grep.app/"
    },
    {
        original: null,
        changed: "!modr",
        description: "Added Modrinth.",
        url: "https://modrinth.com/"
    },
    {
        original: null,
        changed: "!gem",
        description: "Added Gemini.",
        url: "https://gemini.google.com",
        isExtensionRequired: true
    },
    {
        original: "!docs",
        changed: null,
        description: "Removed Scribd.com.",
        url: "https://www.scribd.com/"
    },
    {
        original: null,
        changed: "!docs",
        description: "Added Docs.",
        url: "https://docs.timmatheis.com",
        isExtensionRequired: true
    }
];
