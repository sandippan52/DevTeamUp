
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

import api from "../api/axios";

const socket = io("http://localhost:3000", {
  withCredentials: true
});

const TeamChat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { teamId } = useParams();
  const [user, setUser] = useState(null);


useEffect(() => {

    const fetchUser = async ()=>{
        const res = await api.get("/me")
        setUser(res.data.user)
    };
    fetchUser();

}, [])

useEffect(() => {
  if (!teamId) return;

  const fetchMessages = async () => {
    const res = await api.get(`/team/${teamId}/messages`);
    setMessages(
      res.data.map(m => ({
        sender: m.senderName,
        message: m.message,
        createdAt: m.createdAt,
      }))
    );
  };

  fetchMessages();
}, [teamId]);






  useEffect(() => {

     if (!teamId || !user) return;

    // join team room
    socket.emit("join-team", { teamId });

    // listen for messages
    socket.on("receive-message", (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [teamId,user]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send-message", {
      teamId,
      message: text,
      senderId: user._id,
      senderName: user.fullname
    });

    setText("");
  };

  if (!user) return <p>Loading Chat...</p>

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Team Chat</h2>

      <div className="h-80 overflow-y-auto border p-3 mb-3 rounded">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <b>{msg.sender}</b>: {msg.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
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
