import express from "express";
import groupRoutes from "./routes/index";
import dotenv from "dotenv";
import path from "path";

const envFilePath = path.join(__dirname, "..", ".env");

dotenv.config({ path: envFilePath });

const app = express();
const port = process.env.PORT || 3000;

console.log(process.env);
app.use("/api", groupRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
