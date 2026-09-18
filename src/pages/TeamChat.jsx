import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const TeamChat = () => {
  const { teamId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/me")
      .then(res => setUser(res.data.user))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!teamId) return;

    const fetchMessages = async () => {
      const res = await api.get(`/team/${teamId}/messages`);
      setMessages(res.data);
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

    setText("");
  };

  if (!user) {
    return (
      <p className="text-center mt-10 px-4">
        Loading chat...
      </p>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-5 sm:py-6">

      <h2 className="text-xl sm:text-2xl font-bold mb-4">
        Team Chat
      </h2>

      <div className="h-72 sm:h-80 overflow-y-auto border p-3 sm:p-4 mb-3 rounded bg-white">

        {messages.map(m => (
          <div
            key={m._id}
            className="mb-2 text-sm sm:text-base break-words"
          >
            <b>{m.senderName}</b>: {m.message}
          </div>
        ))}

      </div>

      <div className="flex flex-col sm:flex-row gap-2">

        <input
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full sm:flex-1 border rounded px-3 py-2.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type message..."
        />

        <button
          onClick={sendMessage}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2.5 sm:py-2 rounded hover:bg-blue-700 transition"
        >
          Send
        </button>

      </div>

    </div>
  );
};

export default TeamChat;