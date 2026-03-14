import { bangs } from "../bang";
import { extensionBangs } from "../extensionBang";
import { CustomBang } from "../components/Settings";

export function getBangRedirectUrl(
    query: string,
    defaultBangTag: string,
    customBangs: CustomBang[] = []
): string | null {
    const match = query.match(/!(\S+)/i);
    const bangCandidate = match?.[1]?.toLowerCase();

    // 1. Check Custom Bangs first
    const customBang = bangCandidate ? customBangs.find((b) => b.t === bangCandidate) : null;
    if (customBang) {
        const cleanQuery = query.replace(/!\S+\s*/i, "").trim();
        return customBang.u.replace("%s", encodeURIComponent(cleanQuery).replace(/%2F/g, "/"));
    }

    // 2. Check Extension Bangs
    const extensionBang = bangCandidate ? extensionBangs.find((b) => b[0] === bangCandidate) : null;
    if (extensionBang) {
        const cleanQuery = query.replace(/!\S+\s*/i, "").trim();
        if (cleanQuery === "") return `https://${extensionBang[2]}`;
        return extensionBang[3].replace("{{{s}}}", encodeURIComponent(cleanQuery));
    }

    // 3. Check Standard Bangs
    const defaultBang =
        bangs.find((b) => b[0] === defaultBangTag) ??
        (customBangs.find((b) => b.t === defaultBangTag)
            ? ([
                  customBangs.find((b) => b.t === defaultBangTag)!.t,
                  customBangs.find((b) => b.t === defaultBangTag)!.c || "Custom",
                  "Custom",
                  customBangs.find((b) => b.t === defaultBangTag)!.u.replace("%s", "{{{s}}}")
              ] as any)
            : null) ??
        bangs.find((b) => b[0] === "g"); // Fallback to google

    const selectedBang = bangCandidate ? bangs.find((b) => b[0] === bangCandidate) : defaultBang;

    const finalBang = selectedBang || defaultBang;

    const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

    // If query is just `!gh` (and cleanQuery is empty), redirect to root domain
    if (cleanQuery === "") {
        if (customBang) return null;
        // If it's a standard bang
        return finalBang ? `https://${finalBang[2]}` : null;
    }

    if (!finalBang) return null;

    // Format of the url is: https://www.google.com/search?q={{{s}}}
    return finalBang[3].replace("{{{s}}}", encodeURIComponent(cleanQuery).replace(/%2F/g, "/"));
}

export function checkExtensionInstalled(): Promise<boolean> {
    if (typeof document === "undefined") return Promise.resolve(false);
    return Promise.resolve(!!document.getElementById("__unduck_extension_installed__"));
}

export function handleRedirect(
    query: string,
    defaultBang: string,
    customBangs: CustomBang[],
    setNeedsExtension: (val: boolean) => void,
    setPendingRedirect: (url: string | null) => void,
    openInNewTab: boolean = false
) {
    const redirectUrl = getBangRedirectUrl(query, defaultBang, customBangs);
    if (!redirectUrl) return;

    const executeRedirect = (url: string) => {
        if (openInNewTab) {
            window.open(url, "_blank");
        } else {
            window.location.replace(url);
        }
    };

    // Check if this is an extension-requiring URL
    if (redirectUrl.includes("?unduck=")) {
        const skipCheck = localStorage.getItem("unduck-skip-extension-check") === "true";

        if (skipCheck) {
            const cleanUrl = redirectUrl.split("?")[0];
            executeRedirect(cleanUrl);
            return;
        }

        // Perform async check
        checkExtensionInstalled().then((isInstalled) => {
            if (isInstalled) {
                executeRedirect(redirectUrl);
            } else {
                setPendingRedirect(redirectUrl);
                setNeedsExtension(true);
            }
        });
    } else {
        executeRedirect(redirectUrl);
    }
}

export function parseVersion(version: string) {
    const match = version.match(/^v?(\d+)\.(\d+)\.(\d+)$/);
    if (!match) return { major: 0, minor: 0, patch: 0 };
    return {
        major: parseInt(match[1], 10),
        minor: parseInt(match[2], 10),
        patch: parseInt(match[3], 10)
    };
}

export function isMajorOrMinorUpdate(oldVersion: string, newVersion: string): boolean {
    const oldV = parseVersion(oldVersion);
    const newV = parseVersion(newVersion);

    if (newV.major > oldV.major) return true;
    if (newV.major === oldV.major && newV.minor > oldV.minor) return true;

    return false;
}

export type BrowserType = "chrome" | "firefox";

export function getBrowserType(): BrowserType {
    if (typeof navigator === "undefined") return "chrome";

    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.indexOf("firefox") > -1) {
        return "firefox";
    }

    return "chrome";
}
