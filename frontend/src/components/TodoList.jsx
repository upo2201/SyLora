import { useEffect, useState } from "react";
import { getSession, getUserTodos, updateTodos } from "../utils/auth";

function TodoList() {
  const user = getSession();
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (user?.email) {
      setTodos(getUserTodos(user.email));
    }
  }, [user]);

  const addTask = () => {
    if (!text.trim()) return;
    const updated = [...todos, { id: Date.now(), text, done: false }];
    setTodos(updated);
    updateTodos(user.email, updated);
    setText("");
  };

  const toggle = (id) => {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    setTodos(updated);
    updateTodos(user.email, updated);
  };

  return (
    <section>
      <h2 style={styles.heading}>My To-Dos</h2>

      <div style={styles.addBox}>
        <input
          style={styles.input}
          placeholder="Add a task"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button style={styles.button} onClick={addTask}>
          Add
        </button>
      </div>

      {todos.map((t) => (
        <div key={t.id} style={styles.row}>
          <input
            type="checkbox"
            checked={t.done}
            onChange={() => toggle(t.id)}
          />
          <span
            style={{
              textDecoration: t.done ? "line-through" : "none",
            }}
          >
            {t.text}
          </span>
        </div>
      ))}
    </section>
  );
}

const styles = {
  heading: {
    fontFamily: "var(--font-heading)",
    fontSize: "2.4rem",
    marginBottom: "1rem",
  },
  addBox: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  input: {
    flex: 1,
    padding: "0.8rem",
    borderRadius: "12px",
    border: "1px solid var(--border-light)",
  },
  button: {
    padding: "0.8rem 1.5rem",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "var(--accent-strong)",
    color: "#fff",
    cursor: "pointer",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "0.75rem",
  },
};

export default TodoList;
