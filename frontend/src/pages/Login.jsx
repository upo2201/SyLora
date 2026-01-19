import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticate, setSession } from "../utils/auth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleLogin = () => {
    const user = authenticate(email, password);
    if (!user) {
      alert("Invalid email or password");
      return;
    }
    setSession(user);
    navigate("/home");
  };

  return (
    <section style={styles.page} className="fade-in">
      <div style={styles.card}>
        {/* FIX 1: Dark logo restored */}
        <h1 style={styles.logo}>SyLora</h1>

        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <div style={styles.passwordWrapper}>
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
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

        {/* FIX 2: Signup option restored */}
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
    color: "var(--text-dark)", // explicitly dark
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
