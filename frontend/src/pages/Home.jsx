import { useState } from "react";
import Sidebar from "../components/Sidebar";
import LandingHero from "../components/LandingHero";
import SyllabusVisualizer from "../components/SyllabusVisualizer";
import TodoList from "../components/TodoList";

function Home() {
  const [tab, setTab] = useState("home");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar setTab={setTab} active={tab} />
      <main style={{ flex: 1, padding: "3rem" }}>
        {tab === "home" && <LandingHero />}
        {tab === "syllabus" && <SyllabusVisualizer />}
        {tab === "todo" && <TodoList />}
      </main>
    </div>
  );
}

export default Home;
