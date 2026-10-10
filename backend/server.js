import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/notes.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));

// Vercel invokes this app per request. Connect lazily and reuse Mongoose's
// connection in warm instances instead of opening a server at module load.
app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB connection failed:", error.message);
    res.status(503).json({ message: "Database unavailable" });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", database: "connected" });
});

app.use("/api/users", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (_req, res) => res.send("API is running"));

// آخر حاجة
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Local development uses `npm run dev`; Vercel consumes the exported app.
if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
  });
}

export default app;
