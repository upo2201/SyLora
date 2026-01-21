import { useState, useRef, useEffect } from "react";
import { chatWithAI } from "../utils/api";
import ReactMarkdown from 'react-markdown';
import { FaPaperPlane, FaRobot } from "react-icons/fa";

function AIChatbot() {
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hello! I am your AI Study Assistant. How can I help you plan your studies today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages([...messages, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const data = await chatWithAI(userMsg.text);
      const botMsg = { role: 'model', text: data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("AI Chat failed", error);
      let errorMsg = "Sorry, I'm having trouble connecting right now.";
      if (error.response?.data?.message) {
        errorMsg = `Error: ${error.response.data.message}`;
      }
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      // Send a simple ping
      await chatWithAI("Hello, just testing the connection.");
      alert("Connection Successful! AI is responding.");
    } catch (e) {
      alert(`Connection Failed: ${e.response?.data?.error || e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={styles.heading}>SyLora AI Tutor</h2>
        <button onClick={testConnection} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}> Test AI </button>
      </div>

      <div style={styles.chatWindow} ref={scrollRef}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            ...styles.messageRow,
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            {msg.role === 'model' && (
              <div style={styles.avatar}>
                <FaRobot />
              </div>
            )}
            <div style={{
              ...styles.bubble,
              background: msg.role === 'user' ? 'var(--accent-strong)' : 'var(--bg-surface)',
              color: msg.role === 'user' ? '#fff' : 'var(--text-primary)', // Adaptive
              border: msg.role === 'user' ? 'none' : '1px solid var(--border-light)'
            }}>
              {msg.role === 'model' ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.messageRow, justifyContent: 'flex-start' }}>
            <div style={styles.avatar}><FaRobot /></div>
            <div style={{ ...styles.bubble, background: 'var(--bg-surface)', color: '#666' }}>
              Thinking...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} style={styles.inputArea}>
        <input
          style={styles.input}
          placeholder="Ask doubts or ask for a study plan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" style={styles.sendBtn} disabled={loading}>
          <FaPaperPlane />
        </button>
      </form>
    </section>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    height: 'calc(100vh - 6rem)',
    display: 'flex',
    flexDirection: 'column'
  },
  heading: {
    fontFamily: "var(--font-heading)",
    fontSize: "2.6rem",
    marginBottom: "1.5rem",
    color: "var(--text-primary)", // Adaptive
    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  chatWindow: {
    flex: 1,
    background: 'var(--bg-surface)', // Adaptive
    border: '1px solid var(--border-light)',
    borderRadius: '20px',
    padding: '1.5rem',
    overflowY: 'auto',
    marginBottom: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  messageRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    maxWidth: '100%'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'var(--accent-main)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    flexShrink: 0
  },
  bubble: {
    padding: '10px 18px',
    borderRadius: '18px',
    maxWidth: '80%',
    lineHeight: '1.5',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    fontSize: '0.95rem'
  },
  inputArea: {
    display: 'flex',
    gap: '1rem'
  },
  input: {
    flex: 1,
    padding: '1rem 1.5rem',
    borderRadius: '30px',
    border: '1px solid var(--border-light)',
    outline: 'none',
    background: 'var(--bg-surface)',
    color: 'var(--text-primary)', // Adaptive
    fontSize: '1rem'
  },
  sendBtn: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    border: 'none',
    background: 'var(--accent-strong)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  }
};

export default AIChatbot;
