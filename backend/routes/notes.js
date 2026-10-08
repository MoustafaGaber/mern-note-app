import express from "express";
import Note from "../models/Note.js";
import { protect } from "../middleware/auth.js";
import mongoose from "mongoose"; // ← هنا

const router = express.Router();

// Get notes
router.get("/", protect, async (req, res) => {
  try {
    const notes = await Note.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(notes);
  } catch (err) {
    console.error("Get all notes error: ", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a note
router.post("/", protect, async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title || !description) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const note = await Note.create({
      title,
      description,
      createdBy: req.user._id,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a note
router.get("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid note id" });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a note
router.put("/:id", protect, async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid note id" });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    note.title = title || note.title;
    note.description = description || note.description;

    const updatedCode = await note.save();
    res.json(updatedCode);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a note
router.delete("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid note id" });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await note.deleteOne();
    res.json({ message: "Note was deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
