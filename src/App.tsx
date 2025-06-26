import { useState, useEffect } from "react";

interface ChatMessage {
  from: string;
  message: string;
}

function App() {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [stage, setStage] = useState<'name' | 'menu' | 'join' | 'chat'>('name');

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        alert(data.error);
      } else if (data.success) {
        if (data.roomId) {
          setRoomId(data.roomId);
        }
        setStage('chat');
      } else if (data.from && data.message) {
        setChatMessages((prev) => [...prev, data]);
      }
    };
  }, [socket]);

  const connectSocket = (onOpenHandler: (ws: WebSocket) => void) => {
    const ws = new WebSocket("wss://webapp-be-rny8.onrender.com/");
    ws.onopen = () => onOpenHandler(ws);
    setSocket(ws);
  };
  
  const handleCreate = () => {
    if (!name.trim()) {
      alert("Enter your name");
      return;
    }
    connectSocket((ws) => {
      ws.send(
        JSON.stringify({ type: "create", payload: { name } })
      );
    });
  };
  
  const handleJoin = () => {
    if (!name.trim() || !roomId.trim()) {
      alert("Enter name and room id");
      return;
    }
    connectSocket((ws) => {
      ws.send(
        JSON.stringify({ type: "join", payload: { roomId, name } })
      );
    });
  };
  
  const sendMessage = () => {
    if (!input.trim() || !socket) return;

    socket.send(
      JSON.stringify({ type: "chat", payload: { message: input.trim() } })
    );
    setChatMessages((prev) => [...prev, { from: 'you', message: input.trim() }]);
    setInput('');
  };
  
  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-4">
      {stage === 'name' && (
        <div className="flex flex-col space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="border p-3 rounded"
          />
          <button onClick={() => setStage('menu')}
            className="bg-blue-600 text-white p-3 rounded">
            Continue
          </button>
        </div>
      )}
      {stage === 'menu' && (
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white p-3 rounded">
            Create Room
          </button>
          <div className="flex space-x-2">
            <input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter 4 digit room code"
              className="border p-3 rounded"
            />
            <button
              onClick={handleJoin}
              className="bg-yellow-600 text-white p-3 rounded">
              Join Room
            </button>
          </div>
        </div>
      )}
      {stage === 'chat' && (
        <div className="w-[90vw] max-w-lg flex flex-col space-y-3">
          <div className="flex justify-center">Room ID: <b>{roomId}</b></div>
          <div className="border rounded flex flex-col flex-1 overflow-y-auto p-3 space-y-2">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded max-w-[80%] ${msg.from === 'you' ? 'bg-blue-600 text-white self-end' : 'bg-gray-300 text-gray-800 self-start'}`}
              >
                <b>{msg.from}</b>: {msg.message}
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 rounded border"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white p-3 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
