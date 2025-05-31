const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust to your frontend URL (e.g., Vite default)
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Basic route for health check
app.get("/", (req, res) => {
  res.send("Socket.IO server is running");
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("message", (data) => {
    // Broadcast message to all clients (including admin)
    io.emit("message", {
      sender: data.sender === "User" ? "User" : "Admin",
      content: data.content,
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
