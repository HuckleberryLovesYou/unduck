import { useState, useEffect } from "preact/hooks";
import { Home } from "./components/Home";
import { SearchBar } from "./components/SearchBar";
import { CustomBang } from "./components/Settings";
import { ExtensionRequiredModal } from "./components/ExtensionRequiredModal";
import { getBangRedirectUrl } from "./lib/utils";

function checkExtensionInstalled(): Promise<boolean> {
    return Promise.resolve(!!document.getElementById("__unduck_extension_installed__"));
}

export function App() {
    const [route, setRoute] = useState(window.location.pathname);

    // Settings State
    const [openInNewTab, setOpenInNewTab] = useState(
        () => localStorage.getItem("openInNewTab") === "true"
    );
    const [defaultBang, setDefaultBang] = useState(
        () => localStorage.getItem("default-bang") || "g"
    );
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
    const [customBangs, setCustomBangs] = useState<CustomBang[]>(() => {
        try {
            const stored = localStorage.getItem("custom-bangs");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Extension State
    const [needsExtension, setNeedsExtension] = useState(false);
    const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    // Tracks if we have already verified the extension is present in this session
    // Initializing with false implies we must check before trusting.
    // However, for speed, checking on every redirect is what was requested.

    // Save Settings
    useEffect(() => {
        localStorage.setItem("openInNewTab", openInNewTab.toString());
    }, [openInNewTab]);

    useEffect(() => {
        localStorage.setItem("default-bang", defaultBang);
    }, [defaultBang]);

    useEffect(() => {
        localStorage.setItem("theme", theme);
        const applyTheme = () => {
            let effectiveTheme = theme;
            if (theme === "system") {
                effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light";
            }
            document.documentElement.setAttribute("data-theme", effectiveTheme);
        };

        applyTheme();

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            if (theme === "system") applyTheme();
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem("custom-bangs", JSON.stringify(customBangs));
    }, [customBangs]);

    // Routing & Redirect Logic
    useEffect(() => {
        const handlePopState = () => {
            setRoute(window.location.pathname);
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const url = new URL(window.location.href);
    const query = url.searchParams.get("q")?.trim();

    // Handle Redirects
    useEffect(() => {
        if (!query) return;

        const redirectUrl = getBangRedirectUrl(query, defaultBang, customBangs);
        if (!redirectUrl) return;

        // Check if this is an extension-requiring URL
        if (redirectUrl.includes("?unduck=")) {
            const skipCheck = localStorage.getItem("unduck-skip-extension-check") === "true";

            if (skipCheck) {
                const cleanUrl = redirectUrl.split("?")[0];
                window.location.replace(cleanUrl);
                return;
            }

            // Perform async check
            checkExtensionInstalled().then((isInstalled) => {
                if (isInstalled) {
                    window.location.replace(redirectUrl);
                } else {
                    setPendingRedirect(redirectUrl);
                    setNeedsExtension(true);
                }
            });
        } else {
            window.location.replace(redirectUrl);
        }
    }, [query, defaultBang, customBangs]);

    // Polling only when modal is open
    useEffect(() => {
        if (!needsExtension || !pendingRedirect) return;

        const poll = setInterval(async () => {
            const isInstalled = await checkExtensionInstalled();
            if (isInstalled) {
                window.location.replace(pendingRedirect);
            }
        }, 1000);

        return () => clearInterval(poll);
    }, [needsExtension, pendingRedirect]);

    if (query && !needsExtension) {
        // If query exists and we aren't showing the modal, we are redirecting (returning null) or waiting for async check        return null;
    }

    if (needsExtension && pendingRedirect) {
        const skipRedirect = () => {
            if (dontShowAgain) {
                localStorage.setItem("unduck-skip-extension-check", "true");
            }
            const cleanUrl = pendingRedirect.split("?")[0];
            window.location.replace(cleanUrl);
        };

        return (
            <ExtensionRequiredModal
                onSkip={skipRedirect}
                dontShowAgain={dontShowAgain}
                setDontShowAgain={setDontShowAgain}
            />
        );
    }

    if (route.startsWith("/searchbar")) {
        return (
            <SearchBar
                openInNewTab={openInNewTab}
                setOpenInNewTab={setOpenInNewTab}
                defaultBang={defaultBang}
                setDefaultBang={setDefaultBang}
                customBangs={customBangs}
                setCustomBangs={setCustomBangs}
                theme={theme}
                setTheme={setTheme}
            />
        );
    }

    return (
        <Home
            openInNewTab={openInNewTab}
            setOpenInNewTab={setOpenInNewTab}
            defaultBang={defaultBang}
            setDefaultBang={setDefaultBang}
            customBangs={customBangs}
            setCustomBangs={setCustomBangs}
            theme={theme}
            setTheme={setTheme}
        />
    );
}
