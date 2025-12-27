export function OnboardingArrow() {
    return (
        <div
            style={{
                position: "absolute",
                bottom: "50px",
                left: "-20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pointerEvents: "none",
                zIndex: 50,
                width: "120px"
            }}
        >
            <span
                style={{
                    fontFamily: "sans-serif",
                    fontSize: "14px",
                    color: "#fff",
                    textAlign: "center",
                    marginBottom: "0px",
                    fontWeight: 600,
                    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                    whiteSpace: "nowrap",
                    marginLeft: "30px"
                }}
            >
                Default !Bangs &<br />
                Custom !Bangs
            </span>
            <img
                src="/arrow.svg"
                alt=""
                style={{
                    width: "40px",
                    height: "80px",
                    transform: "rotate(25deg)",
                    marginTop: "-5px",
                    marginLeft: "-10px"
                }}
            />
        </div>
    );
}
