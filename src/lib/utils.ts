import { bangs } from "../bang";
import { CustomBang } from "../components/Settings";

export function getBangRedirectUrl(query: string, defaultBangTag: string, customBangs: CustomBang[] = []): string | null {
    const match = query.match(/!(\S+)/i);
    const bangCandidate = match?.[1]?.toLowerCase();

    // 1. Check Custom Bangs first
    const customBang = bangCandidate ? customBangs.find(b => b.t === bangCandidate) : null;
    if (customBang) {
        const cleanQuery = query.replace(/!\S+\s*/i, "").trim();
        return customBang.u.replace("%s", encodeURIComponent(cleanQuery).replace(/%2F/g, "/"));
    }

    // 2. Check Standard Bangs
    const defaultBang = bangs.find((b) => b[0] === defaultBangTag) || bangs.find((b) => b[0] === "g"); // Fallback to google
    const selectedBang = bangCandidate ? bangs.find((b) => b[0] === bangCandidate) : defaultBang;

    const finalBang = selectedBang || defaultBang;

    const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

    // If query is just `!gh` (and cleanQuery is empty), redirect to root domain
    if (cleanQuery === "") {
        if (customBang) return null;
        // If it's a standard bang
        return finalBang ? `https://${finalBang[2]}` : null;
    }

    if (!finalBang) return null;

    // Format of the url is: https://www.google.com/search?q={{{s}}}
    return finalBang[3].replace(
        "{{{s}}}",
        encodeURIComponent(cleanQuery).replace(/%2F/g, "/")
    );
}
