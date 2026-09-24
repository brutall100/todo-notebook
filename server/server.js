import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); 

const mongoURI = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

mongoose.connect(mongoURI, {
  dbName: dbName,
})
  .then(() => console.log(`Connected to MongoDB database: ${dbName}`))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// TodoDB Todo model definition (mongoose schema)
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  done: { type: Boolean, default: false },
});
const Todo = mongoose.model('Todo', todoSchema);

// TodoDB Category model definition (mongoose schema)
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
});
const Category = mongoose.model('Category', categorySchema);

//// Get /api/categories - Retrieve all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();  
    res.json(categories);  
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

//// GET /api/todos - Retrieve all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    const todosWithStringId = todos.map(todo => ({
      ...todo.toObject(),
      id: todo._id.toString(), 
    }));
    res.json(todosWithStringId);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

//// POST /api/todos - Add a new todo
// POST /api/todos - Add a new todo
app.post('/api/todos', async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Title, description, and category are required' });
  }

  const newTodo = new Todo({
    title,
    description,
    category,
  });

  try {
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

//// PUT /api/todos/:id - Edit a todo
app.put('/api/todos/:id', async (req, res) => {
  const { title, description, category, tags } = req.body;
  const { id } = req.params;

  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Title, description, and category are required' });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description, category, tags },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

//// PATCH /api/todos/:id/done - Mark a todo as done or undone
app.patch('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { done: done },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update todo status' });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// npm run dev
// paleidzia visus serverius







// //// PUT /api/todos/:id - Edit a todo
// app.put('/api/todos/:id', async (req, res) => {
//   const { title, description, category, tags } = req.body;
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ error: 'Invalid ID format' });
//   }

//   try {
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: 'Invalid todo ID' });
//     }

//     if (!title || !description || !category) {
//       return res.status(400).json({ error: 'Title, description, and category are required' });
//     }

//     const updatedTodo = await Todo.findByIdAndUpdate(
//       id,
//       { title, description, category, tags },
//       { new: true } // Return the updated todo
//     );

//     if (!updatedTodo) {
//       return res.status(404).json({ error: 'Todo not found' });
//     }

//     res.json(updatedTodo);
//   } catch (err) {
//     console.error('Error updating todo:', err); // Add this line
//     res.status(500).json({ error: 'Failed to update todo' });
//   }
// });