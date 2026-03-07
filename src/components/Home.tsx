import { useRef, useState } from "preact/hooks";
import { CopyIcon } from "./CopyIcon";

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
                            <div
                                className="copy-message"
                                hidden={!showCopied}
                                style={{
                                    opacity: showCopied ? 1 : 0,
                                    transform: showCopied ? "translateY(0)" : "translateY(20px)",
                                    display: showCopied ? "block" : "none"
                                }}
                            >
                                <span>Copied!</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="homepage-links">
                    <p className="searchbar-link">
                        You can also use the !Bangs directly from the{" "}
                        <a href="/searchbar" id="searchbar-link" onClick={navigateToSearch}>
                            searchbar
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
