import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createServer } from "http"; // core module
import { newConnectionHandler } from "./socket/index.js";

const expressServer = express();
const port = process.env.PORT || 3001;

// socket.io
const httpServer = createServer(expressServer);
const io = new Server(httpServer);

io.on("connection", newConnectionHandler); // this is not a custom event. It's a socket.io event triggered every time a new client connects

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  httpServer.listen(port, () => {
    console.table(listEndpoints(expressServer));
    console.log(`server is running on port ${port}`);
  });
});
