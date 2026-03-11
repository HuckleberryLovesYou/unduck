import { useState, useMemo, useEffect, useRef } from "preact/hooks";
import autoAnimate from "@formkit/auto-animate";
import { bangs } from "../bang";
import { extensionBangs } from "../extensionBang";
import { CustomBang } from "./Settings";

function getRelevanceScore(bang: string[], query: string, type: string = "static"): number {
    let q = query.toLowerCase();
    if (q.startsWith("!")) q = q.slice(1);
    const tag = bang[6];
    const name = bang[7];
    const domain = bang[8];

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

    // Tie-breaker: prioritize shorter tags to surface the "main" short bangs first
    score -= tag.length;
    
    // Prioritize custom and extension bangs if they match
    if (type === "custom" && score > 0) score += 20000;
    if (type === "extension" && score > 0) score += 15000;
    
    return score;
}

interface BangsProps {
    customBangs?: CustomBang[];
}

export function Bangs({ customBangs = [] }: BangsProps) {
    const preparedStaticBangs = useMemo(() => {
        return bangs.map((b) => {
            const tagLower = b[0].toLowerCase();
            const nameLower = b[1].toLowerCase();
            const domainLower = (b[2] || "").toLowerCase();
            const catLower = (b[3] || "").toLowerCase();
            const searchableString = `${tagLower} ${nameLower} ${domainLower} ${catLower}`;
            return [b[0], b[1], b[2], b[3], "static", searchableString, tagLower, nameLower, domainLower];
        });
    }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [sortColumn, setSortColumn] = useState<"tag" | "name" | "domain" | "relevance">("relevance");

    const listRef = useRef<HTMLTableSectionElement>(null);

    useEffect(() => {
        if (listRef.current) {
            autoAnimate(listRef.current, { duration: 200 });
        }
    }, [listRef]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 150);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const allBangs = useMemo(() => {
        const formattedCustomBangs = customBangs.map((cb) => {
            let domain = "";
            try {
                domain = new URL(cb.u.replace("%s", "")).hostname;
            } catch {
                domain = cb.u;
            }
            // Strip any leading "!" from custom bangs since Bangs UI pre-appends it automatically
            const cleanedTag = cb.t.startsWith("!") ? cb.t.slice(1) : cb.t;
            const name = cb.c || "Custom !Bang";
            const tagLower = cleanedTag.toLowerCase();
            const nameLower = name.toLowerCase();
            const domainLower = domain.toLowerCase();
            const searchableString = `${tagLower} ${nameLower} ${domainLower}`;
            
            // Add a special 5th element flag "custom" to easily identify it in the score function
            return [cleanedTag, name, domain, "", "custom", searchableString, tagLower, nameLower, domainLower];
        });

        const formattedExtensionBangs = extensionBangs.map((eb) => {
            const tagLower = eb[0].toLowerCase();
            const nameLower = eb[1].toLowerCase();
            const domainLower = (eb[2] || "").toLowerCase();
            const searchableString = `${tagLower} ${nameLower} ${domainLower}`;
            return [eb[0], eb[1], eb[2], eb[3], "extension", searchableString, tagLower, nameLower, domainLower];
        });

        return [...formattedExtensionBangs, ...formattedCustomBangs, ...preparedStaticBangs];
    }, [customBangs, preparedStaticBangs]);

    const filteredBangs = useMemo(() => {
        if (!debouncedQuery) return allBangs;
        
        let q = debouncedQuery.toLowerCase();
        if (q.startsWith("!")) q = q.slice(1);
        
        if (!q) return allBangs;

        return allBangs.filter((b) => b[5].includes(q));
    }, [debouncedQuery, allBangs]);

    const sortedBangs = useMemo(() => {
        return [...filteredBangs].sort((a, b) => {
            const typeA = a[4];
            const typeB = b[4];

            if (sortColumn === "relevance" && debouncedQuery) {
                const scoreA = getRelevanceScore(a, debouncedQuery, typeA);
                const scoreB = getRelevanceScore(b, debouncedQuery, typeB);
                if (scoreA !== scoreB) {
                    return scoreB - scoreA;
                }
            }

            let valA = "";
            let valB = "";
            if (sortColumn === "tag" || sortColumn === "relevance") {
                valA = a[6];
                valB = b[6];
            } else if (sortColumn === "name") {
                valA = a[7];
                valB = b[7];
            } else if (sortColumn === "domain") {
                valA = a[8];
                valB = b[8];
            }
            
            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredBangs, sortColumn, sortOrder]);

    const handleSort = (column: "tag" | "name" | "domain") => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortOrder("asc");
        }
    };

    const handleSearchInput = (e: any) => {
        const val = e.currentTarget.value;
        setSearchQuery(val);
        if (val) {
            setSortColumn("relevance");
            setSortOrder("asc");
        } else {
            setSortColumn("tag");
            setSortOrder("asc");
        }
    };

    const displayBangs = sortedBangs.slice(0, 100);

    return (
        <div className="bangs-page">
            <div className="bangs-header">
                <h1 className="bangs-title">!Bangs Search</h1>
                <p className="bangs-description">
                    Fuzzy search through {allBangs.length.toLocaleString()} available !Bangs.
                </p>
                <div className="bangs-search-wrapper">
                    <input
                        type="text"
                        className="bangs-search-input"
                        placeholder="Search by tag, name, or url..."
                        value={searchQuery}
                        onInput={handleSearchInput}
                    />
                </div>
            </div>

            <div className="bangs-table-container">
                <table className="bangs-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort("tag")} className="sortable">
                                Tag {sortColumn === "tag" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th onClick={() => handleSort("name")} className="sortable">
                                Name {sortColumn === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th onClick={() => handleSort("domain")} className="sortable">
                                Domain {sortColumn === "domain" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                        </tr>
                    </thead>
                    <tbody ref={listRef}>
                        {displayBangs.map((b) => (
                            <tr key={b[0]}>
                                <td className="bang-tag">
                                    !{b[0]}
                                    {b[4] === "custom" && (
                                        <span style={{ 
                                            marginLeft: "8px", 
                                            fontSize: "0.7em", 
                                            background: "var(--bg-active)", 
                                            padding: "2px 6px", 
                                            borderRadius: "4px",
                                            color: "var(--text-muted)"
                                        }}>
                                            Custom
                                        </span>
                                    )}
                                    {b[4] === "extension" && (
                                        <span className="bang-extension-badge" style={{ 
                                            marginLeft: "8px", 
                                            fontSize: "0.7em", 
                                            padding: "2px 6px", 
                                            borderRadius: "4px",
                                        }}>
                                            Extension
                                        </span>
                                    )}
                                </td>
                                <td className="bang-name">{b[1]}</td>
                                <td className="bang-domain">{b[2]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {sortedBangs.length > 100 && (
                    <div className="bangs-limit-notice">
                        Showing 100 of {sortedBangs.length} results. Type to filter more.
                    </div>
                )}
                {sortedBangs.length === 0 && (
                    <div className="bangs-no-results">
                        No !Bangs found matching "{debouncedQuery}".
                    </div>
                )}
            </div>
        </div>
    );
}
