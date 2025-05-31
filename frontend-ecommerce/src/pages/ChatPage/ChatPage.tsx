import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";
import styles from "./ChatPage.module.css";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const socketIo = io("http://localhost:5000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketIo);

    socketIo.on("connect", () => {
      setIsConnected(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-status`,
          sender: "System",
          content: "Connected to customer care",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    });

    socketIo.on("disconnect", () => {
      setIsConnected(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-status`,
          sender: "System",
          content: "Disconnected from customer care",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    });

    socketIo.on("message", (data: { sender: string; content: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${data.sender}`,
          sender: data.sender,
          content: data.content,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (messageInput.trim() && socket && isConnected) {
      const message = {
        sender: "User",
        content: messageInput,
        timestamp: new Date().toLocaleTimeString(),
      };
      socket.emit("message", message);
      setMessages((prev) => [
        ...prev,
        { ...message, id: `${Date.now()}-user` },
      ]);
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h2>Customer Care Chat</h2>
        <span className={isConnected ? styles.connected : styles.disconnected}>
          {isConnected ? "Online" : "Offline"}
        </span>
      </div>
      <div className={styles.chatMessages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.sender === "User" ? styles.userMessage : styles.adminMessage
            }`}
          >
            <div className={styles.messageHeader}>
              <FaUserCircle className={styles.messageIcon} />
              <span className={styles.sender}>{msg.sender}</span>
              <span className={styles.timestamp}>{msg.timestamp}</span>
            </div>
            <div className={styles.messageContent}>{msg.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.chatInput}>
        <textarea
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            isConnected
              ? "Type your message..."
              : "Connecting to customer care..."
          }
          className={styles.input}
          disabled={!isConnected}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || !messageInput.trim()}
          className={styles.sendButton}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
