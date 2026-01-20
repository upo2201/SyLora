import express from 'express';
import Syllabus from '../models/Syllabus.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get user syllabus
// @route   GET /api/syllabus
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const syllabus = await Syllabus.find({ user: req.user._id });
    res.json(syllabus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new syllabus
// @route   POST /api/syllabus
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, subjects } = req.body;

  try {
    const syllabus = new Syllabus({
      user: req.user._id,
      title,
      subjects,
    });

    const createdSyllabus = await syllabus.save();
    res.status(201).json(createdSyllabus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a chapter's status (toggle completion)
router.put('/:id/chapters/:subjectId/:chapterId', protect, async (req, res) => {
  try {
    const { id, subjectId, chapterId } = req.params;
    const { completed } = req.body;

    const syllabus = await Syllabus.findOne({ _id: id, user: req.user._id });
    if (!syllabus) return res.status(404).json({ message: "Syllabus not found" });

    const subject = syllabus.subjects.id(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const chapter = subject.chapters.id(chapterId);
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });

    chapter.completed = completed;
    await syllabus.save();

    res.json(syllabus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a syllabus entry
router.delete('/:id', protect, async (req, res) => {
  try {
    const syllabus = await Syllabus.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!syllabus) return res.status(404).json({ message: "Syllabus not found" });
    res.json({ message: "Syllabus deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new chapter to a subject
router.post('/:id/chapters/:subjectId', protect, async (req, res) => {
  try {
    const { id, subjectId } = req.params;
    const { name } = req.body;

    const syllabus = await Syllabus.findOne({ _id: id, user: req.user._id });
    if (!syllabus) return res.status(404).json({ message: "Syllabus not found" });

    const subject = syllabus.subjects.id(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    subject.chapters.push({ name: name, completed: false });
    await syllabus.save();

    res.json(syllabus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rename a chapter
router.put('/:id/chapters/:subjectId/:chapterId/name', protect, async (req, res) => {
  try {
    const { id, subjectId, chapterId } = req.params;
    const { name } = req.body;

    const syllabus = await Syllabus.findOne({ _id: id, user: req.user._id });
    if (!syllabus) return res.status(404).json({ message: "Syllabus not found" });

    const subject = syllabus.subjects.id(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const chapter = subject.chapters.id(chapterId);
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });

    chapter.name = name;
    await syllabus.save();

    res.json(syllabus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a chapter
router.delete('/:id/chapters/:subjectId/:chapterId', protect, async (req, res) => {
  try {
    const { id, subjectId, chapterId } = req.params;

    const syllabus = await Syllabus.findOne({ _id: id, user: req.user._id });
    if (!syllabus) return res.status(404).json({ message: "Syllabus not found" });

    const subject = syllabus.subjects.id(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    subject.chapters.pull(chapterId); // Mongoose pull to remove by ID
    await syllabus.save();

    res.json(syllabus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
