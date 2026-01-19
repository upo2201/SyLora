import { useEffect, useState } from "react";
import {
  getSession,
  saveSyllabus,
  getUserSyllabi,
  updateSyllabi,
} from "../utils/auth";

function normalizeSubject(str) {
  return str.trim().toLowerCase();
}

function SyllabusVisualizer() {
  const user = getSession();

  const [subject, setSubject] = useState("");
  const [textInput, setTextInput] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [syllabi, setSyllabi] = useState([]);

  useEffect(() => {
    if (user?.email) {
      setSyllabi(getUserSyllabi(user.email));
    }
  }, [user]);

  const persistSyllabi = (updated) => {
    setSyllabi(updated);
    updateSyllabi(user.email, updated);
  };

  const saveTextSyllabus = () => {
    if (!subject.trim() || !textInput.trim()) {
      alert("Enter subject and syllabus text");
      return;
    }

    const newTopics = textInput
      .split("\n")
      .filter(Boolean)
      .map((t) => ({
        id: Date.now() + Math.random(),
        title: t.trim(),
        completed: false,
      }));

    mergeIntoSubject({
      content: textInput,
      topics: newTopics,
    });

    setTextInput("");
  };

  const savePdfSyllabus = () => {
    if (!subject.trim() || !pdfFile) {
      alert("Enter subject and upload a PDF");
      return;
    }

    mergeIntoSubject({
      content: `PDF uploaded: ${pdfFile.name}`,
      topics: [
        {
          id: Date.now(),
          title: `AI will extract chapters from ${pdfFile.name}`,
          completed: false,
        },
      ],
    });

    setPdfFile(null);
  };

  const mergeIntoSubject = ({ content, topics }) => {
    const normalized = normalizeSubject(subject);

    const existingIndex = syllabi.findIndex(
      (s) => normalizeSubject(s.subject) === normalized
    );

    let updated;

    if (existingIndex !== -1) {
      const existing = syllabi[existingIndex];
      updated = [...syllabi];
      updated[existingIndex] = {
        ...existing,
        content: existing.content + "\n\n" + content,
        topics: [...existing.topics, ...topics],
      };
    } else {
      const syllabus = {
        id: Date.now(),
        subject: subject.trim(),
        content,
        topics,
      };
      saveSyllabus(user.email, syllabus);
      updated = [...syllabi, syllabus];
    }

    persistSyllabi(updated);
    setSubject("");
  };

  const deleteSyllabus = (id) => {
    persistSyllabi(syllabi.filter((s) => s.id !== id));
  };

  return (
    <section style={styles.container}>
      {/* ✅ CHANGE 2: lighter heading color */}
      <h2 style={styles.heading}>Syllabus Visualizer</h2>

      {/* INPUT */}
      <div style={styles.inputCard}>
        <input
          style={styles.input}
          placeholder="Subject name"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          style={styles.textarea}
          placeholder="Paste syllabus (one topic per line)"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />

        <button style={styles.primaryBtn} onClick={saveTextSyllabus}>
          Add Text
        </button>

        <div style={styles.divider}>OR</div>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
        />

        {pdfFile && <p style={styles.fileLabel}>{pdfFile.name}</p>}

        <button style={styles.primaryBtn} onClick={savePdfSyllabus}>
          Add PDF
        </button>
      </div>

      {/* SAVED SYLLABI */}
      {syllabi.map((syl) => (
        <details key={syl.id} style={styles.syllabusCard}>
          <summary style={styles.summary}>
            <div>
              {/* ✅ CHANGE 1: subject + content preview */}
              <strong style={styles.subjectTitle}>{syl.subject}</strong>
              <div style={styles.entryPreview}>
                {syl.content}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                deleteSyllabus(syl.id);
              }}
              style={styles.deleteBtn}
            >
              Delete
            </button>
          </summary>

          <div style={styles.contentBox}>
            <pre style={styles.rawContent}>{syl.content}</pre>
          </div>
        </details>
      ))}
    </section>
  );
}

const styles = {
  container: { maxWidth: "1000px" },

  /* ✅ lighter & visible */
  heading: {
    fontFamily: "var(--font-heading)",
    fontSize: "2.6rem",
    marginBottom: "2rem",
    color: "#8c6f54",
  },

  inputCard: {
    background: "var(--bg-surface)",
    padding: "1.8rem",
    borderRadius: "22px",
    marginBottom: "3rem",
  },

  input: {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "12px",
    border: "1px solid var(--border-light)",
    marginBottom: "1rem",
  },

  textarea: {
    width: "100%",
    minHeight: "140px",
    padding: "1rem",
    borderRadius: "14px",
    border: "1px solid var(--border-light)",
    marginBottom: "1rem",
  },

  primaryBtn: {
    padding: "0.8rem 1.8rem",
    borderRadius: "999px",
    border: "none",
    background: "var(--accent-strong)",
    color: "#fff",
    cursor: "pointer",
    marginBottom: "1rem",
  },

  divider: {
    textAlign: "center",
    color: "var(--text-secondary)",
    margin: "1rem 0",
  },

  fileLabel: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    marginBottom: "0.5rem",
  },

  syllabusCard: {
    border: "1px solid var(--border-light)",
    borderRadius: "18px",
    padding: "1rem",
    marginBottom: "1rem",
    background: "var(--bg-surface)",
  },

  summary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    cursor: "pointer",
  },

  subjectTitle: {
    color: "#1e1e1e",
    fontSize: "1.1rem",
    fontWeight: 600,
  },

  /* preview under subject */
  entryPreview: {
    marginTop: "0.3rem",
    fontSize: "0.85rem",
    color: "#3f352d",
    maxWidth: "700px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "#a33",
    cursor: "pointer",
  },

  contentBox: {
    marginTop: "1rem",
  },

  rawContent: {
    background: "#f6f1ec",
    padding: "1rem",
    borderRadius: "12px",
    whiteSpace: "pre-wrap",
    color: "#1e1e1e",
  },
};

export default SyllabusVisualizer;
