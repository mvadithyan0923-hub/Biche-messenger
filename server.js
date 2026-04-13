const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://biche-messenger.vercel.app",
    methods: ["GET", "POST"]
  }
});

app.use(express.static("public"));

let users = {};

io.on("connection", (socket) => {

    socket.on("join", (username) => {
        users[socket.id] = username;
        socket.broadcast.emit("chat message", username + " joined");
    });

    socket.on("chat message", (msg) => {
        io.emit("chat message", {
            user: users[socket.id],
            text: msg
        });
    });

    socket.on("typing", () => {
        socket.broadcast.emit("typing", users[socket.id] + " is typing...");
    });

    socket.on("stop typing", () => {
        socket.broadcast.emit("typing", "");
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("chat message", users[socket.id] + " left");
        delete users[socket.id];
    });
});

server.listen(3000, () => {
    console.log("Server running on https://biche-backend.onrender.com");
});