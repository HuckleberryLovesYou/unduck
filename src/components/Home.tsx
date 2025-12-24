import { useState, useRef, useEffect } from "preact/hooks";
import { Settings, CustomBang } from "./Settings";
import { Changelog } from "./Changelog";
import { OnboardingArrow } from "./OnboardingArrow";
import { currentVersion } from "../lib/changelog-data";
import { isMajorOrMinorUpdate } from "../lib/utils";

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
    const [showChangelog, setShowChangelog] = useState(false);
    const [showCopied, setShowCopied] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Onboarding Arrow Logic
    const [showArrow, setShowArrow] = useState(false);

    useEffect(() => {
        const arrowSeen = localStorage.getItem("settings-arrow-seen");
        if (!arrowSeen) {
            setShowArrow(true);
            localStorage.setItem("settings-arrow-seen", "true");
        }
    }, []);

    // Smart Changelog Logic
    useEffect(() => {
        const visitCount = parseInt(localStorage.getItem("visit-count") || "0", 10) + 1;
        localStorage.setItem("visit-count", visitCount.toString());

        const lastSeenVersion = localStorage.getItem("last-seen-version");
        const closedPopupVersion = localStorage.getItem("closed-popup-version");

        let shouldOpen = false;

        if (visitCount === 2) {
            // Only open on 2nd visit if they haven't already closed it (e.g. manually on 1st visit)
            if (closedPopupVersion !== currentVersion) {
                shouldOpen = true;
            }
        } else if (lastSeenVersion && lastSeenVersion !== currentVersion) {
            // Check if major or minor update
            if (isMajorOrMinorUpdate(lastSeenVersion, currentVersion)) {
                // Only open if they haven't explicitly closed this version already
                // (Though logically if lastSeen != current repairs, they likely haven't closed it yet unless they opened it manually)
                if (closedPopupVersion !== currentVersion) {
                    shouldOpen = true;
                }
            }
        }

        if (shouldOpen) {
            setShowChangelog(true);
        }

        // Always update last seen to current
        localStorage.setItem("last-seen-version", currentVersion);

    }, []);

    const handleCloseChangelog = () => {
        setShowChangelog(false);
        localStorage.setItem("closed-popup-version", currentVersion);
    };

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

    const handleSettingsClick = () => {
        setShowSettings(true);
        if (showArrow) {
            setShowArrow(false);
        }
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

            <div className="bottom-left-group">
                {showArrow && <OnboardingArrow />}
                <button
                    className="homepage-settings-button"
                    title="Settings"
                    aria-label="Settings"
                    onClick={handleSettingsClick}
                >
                    <img src="/settings-icon.svg" alt="" className="icon" />
                </button>
                <button
                    className="changelog-button"
                    title="Changelog"
                    onClick={() => setShowChangelog(true)}
                >
                    Changelog
                </button>
                <span
                    className="version-text"
                    onClick={() => setShowChangelog(true)}
                    title="View Changelog"
                    style={{ cursor: "pointer" }}
                >
                    {currentVersion}
                </span>
            </div>

            <Settings
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                {...props}
            />

            <Changelog
                isOpen={showChangelog}
                onClose={handleCloseChangelog}
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
