import "dotenv/config";
import express from "express"
import cors from "cors";
import { connectDB } from "./config/db.js"
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/notes.js";

//dotenv.config()

const app = express()
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api/users", authRoutes);
app.use("/api/notes", noteRoutes);

const port=process.env.PORT || 5000
app.get("/",(req,res)=>{
    res.send("hello world")
})
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

connectDB().then(()=>{
    app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}` )
})
    
}
).catch((err)=>{
   console.error("DB connection failed:", err);
  process.exit(1);
});
