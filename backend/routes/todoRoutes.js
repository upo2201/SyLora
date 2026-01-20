import express from 'express';
import Todo from '../models/Todo.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get user todos
// @route   GET /api/todos
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new todo
// @route   POST /api/todos
// @access  Private
router.post('/', protect, async (req, res) => {
  const { text, dueDate } = req.body;

  try {
    const todo = new Todo({
      user: req.user._id,
      text,
      dueDate,
    });

    const createdTodo = await todo.save();
    res.status(201).json(createdTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update todo status
// @route   PUT /api/todos/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (todo) {
      if (todo.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      todo.completed = req.body.completed ?? todo.completed;
      todo.text = req.body.text ?? todo.text;

      const updatedTodo = await todo.save();
      res.json(updatedTodo);
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (todo) {
      if (todo.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      await todo.deleteOne();
      res.json({ message: 'Todo removed' });
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
