const express = require('express');
const router = express.Router();
const { getAllTasks, getAllUsers, deleteAnyTask } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/tasks', getAllTasks);
router.get('/users', getAllUsers);
router.delete('/tasks/:id', deleteAnyTask);

module.exports = router;