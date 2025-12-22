import { useState, useEffect, useRef } from "preact/hooks";
import { Settings, CustomBang } from "./Settings";
import { bangs, Bang } from "../bang";
import { getBangRedirectUrl } from "../lib/utils";

interface SearchBarProps {
    openInNewTab: boolean;
    setOpenInNewTab: (val: boolean) => void;
    defaultBang: string;
    setDefaultBang: (val: string) => void;
    customBangs: CustomBang[];
    setCustomBangs: (val: CustomBang[]) => void;
}

export function SearchBar(props: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [showSettings, setShowSettings] = useState(false);
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
        const cleanTerm = term.replace(/!\S+/g, "").trim();
        if (!cleanTerm) return;

        const terms = getSearchTerms();
        const index = terms.indexOf(cleanTerm);
        if (index !== -1) terms.splice(index, 1);
        terms.unshift(cleanTerm);
        if (terms.length > 20) terms.splice(20);
        localStorage.setItem("searchTerms", JSON.stringify(terms));
    };

    const doSearch = (termOverride?: string) => {
        const term = termOverride !== undefined ? termOverride : query;
        if (!term.trim()) return;
        saveSearchTerm(term);

        const url = getBangRedirectUrl(term, props.defaultBang, props.customBangs);
        if (url) {
            if (props.openInNewTab) {
                window.open(url, "_blank");
            } else {
                window.location.replace(url);
            }
        }
    };

    useEffect(() => {
        const q = query.toLowerCase();
        setSelectedIndex(-1);

        const bangMatch = q.match(/!(\S*)$/);

        if (bangMatch) {
            const bangPrefix = bangMatch[1];
            const allBangs: Bang[] = [
                ...props.customBangs.map(cb => [cb.t, cb.c || cb.t, "Custom", cb.u] as Bang),
                ...bangs
            ];

            const matches = allBangs.filter(b => b[0].startsWith(bangPrefix)).slice(0, 5);
            setBangMatches(matches);
            setSuggestions([]);
        } else {
            setBangMatches([]);

            const cleanQ = q.replace(/!\S+/g, "").trim();
            const history = getSearchTerms();

            if (!cleanQ) {
                setSuggestions(history.slice(0, 5));
            } else {
                const matches = history.filter(h => h.toLowerCase().includes(cleanQ)).slice(0, 5);
                setSuggestions(matches);
            }
        }
    }, [query, props.customBangs]);


    const handleSelection = (item: string | Bang) => {
        if (Array.isArray(item)) {
            const newQuery = query.replace(/!(\S*)$/, `!${item[0]} `);
            setQuery(newQuery);
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
        inputRef.current?.focus();
        setBangMatches([]);
        setSuggestions([]);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const totalItems = [...bangMatches, ...suggestions];

        if (totalItems.length > 0) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % totalItems.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + totalItems.length) % totalItems.length);
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

    const goBack = () => {
        history.pushState({}, "", "/");
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
        <div className="search-page">
            <button className="back-button" title="Back" onClick={goBack}>←</button>

            <div className="search-page-content">
                <h1 className="search-page-title">Unduck</h1>
                <div className="search-box-wrapper">

                    <div className="search-box-container">
                        <button className="icon-button search-icon" onClick={() => doSearch()}>
                            <img src="/search-icon.svg" alt="Search" className="icon" />
                        </button>
                        <input
                            ref={inputRef}
                            type="text"
                            id="searchbar-input"
                            value={query}
                            onInput={e => setQuery(e.currentTarget.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search…"
                            autoComplete="off"
                            autoFocus
                        />

                        {(suggestions.length > 0 || bangMatches.length > 0) && (
                            <div className="history-dropdown" style={{ display: 'block' }}>
                                {bangMatches.length > 0 && bangMatches.map((b, idx) => (
                                    <button
                                        key={b[0]}
                                        className={`history-button ${selectedIndex === idx ? "selected" : ""}`}
                                        onClick={() => handleSelection(b)}
                                        onMouseEnter={() => setSelectedIndex(idx)}
                                    >
                                        <strong>!{b[0]}</strong> <span style={{ opacity: 0.7 }}> - {b[1]}</span>
                                    </button>
                                ))}
                                {suggestions.map((s, idx) => (
                                    <button
                                        key={s}
                                        className={`history-button ${selectedIndex === (bangMatches.length + idx) ? "selected" : ""}`}
                                        onClick={() => handleSelection(s)}
                                        onMouseEnter={() => setSelectedIndex(bangMatches.length + idx)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {query && (
                            <button className="icon-button clear-icon" onClick={() => { setQuery(""); inputRef.current?.focus(); }}>
                                <img src="/clear-icon.svg" alt="Clear" className="icon" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <button className="settings-button" onClick={() => setShowSettings(true)}>
                <img src="/settings-icon.svg" alt="Settings" className="icon" />
            </button>

            <Settings
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                {...props}
            />
        </div>
    );
}
