import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <section style={styles.page} className="fade-in">
      <div style={styles.card}>
        <h1 style={styles.logo}>SyLora</h1>
        <p style={styles.tagline}>
          Visual clarity for your syllabus.
        </p>

        <button
          style={styles.button}
          onClick={() => navigate("/home")}
        >
          Enter
        </button>
      </div>
    </section>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "var(--bg-surface)",
    padding: "3rem",
    borderRadius: "26px",
    textAlign: "center",
    boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
  },

  logo: {
    fontFamily: "var(--font-heading)",
    fontSize: "3rem",
    color: "var(--text-dark)",
    marginBottom: "0.5rem",
  },

  tagline: {
    color: "#6f6a64",
    marginBottom: "2rem",
  },

  button: {
    padding: "0.9rem 2.5rem",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "var(--accent-main)",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Login;
