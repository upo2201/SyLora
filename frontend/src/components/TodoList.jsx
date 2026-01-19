import { useState } from "react";

function TodoList() {
  const [todos, setTodos] = useState([]);

  const completed = todos.filter(t => t.done).length;
  const total = todos.length;
  const percent = total === 0 ? 0 : (completed / total) * 100;
  const angle = (percent / 100) * 360;

  const addTask = () => {
    setTodos([...todos, { text: "", done: false }]);
  };

  const update = (i, key, value) => {
    const copy = [...todos];
    copy[i] = { ...copy[i], [key]: value };
    setTodos(copy);
  };

  return (
    <section className="fade-in">
      <h2 style={styles.heading}>My To-Dos</h2>

      <button style={styles.add} onClick={addTask}>
        + Add Task
      </button>

      {todos.map((t, i) => (
        <div key={i} style={styles.row}>
          <input
            type="checkbox"
            checked={t.done}
            onChange={(e) => update(i, "done", e.target.checked)}
          />
          <input
            style={{
              ...styles.input,
              textDecoration: t.done ? "line-through" : "none",
            }}
            placeholder="Write your task…"
            value={t.text}
            onChange={(e) => update(i, "text", e.target.value)}
          />
        </div>
      ))}

      {total > 0 && (
        <>
          <div style={styles.pieWrapper}>
            <div
              style={{
                ...styles.pie,
                background: `conic-gradient(
                  var(--accent-strong) ${angle}deg,
                  var(--accent-soft) 0deg
                )`,
              }}
            />
          </div>

          <p style={styles.label}>
            {completed} of {total} tasks completed
          </p>
        </>
      )}

      {total > 0 && completed === total && (
        <p style={styles.congrats}>
          🎉 You’ve completed everything. Well done.
        </p>
      )}
    </section>
  );
}

const styles = {
  heading: {
    fontFamily: "var(--font-heading)",
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  add: {
    marginBottom: "1.5rem",
    padding: "0.5rem 1.25rem",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "var(--accent-main)",
    color: "#fff",
    cursor: "pointer",
  },
  row: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
  },
  input: {
    flex: 1,
    padding: "0.6rem",
    borderRadius: "10px",
    border: "1px solid var(--border-light)",
  },
  pieWrapper: {
    marginTop: "2rem",
    display: "flex",
    justifyContent: "center",
  },
  pie: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    transition: "all 0.6s ease",
  },
  label: {
    textAlign: "center",
    marginTop: "1rem",
    color: "var(--text-secondary)",
  },
  congrats: {
    textAlign: "center",
    marginTop: "1.5rem",
    fontWeight: 500,
  },
};

export default TodoList;
