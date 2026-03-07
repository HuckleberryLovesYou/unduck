import { useState } from "preact/hooks";
import { changedBangs } from "../lib/changedBangs";
import { CopyIcon } from "./CopyIcon";
import { ExternalLinkIcon } from "./ExternalLinkIcon";

export function ChangedBangs() {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = (text: string, index: number) => {
        if (!text || text === "-" || text === "None") return;
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="changed-bangs-page">
            <div className="changed-bangs-header">
                <h1 className="changed-bangs-title">Changed Bangs</h1>
                <p className="changed-bangs-description">
                    This fork includes several custom bang overrides for better utility.
                </p>
            </div>

            <div className="changed-bangs-grid">
                {changedBangs.map((bang, index) => (
                    <div className="changed-bang-card" key={index}>
                        <div className="bang-card-left">
                            <div className="bang-compare">
                                {bang.original && bang.original !== "None" ? (
                                    <span
                                        className="bang-original"
                                        title={`Original: ${bang.original}`}
                                    >
                                        {bang.original}
                                    </span>
                                ) : (
                                    <span className="bang-none" title="No original bang">
                                        None
                                    </span>
                                )}
                                <span className="bang-arrow">→</span>
                                {bang.changed && bang.changed !== "None" ? (
                                    <button
                                        className="bang-changed copyable"
                                        onClick={() => handleCopy(bang.changed!, index)}
                                        title="Copy bang"
                                    >
                                        <span>{bang.changed}</span>
                                        <CopyIcon
                                            className="bang-copy-icon"
                                            isCopied={copiedIndex === index}
                                        />
                                    </button>
                                ) : (
                                    <span className="bang-none" title="No replacement bang">
                                        None
                                    </span>
                                )}
                            </div>
                            <div className="bang-description-wrapper">
                                <p className="bang-description">{bang.description}</p>
                                {bang.isExtensionRequired && (
                                    <span className="bang-extension-badge">Extension required</span>
                                )}
                            </div>
                        </div>

                        {bang.url && (
                            <a
                                href={bang.url}
                                target="_blank"
                                rel="noreferrer"
                                className="bang-card-link"
                                title="Visit link"
                            >
                                <ExternalLinkIcon className="bang-external-icon" />
                            </a>
                        )}

                        {copiedIndex === index && (
                            <div className="bang-copied-message">Copied!</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
