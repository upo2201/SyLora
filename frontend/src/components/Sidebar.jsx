import { useNavigate } from "react-router-dom";
import { FaHome, FaBook, FaCheckSquare, FaSignOutAlt, FaRobot, FaUserCircle, FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

function Sidebar({ setTab, active }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const getUserName = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return "Student";
      const user = JSON.parse(userStr);
      return user.name || "Student";
    } catch (e) {
      return "Student";
    }
  };

  const navItems = [
    { id: "home", icon: <FaHome />, label: "Dashboard" },
    { id: "syllabus", icon: <FaBook />, label: "My Syllabus" },
    { id: "todo", icon: <FaCheckSquare />, label: "To-Do List" },
    { id: "ai", icon: <FaRobot />, label: "AI Tutor" }
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <img src="/logo.svg" alt="SyLora" style={{ width: "40px", height: "40px" }} />
        <span style={{ color: 'var(--text-sidebar)', fontSize: '1.5rem', fontWeight: 'bold' }}>SyLora</span>
      </div>

      <nav style={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{
              ...styles.navItem,
              background: active === item.id ? "#d4a373" : "transparent",
              color: active === item.id ? "#fff" : "var(--text-sidebar)",
              fontWeight: active === item.id ? "bold" : "normal",
              paddingLeft: active === item.id ? "1.2rem" : "1rem", // Subtle shift
              boxShadow: active === item.id ? "0 4px 12px rgba(212, 163, 115, 0.3)" : "none",
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
        {/* Spacer to push profile section down and keep distance from menu */}
        <div style={{ flex: 1, minHeight: '2rem' }}></div>
      </nav>

      {/* Theme Toggle Button */}
      <button onClick={toggleTheme} style={styles.themeToggle}>
        {theme === 'light' ? <FaMoon /> : <FaSun />}
        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
      </button>

      <div
        style={{
          ...styles.profileSection,
          cursor: 'pointer',
          border: active === 'profile' ? '1px solid #d4a373' : '1px solid transparent',
          background: active === 'profile' ? 'rgba(212, 163, 115, 0.1)' : 'rgba(0,0,0,0.05)'
        }}
        onClick={() => setTab("profile")}
      >
        <div style={styles.profileIcon}><FaUserCircle /></div>
        <div style={styles.profileText}>
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: "var(--text-sidebar)" }}>{getUserName()}</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.7, color: "var(--text-sidebar)" }}>View Profile</span>
        </div>
      </div>

      <button onClick={handleLogout} style={styles.logoutBtn}>
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    background: "var(--bg-sidebar)",
    color: "var(--text-sidebar)",
    display: "flex",
    flexDirection: "column",
    padding: "1.5rem 0.8rem", // Reduced padding
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'hidden' // Prevent scrolling
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    marginBottom: "1.5rem", // Reduced margin
    paddingLeft: "0.5rem"
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.8rem',
    marginBottom: '0.5rem',
    marginTop: 'auto', // Push to bottom if space permits
    borderRadius: '12px',
    transition: 'all 0.2s',
    border: '1px solid transparent'
  },
  profileIcon: {
    fontSize: '2rem',
    color: 'var(--accent-strong)'
  },
  profileText: {
    display: 'flex',
    flexDirection: 'column'
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem", // Reduced gap
    flex: 1,
    marginBottom: '0.5rem'
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    padding: "0.8rem", // Reduced padding
    color: "var(--text-sidebar)",
    textDecoration: "none",
    fontSize: "1rem",
    borderRadius: "12px",
    transition: "all 0.2s",
    cursor: "pointer",
    border: 'none',
    textAlign: 'left',
    outline: 'none',
    width: '100%'
  },
  icon: {
    fontSize: "1.2rem"
  },
  themeToggle: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    padding: "1rem",
    background: "transparent",
    color: "var(--text-sidebar)",
    border: "1px solid var(--border-light)",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    marginBottom: "0.3rem", // Reduced margin
    width: '100%',
    justifyContent: 'flex-start'
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    padding: "0.8rem", // Reduced padding
    background: "rgba(255, 0, 0, 0.1)",
    color: "#ff6b6b",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    marginTop: "0.5rem"
  }
};

export default Sidebar;
