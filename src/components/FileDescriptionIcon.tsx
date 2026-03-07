import { JSX } from "preact";

export function FileDescriptionIcon({
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
            className={`file-description-icon-svg ${className}`}
            style={style}
            overflow="visible"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M14 3v4a1 1 0 0 0 1 1h4" className="file-fold" />
            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
            <path d="M9 17h6" className="file-lines" />
            <path d="M9 13h6" className="file-lines" />
        </svg>
    );
}
