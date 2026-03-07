import { useRef, useState } from "preact/hooks";
import { CopyIcon } from "./CopyIcon";
import { ExternalLinkIcon } from "./ExternalLinkIcon";

export function Home() {
    const [showCopied, setShowCopied] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const copyUrl = async () => {
        if (inputRef.current) {
            try {
                await navigator.clipboard.writeText(inputRef.current.value);
                setShowCopied(true);
                setTimeout(() => setShowCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy text: ", err);
            }
        }
    };

    const navigateToSearch = (e: Event) => {
        e.preventDefault();
        history.pushState({}, "", "/searchbar");
        const navEvent = new PopStateEvent("popstate");
        window.dispatchEvent(navEvent);
    };

    return (
        <div className="homepage">
            <div className="homepage-content">
                <h1 className="homepage-title">Unduck</h1>
                <p className="homepage-description">
                    DuckDuckGo's !Bang redirects are too slow. Add the following URL as a custom
                    search engine to your browser to enable all{" "}
                    <a href="https://duckduckgo.com/bang.html" target="_blank" rel="noreferrer">
                        DuckDuckGo's&nbsp;!Bangs
                    </a>
                    <ExternalLinkIcon
                        style={{
                            width: "14px",
                            height: "14px",
                            marginLeft: "4px",
                            marginBottom: "4px",
                            marginRight: "-2px"
                        }}
                    />
                    .
                </p>
                <div className="url-container-wrapper">
                    <div className="url-container">
                        <input
                            ref={inputRef}
                            type="text"
                            className="url-input"
                            value="https://search.timmatheis.com?q=%s"
                            readOnly
                            autoFocus
                        />
                        <div className="copy-section">
                            <button className="copy-button" title="Copy" onClick={copyUrl}>
                                <CopyIcon
                                    isCopied={showCopied}
                                    style={{ width: "18px", height: "18px" }}
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="homepage-links">
                    <p className="searchbar-link">
                        You can also use the !Bangs directly from the{" "}
                        <a href="/searchbar" id="searchbar-link" onClick={navigateToSearch}>
                            searchbar
                        </a>
                        ,<br /> or configure the behavior of unduck in the settings.
                    </p>
                </div>
            </div>
        </div>
    );
}
