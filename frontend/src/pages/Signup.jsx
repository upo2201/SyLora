import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUser } from "../utils/auth";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleSignup = () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }
    saveUser(email, password);
    navigate("/");
  };

  return (
    <section style={styles.page} className="fade-in">
      <div style={styles.card}>
        {/* FIX 1: Dark logo */}
        <h1 style={styles.logo}>SyLora</h1>
        <p style={styles.text}>Create your account</p>

        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        {/* FIX 2 & 3: Eye button aligned with password */}
        <div style={styles.passwordWrapper}>
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            style={styles.passwordInput}
          />
          <button
            style={styles.eye}
            onClick={() => setShow(!show)}
            aria-label="Toggle password visibility"
          >
            {show ? "🙈" : "👁️"}
          </button>
        </div>

        <button style={styles.button} onClick={handleSignup}>
          Sign up
        </button>

        <p style={styles.link} onClick={() => navigate("/")}>
          Already have an account? Log in
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
    marginBottom: "0.5rem",
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
    transform: "translateY(-50%)", // perfectly centered
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

export default Signup;
