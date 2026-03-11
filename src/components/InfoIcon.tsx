export function InfoIcon({ className = "" }: { className?: string }) {
    return (
        <svg
            className={`info-icon-svg ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
                className="info-icon-mark"
                d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4"
            />
            <circle className="info-icon-dot" cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
        </svg>
    );
}
