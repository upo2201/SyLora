import { useNavigate } from "react-router-dom";
import { FaHome, FaBook, FaCheckSquare, FaSignOutAlt, FaRobot, FaUserCircle } from "react-icons/fa";

function Sidebar({ setTab, active }) {
  const navigate = useNavigate();

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
        <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>SyLora</span>
      </div>

      <nav style={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{
              ...styles.navItem,
              background: active === item.id ? "rgba(255,255,255,0.15)" : "transparent",
              borderLeft: active === item.id ? "4px solid #d4a373" : "4px solid transparent",
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div
        style={{ ...styles.profileSection, cursor: 'pointer', border: active === 'profile' ? '1px solid #d4a373' : '1px solid transparent' }}
        onClick={() => setTab("profile")}
      >
        <div style={styles.profileIcon}><FaUserCircle /></div>
        <div style={styles.profileText}>
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{getUserName()}</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>View Profile</span>
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
    padding: "2rem 1rem",
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
    position: 'sticky',
    top: 0,
    height: '100vh'
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
    paddingLeft: "1rem"
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '1rem',
    marginBottom: '1rem',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    marginTop: 'auto'
  },
  profileIcon: {
    fontSize: '2rem',
    color: '#d4a373'
  },
  profileText: {
    display: 'flex',
    flexDirection: 'column'
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    flex: 1
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    color: "var(--text-sidebar)",
    textDecoration: "none",
    fontSize: "1rem",
    borderRadius: "0 10px 10px 0",
    transition: "all 0.2s",
    cursor: "pointer",
    border: 'none',
    textAlign: 'left',
    outline: 'none'
  },
  icon: {
    fontSize: "1.2rem"
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    padding: "1rem",
    background: "rgba(255, 0, 0, 0.1)",
    color: "#ff6b6b",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    marginTop: "1rem"
  }
};

export default Sidebar;
