import { getSession, clearSession } from "../utils/auth";

function Sidebar({ setTab, active }) {
  const user = getSession();
  const initial = user?.email?.[0]?.toUpperCase();

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

      {/* Profile + Logout row */}
      <div style={styles.profileRow}>
        {initial && <div style={styles.avatar}>{initial}</div>}

        <button
          style={styles.logout}
          onClick={() => {
            clearSession();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    backgroundColor: "var(--bg-sidebar)",
    padding: "2rem",
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
    marginTop: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
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

  profileRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },

  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "var(--accent-main)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: "0.9rem",
    flexShrink: 0,
  },

  logout: {
    flex: 1,
    padding: "0.6rem",
    borderRadius: "12px",
    border: "1px solid var(--border-dark)",
    background: "transparent",
    color: "var(--text-secondary)",
    cursor: "pointer",
  },
};

export default Sidebar;
