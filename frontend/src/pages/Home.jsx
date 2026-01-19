import Sidebar from "../components/Sidebar";
import UploadHero from "../components/UploadHero";

function Home() {
  return (
    <div style={styles.layout}>
      <Sidebar />
      <main style={styles.main} className="slide-up">
        <UploadHero />
      </main>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
  },

  main: {
    flex: 1,
    padding: "3rem",
  },
};

export default Home;
