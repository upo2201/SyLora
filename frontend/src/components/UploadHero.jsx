function UploadHero() {
  return (
    <section style={styles.section}>
      <h1 style={styles.title}>
        See your syllabus <br /> clearly.
      </h1>

      <p style={styles.subtitle}>
        SyLora turns dense syllabi into visual, manageable structures.
      </p>

      <div style={styles.card}>
        <div style={styles.uploadBox}>
          Drop your syllabus here
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    maxWidth: "720px",
  },

  title: {
    fontFamily: "var(--font-heading)",
    fontSize: "3rem",
    marginBottom: "1rem",
  },

  subtitle: {
    color: "var(--text-secondary)",
    marginBottom: "2.5rem",
  },

  card: {
    backgroundColor: "var(--bg-surface)",
    padding: "2.5rem",
    borderRadius: "24px",
  },

  uploadBox: {
    border: "2px dashed var(--accent-soft)",
    padding: "3rem",
    borderRadius: "16px",
    color: "var(--text-dark)",
    textAlign: "center",
    backgroundColor: "#fff",
  },
};

export default UploadHero;
