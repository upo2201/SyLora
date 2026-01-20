import { useEffect, useState } from "react";
import { getTodos, getSyllabus } from "../utils/api";

function LandingHero() {
  const [stats, setStats] = useState({
    tasksPending: 0,
    tasksDone: 0,
    subjectsTotal: 0,
    subjectsCompleted: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [todos, syllabi] = await Promise.all([getTodos(), getSyllabus()]);
        const doneTasks = todos.filter(t => t.completed).length;

        // Check full completion of subjects (simple heuristic: all chapters done)
        let completedSubs = 0;
        syllabi.forEach(s => {
          let isComplete = true;
          if (!s.subjects || s.subjects.length === 0) isComplete = false;
          s.subjects.forEach(sub => {
            if (sub.chapters.some(c => !c.completed)) isComplete = false;
          });
          if (isComplete) completedSubs++;
        });

        setStats({
          tasksPending: todos.length - doneTasks,
          tasksDone: doneTasks,
          subjectsTotal: syllabi.length,
          subjectsCompleted: completedSubs
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchData();
  }, []);

  const quote = {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  };

  return (
    <section style={styles.wrapper} className="fade-in">
      <h1 style={styles.logo}>SyLora</h1>

      <p style={styles.text}>
        A calm, visual way to understand your syllabus and plan your time.
      </p>

      {/* QUICK STATS DASHBOARD */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{stats.tasksPending}</span>
          <span style={styles.statLabel}>Pending Tasks</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{stats.tasksDone}</span>
          <span style={styles.statLabel}>Completed Tasks</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{stats.subjectsTotal}</span>
          <span style={styles.statLabel}>Subjects Enrolled</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{stats.subjectsCompleted}</span>
          <span style={styles.statLabel}>Subjects Done</span>
        </div>
      </div>

      {/* DAILY QUOTE */}
      <div style={styles.quoteBox}>
        <p style={styles.quoteText}>"{quote.text}"</p>
        <p style={styles.quoteAuthor}>— {quote.author}</p>
      </div>

      <div style={styles.illustrationWrapper}>
        <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet" style={styles.svg}>
          <rect width="600" height="300" rx="32" fill="#ede7df" />
          <circle cx="180" cy="170" r="48" fill="#cbb29a" />
          <rect
            x="260"
            y="110"
            width="200"
            height="120"
            rx="16"
            fill="#d8cfc4"
          />
          <line
            x1="290"
            y1="150"
            x2="430"
            y2="150"
            stroke="#8a6f5a"
            strokeWidth="6"
          />
          <line
            x1="290"
            y1="180"
            x2="400"
            y2="180"
            stroke="#8a6f5a"
            strokeWidth="6"
          />
        </svg>
      </div>
    </section>
  );
}

const styles = {
  wrapper: {
    maxWidth: "900px",
    width: "100%",
  },
  logo: {
    fontFamily: "var(--font-heading)",
    fontSize: "clamp(2.4rem, 5vw, 3.2rem)",
    marginBottom: "0.75rem",
  },
  text: {
    color: "var(--text-secondary)",
    whiteSpace: "nowrap",
    marginBottom: "2rem",
  },

  statsRow: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  statCard: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-light)',
    borderRadius: '16px',
    padding: '1.2rem',
    flex: 1,
    minWidth: '140px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'var(--accent-strong)',
    fontFamily: 'var(--font-heading)'
  },
  statLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '0.2rem',
    textAlign: 'center'
  },

  quoteBox: {
    textAlign: 'center',
    padding: '1.5rem',
    background: '#fcfbf9', // Slightly lighter than surface
    border: '1px solid #e0d8cf',
    borderRadius: '16px',
    marginBottom: '3rem',
    fontStyle: 'italic'
  },
  quoteText: {
    fontSize: '1.1rem',
    color: '#5a4a3a',
    marginBottom: '0.5rem',
    fontFamily: 'var(--font-heading)'
  },
  quoteAuthor: {
    fontSize: '0.9rem',
    color: '#8a6f5a'
  },

  illustrationWrapper: {
    width: "100%",
    maxHeight: "260px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    width: "100%",
    height: "auto",
    maxHeight: "260px",
    borderRadius: "28px",
  },
};

export default LandingHero;
