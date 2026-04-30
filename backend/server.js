import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import { authMiddleWare } from "../backend/middleware/auth.middleware.js";


import authRoutes from "./modules/auth/auth.routes.js";

dotenv.config();


const app = express();
const PORT = 5000;


app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
)

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Fasyl PMO Backend Running");
});
//This is for testing the functionality of protected routing
app.get("/api/protected", authMiddleWare, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user
  });
});
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
