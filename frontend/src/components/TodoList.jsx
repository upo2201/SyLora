import { useEffect, useState } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../utils/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import confetti from "canvas-confetti";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos", error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    try {
      const newTodo = await createTodo({ text: text });
      setTodos([...todos, newTodo]);
      setText("");
    } catch (error) {
      console.error("Failed to create todo", error);
    }
  };

  const toggle = async (id, completed) => {
    const originalTodos = [...todos];
    const isCompleting = !completed;

    const updatedTodos = todos.map((t) =>
      t._id === id ? { ...t, completed: isCompleting } : t
    );
    setTodos(updatedTodos);

    if (isCompleting) {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#cbb29a', '#8c6f54', '#ffffff']
      });
    }

    try {
      await updateTodo(id, { completed: isCompleting });
    } catch (error) {
      setTodos(originalTodos);
      console.error("Failed to update todo", error);
    }
  };

  const remove = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(t => t._id !== id));
    } catch (error) {
      console.error("Failed to delete todo", error);
    }
  }

  // Chart Data
  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = todos.length - completedCount;
  const data = [
    { name: 'Completed', value: completedCount },
    { name: 'Pending', value: pendingCount },
  ];
  const COLORS = ['var(--border-dark)', 'var(--accent-strong)']; // Adaptive attempt, or use safe static colors like ['#888', '#d4a373']
  // Recharts might not parse var() in Cell fill. Let's use hex that works on both.
  // Dark mode bg is dark. Light mode bg is light.
  // #888 (Gray) works on both. #d4a373 (Gold) works on both.
  // Previous #4a4a4a is too dark for dark mode.
  const SAFE_COLORS = ['#808080', '#d4a373'];

  return (
    <div style={styles.wrapper}>
      <section style={styles.listSection}>
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

        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
        ) : (
          <div style={styles.todosContainer}>
            {todos.map((t) => (
              <div key={t._id} style={styles.row}>
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggle(t._id, t.completed)}
                  style={{ cursor: "pointer", accentColor: "var(--accent-strong)" }}
                />
                <span
                  style={{
                    textDecoration: t.completed ? "line-through" : "none",
                    color: t.completed ? "var(--text-secondary)" : "var(--text-primary)", // Adaptive
                    flex: 1,
                    fontWeight: 500
                  }}
                >
                  {t.text}
                </span>
                <button onClick={() => remove(t._id)} style={styles.deleteBtn}>x</button>
              </div>
            ))}
            {todos.length === 0 && <p style={{ color: '#666' }}>No tasks yet.</p>}
          </div>
        )}
      </section>

      {/* PIE CHART SECTION */}
      <section style={styles.chartSection}>
        <h3 style={styles.subHeading}>Progress</h3>
        {todos.length > 0 ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 200, height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SAFE_COLORS[index % SAFE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-primary)' }} // Fixed text color
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.legend}>
              <div style={styles.legendItem}>
                <div style={{ ...styles.dot, background: SAFE_COLORS[1] }}></div>
                <span style={{ color: 'var(--text-primary)' }}>Pending ({pendingCount})</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{ ...styles.dot, background: SAFE_COLORS[0] }}></div>
                <span style={{ color: 'var(--text-primary)' }}>Done ({completedCount})</span>
              </div>
            </div>
          </div>
        ) : (
          <p style={{ color: '#666', textAlign: 'center', marginTop: '2rem' }}>Add tasks to see progress.</p>
        )}
      </section>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    gap: '3rem',
    flexWrap: 'wrap',
  },
  listSection: {
    flex: 2,
    minWidth: '300px',
  },
  chartSection: {
    flex: 1,
    minWidth: '250px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-light)',
    padding: '2rem',
    borderRadius: '20px',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  heading: {
    fontFamily: "var(--font-heading)",
    fontSize: "2.4rem",
    marginBottom: "1rem",
    color: "var(--text-primary)", // Adaptive
    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  subHeading: {
    fontFamily: "var(--font-heading)",
    fontSize: "1.5rem",
    marginBottom: "1rem",
    textAlign: 'center',
    color: 'var(--accent-strong)'
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
    outline: "none",
    background: "var(--bg-surface)",
    color: "var(--text-primary)", // Adaptive
    fontSize: '1rem'
  },
  button: {
    padding: "0.8rem 1.5rem",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "var(--accent-strong)",
    color: "#fff",
    cursor: "pointer",
  },
  todosContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: '0.8rem',
    background: 'var(--bg-surface)',
    borderRadius: '12px',
    border: '1px solid var(--border-light)'
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#666",
    cursor: "pointer",
    fontSize: "0.9rem",
    padding: "0 0.5rem"
  },
  legend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '1rem',
    width: '100%',
    alignItems: 'center'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)'
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  }
};

export default TodoList;
