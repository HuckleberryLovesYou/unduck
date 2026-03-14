import { useState, useMemo, useEffect, useRef } from "preact/hooks";
import autoAnimate from "@formkit/auto-animate";
import { bangs } from "../bang";
import { extensionBangs } from "../extensionBang";
import { CustomBang } from "./Settings";
import { 
    prepareStaticBangs, 
    prepareCustomBangs, 
    prepareExtensionBangs, 
    searchBangs
} from "../lib/searchUtils";

interface BangsProps {
    customBangs?: CustomBang[];
}

export function Bangs({ customBangs = [] }: BangsProps) {
    const preparedStaticBangs = useMemo(() => {
        return prepareStaticBangs(bangs);
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
        const formattedCustomBangs = prepareCustomBangs(customBangs);
        const formattedExtensionBangs = prepareExtensionBangs(extensionBangs);

        return [...formattedExtensionBangs, ...formattedCustomBangs, ...preparedStaticBangs];
    }, [customBangs, preparedStaticBangs]);

    const filteredBangs = useMemo(() => {
        if (!debouncedQuery) return allBangs;
        return searchBangs(allBangs, debouncedQuery);
    }, [debouncedQuery, allBangs]);

    const sortedBangs = useMemo(() => {
        // If sorting by relevance, searchBangs already handled it
        if (sortColumn === "relevance" && debouncedQuery) {
            return filteredBangs;
        }

        return [...filteredBangs].sort((a, b) => {
            let valA = "";
            let valB = "";
            if (sortColumn === "tag" || sortColumn === "relevance") {
                valA = a.tagLower;
                valB = b.tagLower;
            } else if (sortColumn === "name") {
                valA = a.nameLower;
                valB = b.nameLower;
            } else if (sortColumn === "domain") {
                valA = a.domainLower;
                valB = b.domainLower;
            }
            
            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredBangs, sortColumn, sortOrder, debouncedQuery]);

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
                <h1 className="bangs-title">Find !Bangs</h1>
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
                            <tr key={b.tag}>
                                <td className="bang-tag">
                                    !{b.tag}
                                    {b.type === "custom" && (
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
                                    {b.type === "extension" && (
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
                                <td className="bang-name">{b.name}</td>
                                <td className="bang-domain">{b.domain}</td>
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
