import { useEffect, useState, useRef } from "react";
import { getSyllabus, createSyllabus, deleteSyllabus, updateChapterStatus, parsePDF, addChapter, renameChapter, deleteChapter } from "../utils/api";
import { FaTrash, FaChevronDown, FaChevronUp, FaPlus, FaEdit, FaCheck, FaTimes, FaFileUpload, FaStickyNote } from "react-icons/fa";
import confetti from "canvas-confetti";

function SyllabusVisualizer() {
  const [subject, setSubject] = useState("");
  const [inputType, setInputType] = useState("manual");
  const [textInput, setTextInput] = useState("");

  const [syllabi, setSyllabi] = useState([]);
  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [openSyllabi, setOpenSyllabi] = useState({});

  const [editingChapter, setEditingChapter] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchSyllabi();
  }, []);

  const fetchSyllabi = async () => {
    try {
      const data = await getSyllabus();
      setSyllabi(data);
    } catch (error) {
      console.error("Failed to fetch syllabus", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!subject.trim()) {
      alert("Please enter a Subject/Course Name first.");
      return;
    }

    if (inputType === 'manual') {
      if (!textInput.trim()) {
        alert("Please paste your syllabus topics.");
        return;
      }
      try {
        const newSyllabus = await createSyllabus({
          title: subject,
          subjects: [{
            name: subject,
            chapters: textInput.split("\n").filter(t => t.trim()).map(t => ({ name: t.trim() }))
          }]
        });
        setSyllabi([...syllabi, newSyllabus]);
        setSubject("");
        setTextInput("");
      } catch (error) {
        console.error("Failed to create syllabus", error);
        alert("Error creating syllabus. Try again.");
      }
    } else {
      const file = fileInputRef.current?.files[0];
      if (!file) {
        alert("Please select a PDF file.");
        return;
      }

      setUploading(true);
      try {
        const parsedData = await parsePDF(file);
        const finalTitle = subject.trim() || parsedData.title || file.name.replace(".pdf", "");

        const newSyllabus = await createSyllabus({
          title: finalTitle,
          subjects: parsedData.subjects || []
        });

        setSyllabi([...syllabi, newSyllabus]);
        setSubject("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setInputType("manual");
      } catch (error) {
        console.error("PDF Parse failed", error);
        alert("Failed to process PDF. Ensure the backend is running.");
      } finally {
        setUploading(false);
      }
    }
  };

  const toggleDetails = (id) => {
    setOpenSyllabi(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this entire course?")) return;

    try {
      await deleteSyllabus(id);
      setSyllabi(syllabi.filter(s => s._id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  // ...

  const handleDeleteChapter = async (sId, subId, cId) => {
    if (!window.confirm("Delete this chapter?")) return;
    try {
      const updatedSyllabus = await deleteChapter(sId, subId, cId);
      setSyllabi(syllabi.map(s => s._id === sId ? updatedSyllabus : s));
    } catch (error) {
      console.error("Failed to delete chapter", error);
    }
  };

  const getProgress = (syl) => {
    let total = 0;
    let completed = 0;
    syl.subjects.forEach(sub => {
      sub.chapters.forEach(c => {
        total++;
        if (c.completed) completed++;
      });
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  return (
    <section style={styles.container}>
      <h2 style={styles.heading}>Syllabus Visualizer</h2>

      {/* NEW INPUT CARD DESIGN */}
      <div style={styles.inputCard}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Course / Subject Name</label>
          <input
            style={styles.input}
            placeholder="e.g. Advanced Biology"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tab,
              borderBottom: inputType === 'manual' ? '2px solid var(--accent-strong)' : '2px solid transparent',
              fontWeight: inputType === 'manual' ? 'bold' : 'normal',
              color: inputType === 'manual' ? 'var(--text-primary)' : 'var(--text-secondary)'
            }}
            onClick={() => setInputType('manual')}
          >
            <FaStickyNote /> Manual Entry
          </button>
          <button
            style={{
              ...styles.tab,
              borderBottom: inputType === 'pdf' ? '2px solid var(--accent-strong)' : '2px solid transparent',
              fontWeight: inputType === 'pdf' ? 'bold' : 'normal',
              color: inputType === 'pdf' ? 'var(--text-primary)' : 'var(--text-secondary)'
            }}
            onClick={() => setInputType('pdf')}
          >
            <FaFileUpload /> Upload PDF
          </button>
        </div>

        <div style={styles.entryArea}>
          {inputType === 'manual' ? (
            <textarea
              style={styles.textarea}
              placeholder="Paste syllabus topics (one per line)..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
          ) : (
            <div style={styles.fileUploadBox}>
              <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                style={{ marginTop: '1rem' }}
              />
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                Our AI will scan your PDF and organize it automatically.
              </p>
            </div>
          )}
        </div>

        <button style={styles.primaryBtn} onClick={handleCreate} disabled={uploading}>
          {uploading ? "Processing..." : "Add to Syllabus"}
        </button>
      </div>

      {/* SAVED SYLLABI LIST */}
      {loading ? (
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      ) : (
        <div style={styles.grid}>
          {syllabi.map((syl) => {
            const progress = getProgress(syl);
            const isOpen = openSyllabi[syl._id];

            return (
              <div key={syl._id} style={styles.syllabusCard}>
                <div style={styles.headerRow} onClick={() => toggleDetails(syl._id)}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={styles.subjectTitle}>{syl.title}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={styles.percentBadge}>{progress}% Complete</span>
                        {isOpen ? <FaChevronUp style={{ color: 'var(--accent-strong)' }} /> : <FaChevronDown style={{ color: '#888' }} />}
                      </div>
                    </div>
                    <div style={styles.progressBarBg}>
                      <div style={{ ...styles.progressBarFill, width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div style={styles.contentBox} className="fade-in">
                    <div style={styles.controlsRow}>
                      <button style={styles.deleteMainBtn} onClick={(e) => handleDelete(e, syl._id)}>
                        <FaTrash /> Delete Course
                      </button>
                    </div>

                    {syl.subjects.map(sub => (
                      <div key={sub._id} style={styles.subjectBlock}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <h4 style={styles.subHeader}>{sub.name}</h4>
                          <button style={styles.iconBtn} onClick={() => handleAddChapter(syl._id, sub._id)} title="Add Chapter">
                            <FaPlus /> Add Chapter
                          </button>
                        </div>

                        <div style={styles.rawContent}>
                          {sub.chapters.map((c) => (
                            <div key={c._id} style={styles.chapterRow}>
                              {editingChapter?.chapterId === c._id ? (
                                <div style={{ display: 'flex', gap: '5px', flex: 1 }}>
                                  <input
                                    style={styles.editInput}
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    autoFocus
                                  />
                                  <button style={styles.okBtn} onClick={saveRename}><FaCheck /></button>
                                  <button style={styles.cancelBtn} onClick={() => setEditingChapter(null)}><FaTimes /></button>
                                </div>
                              ) : (
                                <>
                                  <input
                                    type="checkbox"
                                    checked={c.completed}
                                    onChange={() => toggleChapter(syl._id, sub._id, c)}
                                    style={{ cursor: 'pointer', accentColor: 'var(--accent-strong)' }}
                                  />
                                  <span style={{
                                    textDecoration: c.completed ? 'line-through' : 'none',
                                    color: c.completed ? '#888' : '#1e1e1e', // Darker text for visibility
                                    opacity: c.completed ? 0.7 : 1,
                                    flex: 1,
                                    cursor: 'pointer',
                                    marginLeft: '0.5rem',
                                    fontWeight: 500
                                  }} onClick={() => toggleChapter(syl._id, sub._id, c)}>
                                    {c.name}
                                  </span>
                                  <div style={styles.actions}>
                                    <button style={styles.iconBtn} onClick={() => handleRenameClick(syl._id, sub._id, c)}><FaEdit /></button>
                                    <button style={styles.iconBtnData} onClick={() => handleDeleteChapter(syl._id, sub._id, c._id)}><FaTrash /></button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                          {sub.chapters.length === 0 && <p style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic' }}>No chapters yet.</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  );
}

const styles = {
  container: { maxWidth: "1000px", paddingBottom: "3rem" },

  heading: {
    fontFamily: "var(--font-heading)",
    fontSize: "2.6rem",
    marginBottom: "2rem",
    color: "var(--text-primary)", // Adaptive
    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },

  inputCard: {
    background: "var(--bg-surface)",
    padding: "2rem",
    borderRadius: "22px",
    marginBottom: "3rem",
    color: "var(--text-primary)", // Adaptive
    border: '1px solid var(--border-light)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
  },

  inputGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: "var(--text-secondary)" // Adaptive
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "12px",
    border: "1px solid var(--border-light)",
    outline: "none",
    fontSize: '1rem',
    background: "var(--bg-sidebar)", // Adaptive
    color: "var(--text-primary)"     // Adaptive
  },

  tabContainer: {
    display: 'flex',
    gap: '1.5rem',
    borderBottom: '1px solid var(--border-light)',
    marginBottom: '1rem'
  },
  tab: {
    background: 'none',
    border: 'none',
    padding: '0.5rem 0',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'color 0.2s'
  },

  entryArea: {
    minHeight: '120px',
    marginBottom: '1.5rem'
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "1rem",
    borderRadius: "14px",
    border: "1px solid var(--border-light)",
    outline: "none",
    background: 'var(--bg-sidebar)', // Adaptive
    color: 'var(--text-primary)',    // Adaptive
    fontSize: '1rem'
  },
  fileUploadBox: {
    border: '2px dashed var(--border-dark)',
    borderRadius: '14px',
    padding: '2rem',
    textAlign: 'center',
    background: 'var(--bg-sidebar)' // Adaptive
  },

  primaryBtn: {
    width: '100%',
    padding: "1rem",
    borderRadius: "12px",
    border: "none",
    background: "var(--accent-strong)",
    color: "#fff",
    cursor: "pointer",
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'opacity 0.2s'
  },

  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },

  syllabusCard: {
    border: "1px solid var(--border-light)",
    borderRadius: "18px",
    background: "var(--bg-surface)",
    overflow: 'hidden'
  },

  headerRow: {
    padding: "1.5rem",
    cursor: "pointer",
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.2s',
    userSelect: 'none'
  },

  subjectTitle: {
    color: "var(--text-primary)", // Adaptive
    fontSize: "1.3rem",
    fontWeight: 700,
    fontFamily: 'var(--font-heading)'
  },

  percentBadge: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--accent-strong)',
  },

  progressBarBg: {
    height: '8px',
    width: '100%',
    background: 'var(--bg-highlight)', // Adaptive
    borderRadius: '4px',
    marginTop: '0.8rem',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    background: 'var(--accent-strong)',
    borderRadius: '4px',
    transition: 'width 0.5s ease'
  },

  contentBox: {
    padding: "0 1.5rem 1.5rem 1.5rem",
    borderTop: '1px solid var(--border-light)',
  },

  controlsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '1rem 0'
  },

  deleteMainBtn: {
    background: 'none',
    color: '#d9534f',
    border: '1px solid #ffcccc',
    padding: '0.4rem 0.8rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem'
  },

  subjectBlock: {
    marginBottom: '2rem'
  },

  subHeader: {
    color: 'var(--text-secondary)', // Adaptive
    fontSize: '1.1rem',
    fontWeight: '600'
  },

  rawContent: {
    background: "var(--bg-sidebar)", // Adaptive
    padding: "1.2rem",
    borderRadius: "16px",
    color: "var(--text-primary)",    // Adaptive
    border: "1px solid var(--border-light)"
  },

  chapterRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.8rem',
    padding: '4px 0',
    borderBottom: '1px solid var(--border-light)'
  },

  actions: {
    display: 'flex',
    gap: '0.8rem',
    opacity: 0.8,
  },

  iconBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent-strong)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem'
  },
  iconBtnData: {
    background: 'none',
    border: 'none',
    color: '#d9534f',
    cursor: 'pointer',
    fontSize: '0.9rem',
    zIndex: 10 // Ensure clickable
  },

  editInput: {
    flex: 1,
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid var(--accent-strong)',
    outline: 'none',
    background: 'var(--bg-surface)',
    color: 'var(--text-primary)'
  },
  okBtn: { border: 'none', background: 'none', color: 'green', cursor: 'pointer', padding: '0 5px' },
  cancelBtn: { border: 'none', background: 'none', color: '#d9534f', cursor: 'pointer', padding: '0 5px' }
};

export default SyllabusVisualizer;
