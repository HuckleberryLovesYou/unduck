import { useState, useEffect } from "preact/hooks";
import { Home } from "./components/Home";
import { SearchBar } from "./components/SearchBar";
import { CustomBang } from "./components/Settings";
import { getBangRedirectUrl } from "./lib/utils";

export function App() {
    const [route, setRoute] = useState(window.location.pathname);

    // Settings State
    const [openInNewTab, setOpenInNewTab] = useState(() => localStorage.getItem("openInNewTab") === "true");
    const [defaultBang, setDefaultBang] = useState(() => localStorage.getItem("default-bang") || "g");
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
    const [customBangs, setCustomBangs] = useState<CustomBang[]>(() => {
        try {
            const stored = localStorage.getItem("custom-bangs");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

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
                effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
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

    if (query) {
        const redirectUrl = getBangRedirectUrl(query, defaultBang, customBangs);
        if (redirectUrl) {
            window.location.replace(redirectUrl);
            return null;
        }
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
