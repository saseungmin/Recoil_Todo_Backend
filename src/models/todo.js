import mongoose, { Schema } from 'mongoose';

const TodoSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Todo = mongoose.model('Todo', TodoSchema);

export default Todo;
