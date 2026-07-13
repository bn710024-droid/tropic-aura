export default function TopBar() {
  const handleMenuClick = () => {
    // Dispatch un événement personnalisé que LiquidMenu écoute
    window.dispatchEvent(new CustomEvent("topbar-menu-click"));
  };

  return (
    <header className="ghost" style={{ zIndex: 200, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <a href="/" className="ghost__logo">Tropicaura</a>
      <button
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
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          transition: "background-color .25s, border-color .25s",
          marginRight: "clamp(20px,5vw,48px)",
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
        {/* Grille 2×2 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 3,
          pointerEvents: "none",
        }}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ width: 5, height: 5, borderRadius: 1, backgroundColor: "#fff", display: "block" }} />
          ))}
        </div>
      </button>
    </header>
  );
}
