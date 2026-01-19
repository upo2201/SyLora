import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleLogin = () => {
    const saved = JSON.parse(localStorage.getItem("syloraUser"));
    if (saved && saved.email === email && saved.password === password) {
      navigate("/home");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <section style={styles.page} className="fade-in">
      <div style={styles.card}>
        <h1 style={styles.logo}>SyLora</h1>
        <p style={styles.text}>Log in to continue</p>

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div style={styles.passwordWrapper}>
          <input
            style={styles.passwordInput}
            type={show ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            style={styles.eye}
            onClick={() => setShow(!show)}
            aria-label="Toggle password visibility"
          >
            {show ? "🙈" : "👁️"}
          </button>
        </div>

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>

        <p style={styles.link} onClick={() => navigate("/signup")}>
          Don’t have an account? Sign up
        </p>
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
  passwordWrapper: {
    position: "relative",
    marginBottom: "1rem",
  },
  passwordInput: {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "12px",
    border: "1px solid var(--border-light)",
  },
  eye: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "none",
    cursor: "pointer",
  },
  button: {
    width: "100%",
    padding: "0.9rem",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "var(--accent-strong)",
    color: "#fff",
    cursor: "pointer",
  },
  link: {
    marginTop: "1rem",
    fontSize: "0.85rem",
    cursor: "pointer",
    color: "#7a6f65",
  },
};

export default Login;
