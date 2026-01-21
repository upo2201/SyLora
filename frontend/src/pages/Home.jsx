import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import LandingHero from "../components/LandingHero";
import SyllabusVisualizer from "../components/SyllabusVisualizer";
import TodoList from "../components/TodoList";
import AIChatbot from "../components/AIChatbot";
import Profile from "../components/Profile"; // New Component

function Home() {
  const [tab, setTab] = useState("home");
  const navigate = useNavigate();

  // --- LIFTED TIMER STATE (Persists across tabs) ---
  const [timer, setTimer] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  // Timer Logic
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const toggleTimer = () => setTimerRunning(!timerRunning);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimer(25 * 60);
  };

  const timerProps = { timer, timerRunning, toggleTimer, resetTimer };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar setTab={setTab} active={tab} />
      <main style={{ flex: 1, padding: "3rem", overflowY: "auto", height: "100%", position: "relative" }}>

        {/* Pass setTab to LandingHero for Quick Actions */}
        {tab === "home" && <LandingHero setTab={setTab} timerProps={timerProps} />}

        {tab === "syllabus" && <SyllabusVisualizer />}
        {tab === "todo" && <TodoList />}
        {tab === "ai" && <AIChatbot />}
        {tab === "profile" && <Profile />}
        {tab === "calendar" && <div className="fade-in" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-primary)' }}><h2>Calendar</h2><p>Feature coming soon!</p></div>}
        {tab === "analytics" && <div className="fade-in" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-primary)' }}><h2>Study Analytics</h2><p>Feature coming soon!</p></div>}
      </main>
    </div>
  );
}

export default Home;
