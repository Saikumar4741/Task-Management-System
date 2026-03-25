const Task = require('../models/Task');
const User = require('../models/User');

// Admin: get all tasks from all users
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: delete any task
const deleteAnyTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task)
      return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted by admin' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllTasks, getAllUsers, deleteAnyTask };