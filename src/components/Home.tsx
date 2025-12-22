import { useState, useRef } from "preact/hooks";
import { Settings, CustomBang } from "./Settings";

interface HomeProps {
    openInNewTab: boolean;
    setOpenInNewTab: (val: boolean) => void;
    defaultBang: string;
    setDefaultBang: (val: string) => void;
    customBangs: CustomBang[];
    setCustomBangs: (val: CustomBang[]) => void;
}

export function Home(props: HomeProps) {
    const [showSettings, setShowSettings] = useState(false);
    const [showCopied, setShowCopied] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const copyUrl = async () => {
        if (inputRef.current) {
            try {
                await navigator.clipboard.writeText(inputRef.current.value);
                setShowCopied(true);
                setTimeout(() => setShowCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    };

    const navigateToSearch = (e: Event) => {
        e.preventDefault();
        history.pushState({}, "", "/searchbar");
        const navEvent = new PopStateEvent('popstate');
        window.dispatchEvent(navEvent);
    };

    return (
        <div className="homepage">
            <div className="homepage-content">
                <h1 className="homepage-title">Unduck</h1>
                <p className="homepage-description">
                    DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser to enable all <a href="https://duckduckgo.com/bang.html" target="_blank" rel="noreferrer">DuckDuckGo's&nbsp;bangs</a>.
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
                                <img src={showCopied ? "/clipboard-check-icon.svg" : "/clipboard-icon.svg"} alt="Copy" />
                            </button>
                            <div className="copy-message" hidden={!showCopied} style={{ opacity: showCopied ? 1 : 0, transform: showCopied ? 'translateY(0)' : 'translateY(20px)', display: showCopied ? 'block' : 'none' }}>
                                <span>Copied!</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="homepage-links">
                    <p className="searchbar-link">You can also use the !Bangs directly from the <a href="/searchbar" id="searchbar-link" onClick={navigateToSearch}>searchbar</a>.</p>
                    <a href="https://github.com/HuckleberryLovesYou/unduck#changed-bangs" target="_blank" rel="noreferrer" className="bangs-link">List of changed bangs</a>
                </div>
            </div>

            <button
                id="homepage-settings-button"
                className="homepage-settings-button"
                title="Settings"
                aria-label="Settings"
                onClick={() => setShowSettings(true)}
            >
                <img src="/settings-icon.svg" alt="" className="icon" />
            </button>

            <Settings
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                {...props}
            />

            <footer className="footer">
                <a href="https://timmatheis.com" target="_blank" rel="noreferrer">portfolio</a>
                <span className="footer-separator">•</span>
                <a href="https://linktr.ee/HuckleberryLovesYou" target="_blank" rel="noreferrer">linktr.ee</a>
                <span className="footer-separator">•</span>
                <a href="https://github.com/HuckleberryLovesYou/unduck" target="_blank" rel="noreferrer">Forked Source</a>
                <span className="footer-separator">•</span>
                <a href="https://github.com/t3dotgg/unduck" target="_blank" rel="noreferrer">Origin Source</a>
            </footer>
        </div>
    );
}
