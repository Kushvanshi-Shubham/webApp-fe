import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  socket: WebSocket;
}

export const ChatWindow = ({ socket }: Props) => {
  const [messages, setMessages] = useState<{ text: string; isOwn: boolean }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message && data.from) {
          setMessages((prev) => [
            ...prev,
            {
              text: `${data.from}: ${data.message}`,
              isOwn: data.from === "you",
            },
          ]);
        }
      } catch {
        setMessages((prev) => [...prev, { text: event.data, isOwn: false }]);
      }
    };
  }, [socket]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const payload = {
      type: "chat",
      payload: { message: input.trim() },
    };
    socket.send(JSON.stringify(payload));

    setMessages((prev) => [
      ...prev,
      { text: `you: ${input.trim()}`, isOwn: true },
    ]);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center">Chat Room</h2>

      <div className="flex-1 overflow-y-auto mt-4 space-y-2 max-h-[300px] p-2 rounded border">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: msg.isOwn ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`rounded-xl p-3 max-w-[75%] break-words ${msg.isOwn ? "bg-blue-600 text-white ml-auto" : "bg-gray-100 text-gray-900 mr-auto"}`}
            >
              {msg.text}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef}></div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex mt-3 space-x-2"
      >
        <input
          className="flex-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="bg-blue-600 text-white rounded-xl p-3"
          type="submit"
        >
          Send
        </motion.button>
      </form>
    </div>
  );
};
