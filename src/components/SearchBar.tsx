import { useState, useEffect, useRef } from "preact/hooks";
import { CustomBang } from "./Settings";
import { bangs, Bang } from "../bang";
import { handleRedirect } from "../lib/utils";
import { SearchIcon } from "./SearchIcon";

interface SearchBarProps {
    openInNewTab: boolean;
    setOpenInNewTab: (val: boolean) => void;
    defaultBang: string;
    setDefaultBang: (val: string) => void;
    customBangs: CustomBang[];
    setCustomBangs: (val: CustomBang[]) => void;
    theme: string;
    setTheme: (val: string) => void;
    setNeedsExtension: (val: boolean) => void;
    setPendingRedirect: (url: string | null) => void;
}

export function SearchBar(props: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [bangMatches, setBangMatches] = useState<Bang[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    const getSearchTerms = (): string[] => {
        try {
            const stored = localStorage.getItem("searchTerms");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    };

    const saveSearchTerm = (term: string) => {
        const trimmedTerm = term.trim();
        if (!trimmedTerm) return;

        const terms = getSearchTerms();
        const index = terms.indexOf(trimmedTerm);
        if (index !== -1) terms.splice(index, 1);
        terms.unshift(trimmedTerm);
        if (terms.length > 20) terms.splice(20);
        localStorage.setItem("searchTerms", JSON.stringify(terms));
    };

    const doSearch = (termOverride?: string) => {
        const term = termOverride !== undefined ? termOverride : query;
        if (!term.trim()) return;
        saveSearchTerm(term);

        handleRedirect(
            term,
            props.defaultBang,
            props.customBangs,
            props.setNeedsExtension,
            props.setPendingRedirect,
            props.openInNewTab
        );
    };

    useEffect(() => {
        const q = query.toLowerCase();
        setSelectedIndex(-1);

        const bangMatch = q.match(/!(\S*)$/);

        if (bangMatch) {
            const bangPrefix = bangMatch[1];
            const allBangs: Bang[] = [
                ...props.customBangs.map((cb) => [cb.t, cb.c || cb.t, "Custom", cb.u] as Bang),
                ...bangs
            ];

            const matches = allBangs.filter((b) => b[0].startsWith(bangPrefix)).slice(0, 5);
            setBangMatches(matches);
            setSuggestions([]);
        } else {
            setBangMatches([]);

            const cleanQ = q.replace(/!\S+/g, "").trim();
            const history = getSearchTerms();

            if (!cleanQ) {
                setSuggestions(history.slice(0, 5));
            } else {
                const matches = history.filter((h) => h.toLowerCase().includes(cleanQ)).slice(0, 5);
                setSuggestions(matches);
            }
        }
    }, [query, props.customBangs]);

    const handleSelection = (item: string | Bang) => {
        if (Array.isArray(item)) {
            const newQuery = query.replace(/!(\S*)$/, `!${item[0]} `);
            setQuery(newQuery);
        } else {
            // If the item itself contains a bang, just use it as is
            if (item.includes("!")) {
                setQuery(item);
            } else {
                const existingBangs = query.match(/!\S+/g);
                if (existingBangs) {
                    const bangsFound = query.match(/!\S+/g) || [];
                    const startsWithBang = query.trim().startsWith("!");

                    if (startsWithBang) {
                        setQuery(`${bangsFound.join(" ")} ${item}`);
                    } else {
                        setQuery(`${item} ${bangsFound.join(" ")}`);
                    }
                } else {
                    setQuery(item);
                }
            }
        }
        inputRef.current?.focus();
        setBangMatches([]);
        setSuggestions([]);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const totalItems = [...bangMatches, ...suggestions];

        if (totalItems.length > 0) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % totalItems.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + totalItems.length) % totalItems.length);
            } else if (e.key === "Enter" && selectedIndex >= 0) {
                e.preventDefault();
                handleSelection(totalItems[selectedIndex]);
                return;
            }
        }

        if (e.key === "Enter") {
            doSearch();
        } else if (e.key === "Escape") {
            setBangMatches([]);
            setSuggestions([]);
            setSelectedIndex(-1);
        }
    };

    return (
        <div className="search-page">
            <div className="search-page-content">
                <h1 className="search-page-title">Unduck</h1>
                <div className="search-box-wrapper">
                    <div className="search-box-container">
                        <button className="icon-button search-icon" onClick={() => doSearch()}>
                            <SearchIcon className="icon" />
                        </button>
                        <input
                            ref={inputRef}
                            type="text"
                            id="searchbar-input"
                            value={query}
                            onInput={(e) => setQuery(e.currentTarget.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search…"
                            autoComplete="off"
                            autoFocus
                        />

                        {(suggestions.length > 0 || bangMatches.length > 0) && (
                            <div className="history-dropdown" style={{ display: "block" }}>
                                {bangMatches.length > 0 &&
                                    bangMatches.map((b, idx) => (
                                        <button
                                            key={b[0]}
                                            className={`history-button ${
                                                selectedIndex === idx ? "selected" : ""
                                            }`}
                                            onClick={() => handleSelection(b)}
                                            onMouseEnter={() => setSelectedIndex(idx)}
                                        >
                                            <strong>!{b[0]}</strong>{" "}
                                            <span style={{ opacity: 0.7 }}> - {b[1]}</span>
                                        </button>
                                    ))}
                                {suggestions.map((s, idx) => (
                                    <button
                                        key={s}
                                        className={`history-button ${
                                            selectedIndex === bangMatches.length + idx
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() => handleSelection(s)}
                                        onMouseEnter={() =>
                                            setSelectedIndex(bangMatches.length + idx)
                                        }
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {query && (
                            <button
                                className="icon-button clear-icon"
                                onClick={() => {
                                    setQuery("");
                                    inputRef.current?.focus();
                                }}
                            >
                                <img src="/clear-icon.svg" alt="Clear" className="icon" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
