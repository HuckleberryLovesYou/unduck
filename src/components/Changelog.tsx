import { changelogData } from "../lib/changelog-data";

interface ChangelogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Changelog({ isOpen, onClose }: ChangelogProps) {
    if (!isOpen) return null;

    return (
        <div className="settings-overlay" onClick={onClose} style={{ display: "block" }}>
            <div
                className="settings-popup changelog-popup"
                onClick={(e) => e.stopPropagation()}
                style={{ display: "flex" }}
            >
                <div className="settings-popup-header">
                    <h2>Changelog</h2>
                    <button
                        className="settings-close"
                        onClick={onClose}
                        aria-label="Close changelog"
                    >
                        ×
                    </button>
                </div>
                <div className="settings-popup-content changelog-content">
                    {changelogData.map((entry, index) => (
                        <div key={index} className="changelog-entry">
                            <div className="changelog-header">
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <h3 className="changelog-title">{entry.title}</h3>
                                    {entry.version && (
                                        <span className="changelog-version">{entry.version}</span>
                                    )}
                                </div>
                                <span className="changelog-date">{entry.date}</span>
                            </div>
                            <p className="changelog-description">{entry.description}</p>
                        </div>
                    ))}
                    {changelogData.length === 0 && (
                        <p style={{ opacity: 0.5, fontStyle: "italic", textAlign: "center" }}>
                            No changes yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
