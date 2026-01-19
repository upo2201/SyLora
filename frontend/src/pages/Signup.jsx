import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    localStorage.setItem(
      "syloraUser",
      JSON.stringify({ email, password })
    );
    navigate("/");
  };

  return (
    <section style={styles.page} className="fade-in">
      <div style={styles.card}>
        <h1 style={styles.logo}>SyLora</h1>
        <p style={styles.text}>Create your account</p>

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleSignup}>
          Sign up
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
    borderRadius: "28px",
    width: "360px",
    textAlign: "center",
  },
  logo: {
    fontFamily: "var(--font-heading)",
    fontSize: "2.8rem",
    color: "var(--text-dark)",
  },
  text: {
    color: "#6f6a64",
    marginBottom: "2rem",
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "12px",
    border: "1px solid var(--border-light)",
    marginBottom: "1rem",
  },
  button: {
    width: "100%",
    padding: "0.9rem",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "var(--accent-main)",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Signup;
