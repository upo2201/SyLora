import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import LandingHero from "../components/LandingHero";
import SyllabusVisualizer from "../components/SyllabusVisualizer";
import TodoList from "../components/TodoList";
import AIChatbot from "../components/AIChatbot";

function Home() {
  const [tab, setTab] = useState("home");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar setTab={setTab} active={tab} />
      <main style={{ flex: 1, padding: "3rem", overflowY: "auto", height: "100vh" }}>
        {tab === "home" && <LandingHero />}
        {tab === "syllabus" && <SyllabusVisualizer />}
        {tab === "todo" && <TodoList />}
        {tab === "ai" && <AIChatbot />}
      </main>
    </div>
  );
}

export default Home;
