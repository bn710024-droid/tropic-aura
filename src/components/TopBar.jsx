export default function TopBar() {
  const handleMenuClick = () => {
    // Dispatch un événement personnalisé que LiquidMenu écoute
    window.dispatchEvent(new CustomEvent("topbar-menu-click"));
  };

  return (
    <header className="ghost" style={{ zIndex: 650, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <a href="/" className="ghost__logo">Tropicaura</a>
      <button
        id="topbar-menu-btn"
        onClick={handleMenuClick}
        aria-label="Menu"
        style={{
          width: 40, height: 40,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.08)",
          border: "1.5px solid rgba(255,255,255,0.2)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center", justifyContent: "center",
          padding: 0,
          position: "relative",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          transition: "background-color .25s, border-color .25s",
          marginRight: "clamp(10px,2.5vw,24px)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        }}
      >
        {/* Grille 2×2 — état fermé */}
        <div id="topbar-menu-grid" style={{
          position: "absolute",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 3,
          pointerEvents: "none",
          transition: "opacity .25s ease, transform .25s ease",
        }}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ width: 5, height: 5, borderRadius: 1, backgroundColor: "#fff", display: "block" }} />
          ))}
        </div>

        {/* Croix × — état ouvert */}
        <div id="topbar-menu-cross" style={{
          position: "absolute",
          width: 16, height: 16,
          opacity: 0,
          transform: "scale(.6)",
          pointerEvents: "none",
          transition: "opacity .25s ease, transform .25s ease",
        }}>
          <span style={{
            position: "absolute", top: "50%", left: "50%",
            width: 16, height: 1.5, backgroundColor: "#fff",
            transform: "translate(-50%,-50%) rotate(45deg)",
          }} />
          <span style={{
            position: "absolute", top: "50%", left: "50%",
            width: 16, height: 1.5, backgroundColor: "#fff",
            transform: "translate(-50%,-50%) rotate(-45deg)",
          }} />
        </div>
      </button>
    </header>
  );
}
