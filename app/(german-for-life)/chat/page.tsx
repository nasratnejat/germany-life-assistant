"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your Klar assistant. Ask me anything about German paperwork, life admin, or just chat — I'm here to help.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessages([
          ...updatedMessages,
          { role: "assistant", text: `Error: ${data.error}` },
        ]);
      } else {
        setMessages([
          ...updatedMessages,
          { role: "assistant", text: data.reply },
        ]);
      }
    } catch (err) {
      setMessages([
        ...updatedMessages,
        { role: "assistant", text: `Something went wrong: ${err.message}` },
      ]);
    }
    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center p-6">
      <div className="w-full max-w-lg flex flex-col h-[85vh]">
        <div className="text-center mb-4">
          <h1 className="text-xl font-semibold text-slate-800">
            Klar Assistant
          </h1>
          <Link href="/" className="text-teal-600 text-xs hover:underline">
            ← Back to Home
          </Link>
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 text-slate-400 rounded-2xl px-4 py-2.5 text-sm">
                Typing...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2 mt-3">
          <textarea
            className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-white text-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            rows={1}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="bg-teal-600 text-white px-5 rounded-xl hover:bg-teal-700 disabled:bg-slate-300 transition-colors text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
