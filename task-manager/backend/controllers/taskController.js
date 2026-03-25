const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const { status, priority, search, sortBy, order, page, limit } = req.query;
    let filter = { user: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const sortOrder = order === 'asc' ? 1 : -1;
    let sortOption = { createdAt: -1 };
    if (sortBy === 'dueDate') sortOption = { dueDate: sortOrder };
    if (sortBy === 'priority') {
      sortOption = { priority: sortOrder };
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 6;
    const skip = (pageNum - 1) * limitNum;

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      tasks,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    if (!title)
      return res.status(400).json({ message: 'Title is required' });

    const task = await Task.create({
      user: req.user._id,
      title, description,
      status: status || 'Todo',
      priority: priority || 'Medium',
      dueDate
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task)
      return res.status(404).json({ message: 'Task not found' });

    const { title, description, status, priority, dueDate } = req.body;
    task.title = title || task.title;
    task.description = description ?? task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;

    const updated = await task.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task)
      return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Done').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const todo = tasks.filter(t => t.status === 'Todo').length;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({ total, completed, inProgress, todo, completionPercentage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getAnalytics };