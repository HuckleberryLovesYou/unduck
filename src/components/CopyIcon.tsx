import { JSX } from "preact";

export function CopyIcon({
    className = "",
    style
}: {
    className?: string;
    style?: JSX.CSSProperties;
}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`copy-icon-svg ${className}`}
            style={style}
            overflow="visible"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <rect x="8" y="8" width="12" height="12" rx="2" className="copy-rect-back" />
            <path
                d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"
                className="copy-path-front"
            />
        </svg>
    );
}
