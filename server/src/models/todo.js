import mongoose from 'mongoose';

export const CATEGORIES = ['work', 'home', 'study', 'errands'];

const todoSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    note: { type: String, trim: true, maxlength: 500, default: '' },
    category: { type: String, enum: CATEGORIES, default: 'home' },
    done: { type: Boolean, default: false },
  },
  { timestamps: true },
);

todoSchema.set('toJSON', {
  transform: (_doc, ret) => ({
    id: ret._id.toString(),
    title: ret.title,
    note: ret.note,
    category: ret.category,
    done: ret.done,
    createdAt: ret.createdAt,
  }),
});

export const Todo = mongoose.model('Todo', todoSchema);
