import { useState, useEffect } from "preact/hooks";
import { bangs } from "../bang";

export interface CustomBang {
    t: string; // tag
    u: string; // url
    c?: string; // category/name
}

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
    openInNewTab: boolean;
    setOpenInNewTab: (value: boolean) => void;
    defaultBang: string;
    setDefaultBang: (value: string) => void;
    customBangs: CustomBang[];
    setCustomBangs: (bangs: CustomBang[]) => void;
}

export function Settings({
    isOpen,
    onClose,
    openInNewTab,
    setOpenInNewTab,
    defaultBang,
    setDefaultBang,
    customBangs,
    setCustomBangs
}: SettingsProps) {
    const [localDefaultBang, setLocalDefaultBang] = useState(defaultBang);
    const [defaultBangError, setDefaultBangError] = useState("");
    const [showToast, setShowToast] = useState(false);

    // Custom Bang Form State
    const [cbTag, setCbTag] = useState("!");
    const [cbUrl, setCbUrl] = useState("");
    const [cbName, setCbName] = useState("");

    useEffect(() => {
        setLocalDefaultBang(defaultBang);
    }, [defaultBang]);

    // Toast Helper
    const triggerToast = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const validateAndSetDefaultBang = (rawValue: string) => {
        // Ensure starts with ! for display
        let displayValue = rawValue;
        if (!displayValue.startsWith("!")) {
            displayValue = "!" + displayValue;
        }

        // Logic value (remove !)
        const tag = displayValue.substring(1);
        setLocalDefaultBang(tag);

        const trimmed = tag.trim().toLowerCase();

        // Allow empty to just be "!" or empty string in logic -> resets to google
        if (!trimmed) {
            setDefaultBang("g");
            setDefaultBangError("");
            return;
        }

        const exists = bangs.some(b => b[0] === trimmed) || customBangs.some(b => b.t === trimmed);
        if (!exists) {
            setDefaultBangError(`Bang "!${trimmed}" not found`);
        } else {
            setDefaultBangError("");
            setDefaultBang(trimmed);
        }
    };

    const handleCbTagInput = (e: any) => {
        let val = e.currentTarget.value;
        if (!val.startsWith("!")) val = "!" + val;
        setCbTag(val);
    };

    const addCustomBang = (e: Event) => {
        e.preventDefault();
        const tag = cbTag.replace(/^!/, "").trim();
        if (!tag || !cbUrl) return;

        // Simple validation
        if (customBangs.some(b => b.t === tag)) {
            alert("Bang tag already exists!");
            return;
        }

        setCustomBangs([...customBangs, { t: tag, u: cbUrl, c: cbName }]);
        setCbTag("!");
        setCbUrl("");
        setCbName("");
        triggerToast();
    };

    const removeCustomBang = (tag: string) => {
        setCustomBangs(customBangs.filter(b => b.t !== tag));
        triggerToast();
    };

    const handleToggle = (e: any) => {
        setOpenInNewTab(e.currentTarget.checked);
        triggerToast();
    };

    if (!isOpen) return null;

    const defaultBangName = bangs.find(b => b[0] === localDefaultBang)?.[1] || customBangs.find(b => b.t === localDefaultBang)?.c;

    return (
        <div className="settings-overlay" onClick={onClose} style={{ display: "block" }}>
            <div className="settings-popup" onClick={e => e.stopPropagation()} style={{ display: "block" }}>
                <div className="settings-popup-header">
                    <h2>Settings</h2>
                    <button className="settings-close" onClick={onClose} aria-label="Close settings">×</button>
                </div>
                <div className="settings-popup-content">
                    <div className="settings-item">
                        <label className="settings-toggle">
                            <input
                                type="checkbox"
                                checked={openInNewTab}
                                onChange={handleToggle}
                            />
                            <span className="settings-toggle-slider"></span>
                            <span className="settings-toggle-label">Open searches in a new tab</span>
                        </label>
                    </div>

                    <div className="settings-item">
                        <div className="settings-input-row">
                            <label className="settings-label-inline" htmlFor="default-bang-input">Default Bang</label>
                            <input
                                type="text"
                                id="default-bang-input"
                                className="settings-input-inline"
                                value={"!" + localDefaultBang}
                                onInput={(e) => validateAndSetDefaultBang(e.currentTarget.value)}
                                onBlur={() => !defaultBangError && triggerToast()}
                                placeholder="!g"
                                maxLength={50}
                            />
                            {defaultBangName && <span className="bang-name-in-settings">{defaultBangName}</span>}
                        </div>
                        <div className="settings-input-hint">Enter a bang tag to use when no bang is specified</div>
                        {defaultBangError && <div className="settings-error" style={{ display: "block" }}>{defaultBangError}</div>}
                    </div>

                    <div className="settings-item">
                        <h3 className="settings-label" style={{ marginBottom: "12px", fontSize: "1rem" }}>Custom Bangs</h3>
                        <form onSubmit={addCustomBang} className="custom-bang-form">
                            <div className="settings-input-wrapper" style={{ marginBottom: "12px" }}>
                                <input
                                    type="text"
                                    placeholder="Tag (e.g. !gh)"
                                    value={cbTag}
                                    onInput={handleCbTagInput}
                                    className="settings-input"
                                    required
                                />
                            </div>
                            <div className="settings-input-wrapper" style={{ marginBottom: "12px" }}>
                                <input
                                    type="text"
                                    placeholder="Name (Optional)"
                                    value={cbName}
                                    onInput={e => setCbName(e.currentTarget.value)}
                                    className="settings-input"
                                />
                            </div>
                            <div className="settings-input-wrapper" style={{ marginBottom: "16px" }}>
                                <input
                                    type="url"
                                    placeholder="URL (use %s for query)"
                                    value={cbUrl}
                                    onInput={e => setCbUrl(e.currentTarget.value)}
                                    className="settings-input"
                                    required
                                />
                            </div>
                            <button type="submit" style={{ width: "100%", padding: "10px", background: "#eee", color: "#131313", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500 }}>Add Bang</button>
                        </form>

                        <div className="custom-bangs-list" style={{ marginTop: "16px", maxHeight: "200px", overflowY: "auto" }}>
                            {customBangs.map(bang => (
                                <div key={bang.t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#252525", marginBottom: "8px", borderRadius: "8px", border: "1px solid #2a2a2a" }}>
                                    <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                                        <strong style={{ color: "#eee" }}>!{bang.t}</strong> {bang.c && <span style={{ opacity: 0.7, marginLeft: "8px" }}>{bang.c}</span>}
                                    </div>
                                    <button onClick={() => removeCustomBang(bang.t)} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: "1.2rem", padding: "0 8px" }} aria-label="Remove">×</button>
                                </div>
                            ))}
                            {customBangs.length === 0 && <p style={{ opacity: 0.5, fontStyle: "italic", textAlign: "center", padding: "12px" }}>No custom bangs yet.</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className={`toast ${showToast ? "visible" : ""}`} style={{ display: "block" }}>
                Settings saved
            </div>
        </div>
    );
}
