import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.logo}>SyLora</h2>

      <nav style={styles.nav}>
        <button style={styles.link}>Syllabus Visualizer</button>
      </nav>

      <button
        style={styles.logout}
        onClick={() => navigate("/")}
      >
        Logout
      </button>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "240px",
    backgroundColor: "var(--bg-sidebar)",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRight: "1px solid var(--border-dark)",
  },

  logo: {
    fontFamily: "var(--font-heading)",
    fontSize: "1.8rem",
  },

  nav: {
    marginTop: "3rem",
  },

  link: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    fontSize: "0.95rem",
    textAlign: "left",
    cursor: "pointer",
  },

  logout: {
    background: "none",
    border: "1px solid var(--border-dark)",
    color: "var(--text-secondary)",
    padding: "0.5rem",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

export default Sidebar;
