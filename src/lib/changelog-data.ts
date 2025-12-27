export const currentVersion = "v0.2.1";

export interface ChangelogEntry {
    date: string;
    title: string;
    description: string;
    version?: string;
}

export const changelogData: ChangelogEntry[] = [
    {
        date: "2025-12-27",
        title: "Settings toast fix",
        description:
            "Fixed an issue where toast notifications would not show, if the toast animation is already being shown.",
        version: "v0.2.1"
    },
    {
        date: "2025-12-27",
        title: "Themes",
        description: "Added a theme selector to switch between dark, light, and system themes.",
        version: "v0.2.0"
    },
    {
        date: "2025-12-24",
        title: "Feature Discovery",
        description: "Added an onboarding arrow to highlight the Default & Custom Bangs settings.",
        version: "v0.1.2"
    },
    {
        date: "2025-12-24",
        title: "Smart Changelog Fix",
        description:
            "Fixed an issue where the changelog popup would reopen on the second visit even if manually closed.",
        version: "v0.1.1"
    },
    {
        date: "2025-12-24",
        title: "Versioning & Changelog",
        description:
            "Added a version display and a smart changelog popup to keep users updated on new features.",
        version: "v0.1.0"
    },
    {
        date: "2025-12-23",
        title: "Toast Visibility Fix",
        description:
            "Fixed an issue where toast notifications were not staying visible long enough.",
        version: "v0.0.3"
    },
    {
        date: "2025-12-22",
        title: "Code Cleanup",
        description: "Removed unused code and comments to improve maintainability.",
        version: "v0.0.2"
    },
    {
        date: "2025-12-22",
        title: "UI & Style Updates",
        description: "Updated global styles and fixed favicon missing.",
        version: "v0.0.2"
    },
    {
        date: "2025-12-22",
        title: "Bang Logic Improvements",
        description:
            "Enhanced bang redirect logic and updated bang data for better search accuracy.",
        version: "v0.0.2"
    },
    {
        date: "2025-12-22",
        title: "Preact Migration",
        description:
            "Migrated the application to Preact for improved performance and a smaller footprint.",
        version: "v0.0.2"
    },
    {
        date: "2025-02-14",
        title: "Initial Release",
        description: "Initial commit and basic project structure setup.",
        version: "v0.0.1"
    }
];
