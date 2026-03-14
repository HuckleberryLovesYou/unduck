import { Bang } from "../bang";
import { CustomBang } from "../components/Settings";

export type BangType = "static" | "custom" | "extension";

export interface PreparedBang {
    tag: string;
    name: string;
    domain: string;
    category: string;
    type: BangType;
    searchableString: string;
    tagLower: string;
    nameLower: string;
    domainLower: string;
    originalBang?: Bang;
}

export function prepareStaticBangs(bangs: Bang[]): PreparedBang[] {
    return bangs.map((b) => {
        const tagLower = b[0].toLowerCase();
        const nameLower = b[1].toLowerCase();
        const domainLower = (b[2] || "").toLowerCase();
        const catLower = (b[3] || "").toLowerCase();
        const searchableString = `${tagLower} ${nameLower} ${domainLower} ${catLower}`;
        return {
            tag: b[0],
            name: b[1],
            domain: b[2],
            category: b[3],
            type: "static",
            searchableString,
            tagLower,
            nameLower,
            domainLower,
            originalBang: b
        };
    });
}

export function prepareCustomBangs(customBangs: CustomBang[]): PreparedBang[] {
    return customBangs.map((cb) => {
        let domain = "";
        try {
            domain = new URL(cb.u.replace("%s", "")).hostname;
        } catch {
            domain = cb.u;
        }
        const cleanedTag = cb.t.startsWith("!") ? cb.t.slice(1) : cb.t;
        const name = cb.c || "Custom !Bang";
        const tagLower = cleanedTag.toLowerCase();
        const nameLower = name.toLowerCase();
        const domainLower = domain.toLowerCase();
        const searchableString = `${tagLower} ${nameLower} ${domainLower}`;
        return {
            tag: cleanedTag,
            name: name,
            domain: domain,
            category: "",
            type: "custom",
            searchableString,
            tagLower,
            nameLower,
            domainLower
        };
    });
}

export function prepareExtensionBangs(extensionBangs: Bang[]): PreparedBang[] {
    return extensionBangs.map((eb) => {
        const tagLower = eb[0].toLowerCase();
        const nameLower = eb[1].toLowerCase();
        const domainLower = (eb[2] || "").toLowerCase();
        const searchableString = `${tagLower} ${nameLower} ${domainLower}`;
        return {
            tag: eb[0],
            name: eb[1],
            domain: eb[2],
            category: eb[3],
            type: "extension",
            searchableString,
            tagLower,
            nameLower,
            domainLower,
            originalBang: eb
        };
    });
}

export function getRelevanceScore(bang: PreparedBang, query: string): number {
    let q = query.toLowerCase();
    if (q.startsWith("!")) q = q.slice(1);
    const { tagLower: tag, nameLower: name, domainLower: domain, type } = bang;

    let score = 0;

    // Exact matches
    if (tag === q) score += 10000;
    if (name === q) score += 5000;
    if (domain === q || domain === `www.${q}` || `www.${domain}` === q) score += 4000;
    
    // Starts with
    if (tag.startsWith(q)) score += 1000;
    if (name.startsWith(q)) score += 500;
    if (domain.startsWith(q) || domain.startsWith(`www.${q}`)) score += 400;

    // Includes
    if (tag.includes(q)) score += 100;
    if (name.includes(q)) score += 50;
    if (domain.includes(q)) score += 40;

    // Tie-breaker: prioritize shorter tags
    score -= tag.length;
    
    // Prioritize custom and extension bangs
    if (type === "custom" && score > 0) score += 20000;
    if (type === "extension" && score > 0) score += 15000;
    
    return score;
}

export function searchBangs(
    preparedBangs: PreparedBang[],
    query: string,
    limit?: number
): PreparedBang[] {
    let q = query.toLowerCase();
    if (q.startsWith("!")) q = q.slice(1);
    if (!q) return preparedBangs.slice(0, limit || preparedBangs.length);

    const filtered = preparedBangs.filter((b) => b.searchableString.includes(q));
    
    return filtered.sort((a, b) => {
        const scoreA = getRelevanceScore(a, q);
        const scoreB = getRelevanceScore(b, q);
        
        if (scoreA !== scoreB) {
            return scoreB - scoreA;
        }
        
        // Final tie-breaker: alphabetical by tag
        return a.tagLower.localeCompare(b.tagLower);
    }).slice(0, limit || filtered.length);
}
