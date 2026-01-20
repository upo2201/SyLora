import { useState, useEffect } from "react";
import { FaUserCircle, FaEnvelope, FaIdBadge } from "react-icons/fa";

function Profile() {
  const [user, setUser] = useState({ name: "Student", email: "student@example.com" });

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (e) {
      console.error("Failed to load profile", e);
    }
  }, []);

  return (
    <div style={styles.container} className="fade-in">
      <h2 style={styles.heading}>Student Profile</h2>

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.avatar}>
            <FaUserCircle />
          </div>
          <div>
            <h3 style={styles.name}>{user.name || "Student"}</h3>
            <span style={styles.role}>Active Learner</span>
          </div>
        </div>

        <div style={styles.infoSection}>
          <div style={styles.infoRow}>
            <FaIdBadge style={styles.icon} />
            <div>
              <label style={styles.label}>Full Name</label>
              <p style={styles.value}>{user.name || "N/A"}</p>
            </div>
          </div>

          <div style={styles.infoRow}>
            <FaEnvelope style={styles.icon} />
            <div>
              <label style={styles.label}>Email Address</label>
              <p style={styles.value}>{user.email || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  heading: {
    fontFamily: "var(--font-heading)",
    fontSize: "2.5rem",
    color: "#f5f5dc", // Light Beige
    marginBottom: "2rem",
    textAlign: "center"
  },
  card: {
    background: "var(--bg-surface)",
    borderRadius: "20px",
    padding: "3rem",
    border: "1px solid var(--border-light)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    marginBottom: "3rem",
    borderBottom: "1px solid #eee",
    paddingBottom: "2rem"
  },
  avatar: {
    fontSize: "5rem",
    color: "#d4a373",
    display: 'flex'
  },
  name: {
    fontSize: "2rem",
    margin: 0,
    color: "#333",
    fontFamily: "var(--font-heading)"
  },
  role: {
    color: "#888",
    fontSize: "1rem"
  },
  infoSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem"
  },
  infoRow: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
    padding: "1rem",
    background: "#f9f9f9",
    borderRadius: "12px"
  },
  icon: {
    fontSize: "1.5rem",
    color: "var(--accent-strong)"
  },
  label: {
    display: "block",
    fontSize: "0.85rem",
    color: "#666",
    marginBottom: "0.2rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  value: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#333",
    margin: 0
  }
};

export default Profile;
