import { JSX } from "preact";

export function ExternalLinkIcon({
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
            className={`external-link-icon-svg sidebar-icon-svg ${className}`}
            style={style}
            overflow="visible"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
                d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"
                className="external-box dash"
            />
            <g className="external-arrow arrow">
                <path d="M11 13l9 -9" />
                <path d="M15 4h5v5" />
            </g>
        </svg>
    );
}
