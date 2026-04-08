import dotenv from "dotenv";
import connectDb from "./database/index.js";
import app from "./app.js";
import http from "http";
import { initializeSocket } from "./socket/index.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8000;

const server = http.createServer(app);

initializeSocket(server);

connectDb()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running at port : ${port}`);
    });
  })
  .catch((err) => {
    console.log("Mongo DB connection failed !!!", err);
  });
