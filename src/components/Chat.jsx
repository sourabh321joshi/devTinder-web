import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const messagesEndRef = useRef(null);

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });
    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
      };
    });
    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((prev) => [...prev, { firstName, lastName, text }]);
    });

    return () => socket.disconnect();
  }, [userId, targetUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage.trim(),
    });
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-3/4 mx-auto border border-gray-800 bg-[#0d1117] text-gray-100 rounded-xl shadow-xl m-5 h-[75vh] flex flex-col overflow-hidden backdrop-blur-lg">
      <h1 className="p-5 text-lg font-medium border-b border-gray-800 bg-[#161b22] text-center shadow-md">
        Chat
      </h1>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#0d1117]/95">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              user.firstName === msg.firstName ? "items-end" : "items-start"
            }`}
          >
            <div className="text-xs text-gray-400 mb-1">
              {`${msg.firstName} ${msg.lastName}`}
            </div>
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl backdrop-blur-sm ${
                user.firstName === msg.firstName
                  ? "bg-[#d63384]/20 border border-[#d63384]/30 shadow-[0_0_10px_rgba(214,51,132,0.2)] text-white rounded-br-none"
                  : "bg-[#161b22] border border-gray-700 text-gray-200 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Seen</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input + Button */}
      <div className="p-4 border-t border-gray-800 bg-[#161b22] flex items-center gap-3">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-[#0d1117] border border-gray-700 text-white rounded-lg p-2 focus:outline-none focus:border-[#d63384] focus:ring-1 focus:ring-[#d63384]/40 transition-all duration-300"
        />
        <button
          onClick={sendMessage}
          className="px-5 py-2 rounded-lg bg-[#1a1f27] border border-gray-700 hover:bg-[#d63384]/90 hover:shadow-[0_0_15px_rgba(214,51,132,0.4)] hover:border-[#d63384] text-white font-medium transition-all duration-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
