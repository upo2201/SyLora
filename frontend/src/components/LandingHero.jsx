function LandingHero() {
  return (
    <section style={styles.wrapper} className="fade-in">
      <h1 style={styles.logo}>SyLora</h1>

      <p style={styles.text}>
        A calm, visual way to understand your syllabus and plan your time.
      </p>

      <div style={styles.illustrationWrapper}>
        <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet" style={styles.svg}>
          <rect width="600" height="300" rx="32" fill="#ede7df" />
          <circle cx="180" cy="170" r="48" fill="#cbb29a" />
          <rect
            x="260"
            y="110"
            width="200"
            height="120"
            rx="16"
            fill="#d8cfc4"
          />
          <line
            x1="290"
            y1="150"
            x2="430"
            y2="150"
            stroke="#8a6f5a"
            strokeWidth="6"
          />
          <line
            x1="290"
            y1="180"
            x2="400"
            y2="180"
            stroke="#8a6f5a"
            strokeWidth="6"
          />
        </svg>
      </div>
    </section>
  );
}

const styles = {
  wrapper: {
    maxWidth: "900px",
    width: "100%",
  },
  logo: {
    fontFamily: "var(--font-heading)",
    fontSize: "clamp(2.4rem, 5vw, 3.2rem)",
    marginBottom: "0.75rem",
  },
  text: {
    color: "var(--text-secondary)",
    whiteSpace: "nowrap",
    marginBottom: "1.5rem",
  },
  illustrationWrapper: {
    width: "100%",
    maxHeight: "260px",   // fits viewport
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    width: "100%",
    height: "auto",       // KEY FIX: never cut
    maxHeight: "260px",
    borderRadius: "28px",
  },
};

export default LandingHero;
