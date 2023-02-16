import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http"; // core module
import { newConnectionHandler } from "./socket";
import productsRouter from "./api/products";
import usersRouter from "./api/users";
import {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
  unauthorizedHandler,
} from "./errorHandlers";

const expressServer = express();

// ************************************ SOCKET.IO ********************************
const httpServer = createServer(expressServer);
const io = new Server(httpServer);

io.on("connection", newConnectionHandler); // this is not a custom event. It's a socket.io event triggered every time a new client connects

// *********************************** MIDDLEWARES *******************************
expressServer.use(cors());
expressServer.use(express.json());

// ************************************ ENDPOINTS ********************************
expressServer.use("/products", productsRouter);
expressServer.use("/users", usersRouter);

// *********************************** ERROR HANDLERS ****************************
expressServer.use(badRequestHandler);
expressServer.use(unauthorizedHandler);
expressServer.use(notFoundHandler);
expressServer.use(genericErrorHandler);

export { httpServer, expressServer };
