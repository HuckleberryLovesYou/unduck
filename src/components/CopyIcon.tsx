import { JSX } from "preact";

export function CopyIcon({
    className = "",
    style,
    isCopied = false
}: {
    className?: string;
    style?: JSX.CSSProperties;
    isCopied?: boolean;
}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`animated-copy-icon ${className}`}
            style={style}
            overflow="visible"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            {isCopied ? (
                <path d="M5 12l5 5l10 -10" className="copy-check" />
            ) : (
                <>
                    <path
                        d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"
                        className="back-copy"
                    />
                    <path
                        className="front-copy"
                        d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"
                    />
                </>
            )}
        </svg>
    );
}
