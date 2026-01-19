import { useState } from "react";

function SyllabusVisualizer() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFile = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setText("");
    }
  };

  const handleVisualize = () => {
    if (!text && !fileName) {
      alert("Please paste text or upload a PDF.");
      return;
    }
    alert("Syllabus captured. Visualization comes next.");
  };

  return (
    <section style={styles.wrapper} className="fade-in">
      <h2 style={styles.heading}>Syllabus Visualizer</h2>

      <div style={styles.card}>
        <textarea
          placeholder="Paste your syllabus text here…"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setFileName("");
          }}
          style={styles.textarea}
        />

        <div style={styles.or}>or</div>

        <label style={styles.upload}>
          Upload PDF
          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={handleFile}
          />
        </label>

        {fileName && (
          <p style={styles.file}>Selected: {fileName}</p>
        )}

        <button style={styles.button} onClick={handleVisualize}>
          Visualize
        </button>
      </div>
    </section>
  );
}

const styles = {
  wrapper: {
    maxWidth: "720px",
  },
  heading: {
    fontFamily: "var(--font-heading)",
    fontSize: "2.4rem",
    marginBottom: "1.5rem",
  },
  card: {
    backgroundColor: "var(--bg-surface)",
    padding: "2rem",
    borderRadius: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  textarea: {
    width: "100%",
    minHeight: "140px",
    resize: "vertical",
    padding: "1rem",
    borderRadius: "14px",
    border: "1px solid var(--border-light)",
    fontFamily: "var(--font-body)",
  },
  or: {
    textAlign: "center",
    color: "var(--text-secondary)",
  },
  upload: {
    display: "inline-block",
    textAlign: "center",
    padding: "0.75rem",
    borderRadius: "14px",
    border: "2px dashed var(--accent-soft)",
    cursor: "pointer",
    backgroundColor: "#fff",
    color: "var(--text-dark)",
  },
  file: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
  },
  button: {
    marginTop: "1rem",
    padding: "0.9rem",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "var(--accent-strong)",
    color: "#fff",
    cursor: "pointer",
  },
};

export default SyllabusVisualizer;
