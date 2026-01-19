function LandingHero() {
  return (
    <section className="fade-in">
      <h1 style={styles.logo}>SyLora</h1>
      <p style={styles.text}>
        A calm, visual way to understand your syllabus and plan your time.
      </p>
      <img
        src="https://images.unsplash.com/photo-1529070538774-1843cb3265df"
        alt="study aesthetic"
        style={styles.image}
      />
    </section>
  );
}

const styles = {
  logo: {
    fontFamily: "var(--font-heading)",
    fontSize: "3.5rem",
    marginBottom: "1rem",
  },
  text: {
    color: "var(--text-secondary)",
    maxWidth: "420px",
    marginBottom: "2.5rem",
  },
  image: {
    width: "100%",
    maxWidth: "720px",
    borderRadius: "28px",
  },
};

export default LandingHero;
