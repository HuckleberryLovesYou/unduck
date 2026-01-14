import { FunctionalComponent } from "preact";
import { getBrowserType } from "../lib/utils";

interface ExtensionRequiredModalProps {
    onSkip: () => void;
    dontShowAgain: boolean;
    setDontShowAgain: (value: boolean) => void;
}

export const ExtensionRequiredModal: FunctionalComponent<ExtensionRequiredModalProps> = ({
    onSkip,
    dontShowAgain,
    setDontShowAgain
}) => {
    const browserType = getBrowserType();
    const extensionLink =
        browserType === "firefox"
            ? "https://addons.mozilla.org/en-US/firefox/addon/unduck-helper/"
            : "https://chrome.google.com/webstore/detail/unduck-helper/INSERT_ID_HERE"; //TODO: Add Chrome extension ID

    return (
        <div className="settings-overlay">
            <div className="settings-popup">
                <div className="settings-popup-header">
                    <h2>Extension Required</h2>
                </div>

                <div className="settings-popup-content extension-modal-content">
                    <p className="extension-modal-text">
                        This site doesn't support searching via URL directly. To autofill your
                        query, you need the <strong>Unduck Helper</strong> extension.
                    </p>

                    <div className="extension-modal-actions">
                        <a
                            href={extensionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="extension-install-btn"
                        >
                            {browserType === "firefox" ? "Get Add-on for Firefox" : "Get Add-on for Chrome"}
                        </a>

                        <button onClick={onSkip} className="extension-skip-btn">
                            Skip (Open without Query)
                        </button>
                    </div>

                    <div className="extension-modal-footer">
                        <input
                            type="checkbox"
                            id="dontShow"
                            checked={dontShowAgain}
                            onChange={(e) => setDontShowAgain(e.currentTarget.checked)}
                            className="extension-checkbox"
                        />
                        <label htmlFor="dontShow" className="extension-checkbox-label">
                            Don't show again
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};
