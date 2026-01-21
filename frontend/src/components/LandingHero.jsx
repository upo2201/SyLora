import { useEffect, useState } from "react";
import { getTodos, getSyllabus } from "../utils/api";
import { FaBook, FaCheckCircle, FaClock, FaPlus, FaQuoteLeft, FaListUl } from "react-icons/fa";

function LandingHero({ setTab, timerProps }) {
  const [stats, setStats] = useState({
    tasksPending: 0,
    subjectsTotal: 0
  });
  const [username, setUsername] = useState("Student");

  // Destructure global timer props
  const { timer, timerRunning, toggleTimer, resetTimer } = timerProps;

  // Quote State
  const [quote, setQuote] = useState({ text: "Loading motivation...", author: "" });

  useEffect(() => {
    // Dynamic Quotes
    const quotes = [
      { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
      { text: "It always seems impossible until it’s done.", author: "Nelson Mandela" },
      { text: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
      { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
      { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
      { text: "The future depends on what you do today.", author: "Mahatma Gandhi" }
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // Fetch Data
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          setUsername(user.name || "Student");
        }

        const [todos, syllabi] = await Promise.all([getTodos(), getSyllabus()]);
        const doneTasks = todos.filter(t => t.completed).length;

        let totalSubj = 0;
        syllabi.forEach(s => {
          if (s.subjects) totalSubj += s.subjects.length;
        });

        setStats({
          tasksPending: todos.length - doneTasks,
          subjectsTotal: totalSubj
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchData();
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={styles.dashboardContainer} className="fade-in">

      {/* HEADER SECTION */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.greeting}>Welcome back, {username}</h1>
          <p style={styles.subGreeting}>Ready to conquer your goals today?</p>
        </div>
      </header>

      {/* QUOTE */}
      <div style={styles.quoteCard}>
        <FaQuoteLeft style={{ fontSize: '1.5rem', color: 'var(--accent-strong)', opacity: 0.3 }} />
        <p style={styles.quoteText}>"{quote.text}"</p>
        <p style={styles.quoteAuthor}>— {quote.author}</p>
      </div>

      {/* MAIN GRID */}
      <div style={styles.grid}>

        {/* LEFT COLUMN */}
        <div style={styles.leftCol}>

          {/* QUICK STATS */}
          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <div style={styles.iconCircle}><FaCheckCircle /></div>
              <div>
                <span style={styles.statVal}>{stats.tasksPending}</span>
                <span style={styles.statLabel}>Pending Tasks</span>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.iconCircle, background: '#e0f2f1', color: '#00897b' }}><FaBook /></div>
              <div>
                <span style={styles.statVal}>{stats.subjectsTotal}</span>
                <span style={styles.statLabel}>Pending Subjects</span>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div style={styles.actionCard}>
            <h3 style={styles.cardTitle}>Quick Actions</h3>
            <div style={styles.actionButtons}>
              <button style={styles.actionBtn} onClick={() => setTab("todo")}>
                <FaPlus /> Add Task
              </button>
              <button style={styles.actionBtn} onClick={() => setTab("syllabus")}>
                <FaListUl /> View Syllabus
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: FOCUS TIMER (PROPS) */}
        <div style={styles.rightCol}>
          <div style={styles.timerCard}>
            <div style={styles.timerHeader}>
              <FaClock /> <span>Focus Session</span>
            </div>
            <div style={styles.timeDisplay}>{formatTime(timer)}</div>
            <div style={styles.timerControls}>
              <button
                style={timerRunning ? styles.stopBtn : styles.startBtn}
                onClick={toggleTimer}
              >
                {timerRunning ? "Pause" : "Start Focus"}
              </button>
              <button style={styles.resetBtn} onClick={resetTimer}>Reset</button>
            </div>
            <p style={styles.timerNote}>Stay focused for 25 minutes, then take a short break.</p>
          </div>
        </div>

      </div>

    </div>
  );
}

const styles = {
  dashboardContainer: {
    maxWidth: "1100px",
    width: "100%",
    paddingBottom: '2rem'
  },
  header: {
    marginBottom: '1.5rem',
  },
  greeting: {
    fontFamily: "var(--font-heading)",
    fontSize: "2.5rem",
    color: "var(--text-primary)", // Adaptive
    marginBottom: "0.2rem",
    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  subGreeting: {
    color: "var(--text-secondary)", // Adaptive
    fontSize: "1.1rem"
  },
  quoteCard: {
    background: '#6d4c41', // Restored Dark Brown
    color: '#fff',
    padding: '1.5rem 2rem',
    borderRadius: '16px',
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  quoteText: {
    fontSize: '1.2rem',
    fontFamily: 'var(--font-heading)',
    fontStyle: 'italic',
    marginBottom: '0.5rem',
    color: '#f5f5dc' // Fixed Light Beige for contrast on Brown
  },
  quoteAuthor: {
    opacity: 0.8,
    fontSize: '0.9rem',
    color: '#e0d8cf' // Fixed Light Grey for contrast on Brown
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column'
  },
  statsRow: {
    display: 'flex',
    gap: '1.5rem'
  },
  statCard: {
    flex: 1,
    background: 'var(--bg-surface)',
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    border: '1px solid var(--border-light)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
  },
  iconCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'var(--bg-sidebar)', // Adaptive
    color: 'var(--accent-strong)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.2rem'
  },
  statVal: {
    display: 'block',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'var(--text-primary)'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    fontWeight: '600'
  },
  actionCard: {
    background: 'var(--bg-surface)',
    borderRadius: '16px',
    padding: '1.8rem',
    border: '1px solid var(--border-light)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
  },
  cardTitle: {
    fontSize: '1.1rem',
    marginBottom: '1.2rem',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-heading)'
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  actionBtn: {
    flex: 1,
    padding: '0.8rem',
    background: 'var(--bg-page)',
    border: '1px solid var(--border-light)',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    transition: 'background 0.2s',
    minWidth: '120px'
  },
  timerCard: {
    background: 'var(--bg-surface)',
    borderRadius: '24px',
    padding: '2.5rem',
    border: '1px solid var(--border-light)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '350px'
  },
  timerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-secondary)',
    marginBottom: '2rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  timeDisplay: {
    fontSize: '5rem',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    marginBottom: '2rem'
  },
  timerControls: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  startBtn: {
    padding: '0.8rem 2rem',
    borderRadius: '50px',
    background: 'var(--accent-strong)',
    color: '#fff',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  stopBtn: {
    padding: '0.8rem 2rem',
    borderRadius: '50px',
    background: 'transparent',
    color: 'var(--accent-strong)',
    border: '1px solid var(--accent-strong)',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  resetBtn: {
    padding: '0.8rem 1.5rem',
    borderRadius: '50px',
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-light)',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  timerNote: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontWeight: '500'
  }
};

export default LandingHero;
