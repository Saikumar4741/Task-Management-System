const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask, getAnalytics } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/analytics', getAnalytics);
router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;