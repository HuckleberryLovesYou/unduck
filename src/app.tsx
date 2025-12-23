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
        />
    );
}
