import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../utils/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/home");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.card}>
        <h2 style={styles.heading}>Welcome Back</h2>

        {error && <div style={{ color: 'red', marginBottom: '1rem', background: 'rgba(255,0,0,0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.group}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                style={styles.inputPassword}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>

        <p style={styles.footerLink}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--bg-page)",
  },
  card: {
    background: "var(--bg-surface)",
    padding: "2.5rem",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    color: "var(--text-primary)"
  },
  heading: {
    textAlign: "center",
    marginBottom: "2rem",
    fontFamily: "var(--font-heading)",
    fontSize: "2rem",
    color: "var(--text-primary)"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem"
  },
  group: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
  label: {
    fontSize: "0.9rem",
    color: "var(--text-secondary)", // Adaptive for dark mode
    fontWeight: "500"
  },
  input: {
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
    width: '100%',
    color: 'var(--text-primary)',
    background: 'var(--bg-page)'
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputPassword: {
    padding: "0.8rem",
    paddingRight: "2.5rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
    width: '100%',
    color: 'var(--text-primary)',
    background: 'var(--bg-page)'
  },
  eyeBtn: {
    position: 'absolute',
    right: '0.8rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
    display: 'flex',
    alignItems: 'center'
  },
  button: {
    padding: "0.9rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "var(--accent-strong)",
    color: "white",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "1rem"
  },
  footerLink: {
    marginTop: "1.5rem",
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#666"
  },
  link: {
    color: "var(--accent-strong)",
    textDecoration: "none",
    fontWeight: "600"
  }
}

export default Login;
