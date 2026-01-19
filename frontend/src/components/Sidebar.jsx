function Sidebar({ setTab, active }) {
  return (
    <aside style={styles.sidebar}>
      <div>
        <h2 style={styles.logo} onClick={() => setTab("home")}>
          SyLora
        </h2>

        <nav style={styles.nav}>
          <button
            style={{
              ...styles.navButton,
              ...(active === "home" && styles.active),
            }}
            onClick={() => setTab("home")}
          >
            Home
          </button>

          <button
            style={{
              ...styles.navButton,
              ...(active === "syllabus" && styles.active),
            }}
            onClick={() => setTab("syllabus")}
          >
            Syllabus Visualizer
          </button>

          <button
            style={{
              ...styles.navButton,
              ...(active === "todo" && styles.active),
            }}
            onClick={() => setTab("todo")}
          >
            My To-Dos
          </button>
        </nav>
      </div>

      <button
        style={styles.logout}
        onClick={() => window.location.href = "/"}
      >
        Logout
      </button>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    backgroundColor: "var(--bg-sidebar)",
    padding: "2.5rem 2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logo: {
    fontFamily: "var(--font-heading)",
    fontSize: "2rem",
    cursor: "pointer",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginTop: "2rem",
  },
  navButton: {
    backgroundColor: "var(--accent-soft)",
    border: "none",
    padding: "0.75rem 1rem",
    borderRadius: "14px",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },
  active: {
    backgroundColor: "var(--accent-strong)",
    color: "#fff",
    transform: "scale(1.02)",
  },
  logout: {
    border: "1px solid var(--border-dark)",
    background: "transparent",
    color: "var(--text-secondary)",
    padding: "0.6rem",
    borderRadius: "12px",
    cursor: "pointer",
  },
};

export default Sidebar;
