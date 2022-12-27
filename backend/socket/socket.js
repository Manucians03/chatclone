import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
	},
});

export const getReceiverSocketId = (receiverId) => {
	return socketUsers[receiverId];
};

const socketUsers = {};

io.on("connection", (socket) => {
	console.log(`user ${socket.id} connected`);

	const userId = socket.handshake.query.userId;
	if (userId != "undefined") socketUsers[userId] = socket.id;

	io.emit("getOnlineUsers", Object.keys(socketUsers));
	
	socket.on("disconnect", () => {
		console.log(`user ${socket.id} disconnected`);
		delete socketUsers[userId];
		io.emit("getOnlineUsers", Object.keys(socketUsers));
	});
});

export { app, io, server };
