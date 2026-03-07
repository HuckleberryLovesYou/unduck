import { useState, useEffect } from "preact/hooks";
import { Settings, CustomBang } from "./Settings";
import { Changelog } from "./Changelog";
import { currentVersion } from "../lib/changelog-data";
import { isMajorOrMinorUpdate } from "../lib/utils";
import { SidebarIcon } from "./SidebarIcon";
import { SearchIcon } from "./SearchIcon";
import { GearIcon } from "./GearIcon";
import { FileDescriptionIcon } from "./FileDescriptionIcon";
import { HomeIcon } from "./HomeIcon";
import { ExternalLinkIcon } from "./ExternalLinkIcon";

interface SidebarProps {
    openInNewTab: boolean;
    setOpenInNewTab: (val: boolean) => void;
    defaultBang: string;
    setDefaultBang: (val: string) => void;
    customBangs: CustomBang[];
    setCustomBangs: (val: CustomBang[]) => void;
    theme: string;
    setTheme: (val: string) => void;
}

export function Sidebar(props: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [showChangelog, setShowChangelog] = useState(false);

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
            if (closedPopupVersion !== currentVersion) {
                shouldOpen = true;
            }
        } else if (lastSeenVersion && lastSeenVersion !== currentVersion) {
            if (isMajorOrMinorUpdate(lastSeenVersion, currentVersion)) {
                if (closedPopupVersion !== currentVersion) {
                    shouldOpen = true;
                }
            }
        }

        if (shouldOpen) {
            setShowChangelog(true);
        }

        localStorage.setItem("last-seen-version", currentVersion);
    }, []);

    const handleCloseChangelog = () => {
        setShowChangelog(false);
        localStorage.setItem("closed-popup-version", currentVersion);
    };

    const handleSettingsClick = () => {
        setShowSettings(true);
        if (showArrow) {
            setShowArrow(false);
        }
    };

    const navigateToSearch = (e: Event) => {
        e.preventDefault();
        history.pushState({}, "", "/searchbar");
        const navEvent = new PopStateEvent("popstate");
        window.dispatchEvent(navEvent);
    };

    return (
        <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
            <button
                className={`sidebar-toggle ${isOpen ? "open" : "closed"}`}
                onClick={() => setIsOpen(!isOpen)}
                title={isOpen ? "Close Sidebar" : "Open Sidebar"}
            >
                <SidebarIcon isOpen={isOpen} />
            </button>

            <div className="sidebar-content">
                <div className="sidebar-header">
                    <span className="sidebar-title">Unduck</span>
                </div>

                <div className="sidebar-nav">
                    <a
                        href="/"
                        className="sidebar-link"
                        onClick={(e) => {
                            e.preventDefault();
                            history.pushState({}, "", "/");
                            window.dispatchEvent(new PopStateEvent("popstate"));
                        }}
                    >
                        <HomeIcon className="sidebar-icon" />
                        Home
                    </a>
                    <a href="/searchbar" className="sidebar-link" onClick={navigateToSearch}>
                        <SearchIcon className="sidebar-icon" />
                        Searchbar
                    </a>
                    <button className="sidebar-link" onClick={handleSettingsClick}>
                        <GearIcon className="sidebar-icon" />
                        Settings
                        {showArrow && <span className="settings-badge">New</span>}
                    </button>
                    <a
                        href="/changed-bangs"
                        className="sidebar-link"
                        onClick={(e) => {
                            e.preventDefault();
                            history.pushState({}, "", "/changed-bangs");
                            window.dispatchEvent(new PopStateEvent("popstate"));
                        }}
                    >
                        <FileDescriptionIcon className="sidebar-icon" />
                        Changed bangs
                    </a>
                    <button className="sidebar-link" onClick={() => setShowChangelog(true)}>
                        <FileDescriptionIcon className="sidebar-icon" />
                        Changelog
                    </button>
                </div>

                <div className="sidebar-separator"></div>

                <div className="sidebar-external-links">
                    <a
                        href="https://github.com/HuckleberryLovesYou/unduck"
                        target="_blank"
                        rel="noreferrer"
                        className="sidebar-link"
                    >
                        <ExternalLinkIcon className="sidebar-icon" />
                        Forked Source
                    </a>
                    <a
                        href="https://github.com/t3dotgg/unduck"
                        target="_blank"
                        rel="noreferrer"
                        className="sidebar-link"
                    >
                        <ExternalLinkIcon className="sidebar-icon" />
                        Origin Source
                    </a>
                    <a
                        href="https://timmatheis.com"
                        target="_blank"
                        rel="noreferrer"
                        className="sidebar-link"
                    >
                        <ExternalLinkIcon className="sidebar-icon" />
                        Portfolio
                    </a>
                    <a
                        href="https://linktr.ee/HuckleberryLovesYou"
                        target="_blank"
                        rel="noreferrer"
                        className="sidebar-link"
                    >
                        <ExternalLinkIcon className="sidebar-icon" />
                        linktr.ee
                    </a>
                </div>

                <div className="sidebar-footer">
                    <span className="sidebar-version">{currentVersion}</span>
                </div>
            </div>

            <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} {...props} />
            <Changelog isOpen={showChangelog} onClose={handleCloseChangelog} />
        </div>
    );
}
