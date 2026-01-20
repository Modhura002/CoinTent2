import { useState } from "react";
import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const insights = [
  "Your spending pattern this month shows a healthy balance between growth and control.",
  "You’re allocating resources wisely—keep tracking weekly trends.",
  "Current expense behavior supports long-term creator sustainability.",
  "Smart spending decisions detected. Stay consistent.",
];

function Insights({ user, onLogout }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your financial assistant. Ask me anything about your budget or spending." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I couldn't reach the server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{ marginBottom: "20px" }}>AI Insights Chat</h1>

        <div className="card" style={{ height: "60vh", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflowY: "auto", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                background: msg.role === "user" ? "#c7a17a" : "#2a2a2a",
                color: msg.role === "user" ? "#000" : "#fff",
                padding: "12px 16px",
                borderRadius: "12px",
                maxWidth: "70%"
              }}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({node, ...props}) => <table style={{ borderCollapse: "collapse", width: "100%", margin: "10px 0" }} {...props} />,
                    th: ({node, ...props}) => <th style={{ border: "1px solid #555", padding: "8px", background: "#444" }} {...props} />,
                    td: ({node, ...props}) => <td style={{ border: "1px solid #555", padding: "8px" }} {...props} />,
                    p: ({node, ...props}) => <p style={{ margin: 0, color: "inherit" }} {...props} />
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            ))}
            {loading && <div style={{ color: "#888", fontStyle: "italic" }}>Thinking...</div>}
          </div>

          <form onSubmit={sendMessage} style={{ display: "flex", gap: "10px" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about your finances..."
              style={{ flex: 1, color: "#fff", background: "#333", border: "1px solid #555", borderRadius: "8px", padding: "8px 12px" }}
            />
            <button type="submit" disabled={loading}>Send</button>
          </form>
        </div>
      </motion.div>
    </Layout>
  );
}

export default Insights;
