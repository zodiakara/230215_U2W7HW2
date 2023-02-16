import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import { httpServer, expressServer } from "./server";

const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URL!);

mongoose.connection.on("connected", () => {
  httpServer.listen(port, () => {
    console.table(listEndpoints(expressServer));
    console.log(`Server is running on port ${port}`);
  });
});
