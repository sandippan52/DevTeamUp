import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const TeamChat = () => {
  const { teamId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    api.get("/me")
      .then(res => setUser(res.data.user))
      .catch(() => {});
  }, []);

  // Poll messages
  useEffect(() => {
    if (!teamId) return;

    const fetchMessages = async () => {
      const res = await api.get(`/team/${teamId}/messages`);
      setMessages(res.data); // 🔑 DB is the source of truth
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [teamId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await api.post(`/team/${teamId}/message`, {
      message: text
    });

    setText(""); // polling will fetch updated list
  };

  if (!user) return <p>Loading chat...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Team Chat</h2>

      <div className="h-80 overflow-y-auto border p-3 mb-3 rounded">
        {messages.map(m => (
          <div key={m._id} className="mb-2">
            <b>{m.senderName}</b>: {m.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default TeamChat;
