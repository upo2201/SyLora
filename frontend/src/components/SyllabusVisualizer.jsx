function SyllabusVisualizer() {
  return (
    <section className="fade-in">
      <h2 style={styles.heading}>Syllabus Visualizer</h2>

      <div style={styles.card}>
        <div style={styles.uploadBox}>
          Upload your syllabus
        </div>

        <button style={styles.button}>
          Visualize
        </button>
      </div>
    </section>
  );
}

const styles = {
  heading: {
    fontFamily: "var(--font-heading)",
    fontSize: "2.5rem",
    marginBottom: "2rem",
  },
  card: {
    backgroundColor: "var(--bg-surface)",
    padding: "2.5rem",
    borderRadius: "26px",
  },
  uploadBox: {
    border: "2px dashed var(--accent-main)",
    padding: "3rem",
    borderRadius: "18px",
    marginBottom: "2rem",
    backgroundColor: "#fff",
    color: "var(--text-dark)",
  },
  button: {
    padding: "0.9rem 2.5rem",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "var(--accent-strong)",
    color: "#fff",
    cursor: "pointer",
  },
};

export default SyllabusVisualizer;
