import express from "express";
import mongoose from "mongoose"; 
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import taskListRoutes from "./routes/taskListRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true, 
	})
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/lists", taskListRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

mongoose
	.connect(MONGO_URI)
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
	res.send("API is running...");
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
