export function SearchIcon({ className = "" }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeMiterlimit="10"
            className={`search-icon-svg ${className}`}
            overflow="visible"
        >
            <g className="magnifier-group">
                <path d="m21.393,18.565l7.021,7.021c.781.781.781,2.047,0,2.828h0c-.781.781-2.047.781-2.828,0l-7.021-7.021" />
                <circle cx="13" cy="13" r="10" strokeLinecap="square" />
            </g>
        </svg>
    );
}
