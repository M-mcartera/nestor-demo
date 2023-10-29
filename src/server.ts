import express from "express";
import dotenv from "dotenv";
import path from "path";
import { client, cacheMiddleware } from "./redis/index";
const envFilePath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envFilePath });

import groupRoutes from "./routes/index";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cacheMiddleware);
app.get("/redisTest", (req, res) => {
  const data = { name: "test" };
  res.json(data);
});
app.use("/api", groupRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  client.connect().then(() => {
    console.log("Redis is connected");
  });
});
