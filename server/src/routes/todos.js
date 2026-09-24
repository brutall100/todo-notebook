import { Router } from 'express';
import mongoose from 'mongoose';
import { CATEGORIES, Todo } from '../models/todo.js';
import { requireAuth } from '../middleware/require-auth.js';

const router = Router();
router.use(requireAuth);

const asText = (value) => (typeof value === 'string' ? value.trim() : '');

// Picks only the fields a user may change, and checks them
function readTodoFields(body, { partial = false } = {}) {
  const fields = {};
  if (!partial || 'title' in body) {
    fields.title = asText(body.title);
    if (!fields.title) return { error: 'A task needs a title.' };
  }
  if ('note' in body) fields.note = asText(body.note);
  if ('category' in body) {
    if (!CATEGORIES.includes(body.category)) return { error: 'Unknown category.' };
    fields.category = body.category;
  }
  if ('done' in body) {
    if (typeof body.done !== 'boolean') return { error: '"done" must be true or false.' };
    fields.done = body.done;
  }
  return { fields };
}

// Only finds tasks that belong to the logged-in user
function findOwnTodo(req) {
  if (!mongoose.isValidObjectId(req.params.id)) return null;
  return { _id: req.params.id, owner: req.userId };
}

router.get('/', async (req, res, next) => {
  try {
    const todos = await Todo.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { fields, error } = readTodoFields(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const todo = await Todo.create({ ...fields, owner: req.userId });
    return res.status(201).json(todo);
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  const filter = findOwnTodo(req);
  if (!filter) return res.status(404).json({ message: 'Task not found.' });

  const { fields, error } = readTodoFields(req.body, { partial: true });
  if (error) return res.status(400).json({ message: error });

  try {
    const todo = await Todo.findOneAndUpdate(filter, fields, { new: true, runValidators: true });
    if (!todo) return res.status(404).json({ message: 'Task not found.' });
    return res.json(todo);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const filter = findOwnTodo(req);
  if (!filter) return res.status(404).json({ message: 'Task not found.' });

  try {
    const result = await Todo.deleteOne(filter);
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Task not found.' });
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
});

export default router;
