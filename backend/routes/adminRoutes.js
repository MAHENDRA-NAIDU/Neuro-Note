const express = require('express');
const router = express.Router();
const { getAllUsers, getAllNotes, deleteUser, deleteNote, getStats } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');

router.use(protect);
router.use(admin);

router.get('/users', getAllUsers);
router.get('/notes', getAllNotes);
router.get('/stats', getStats);
router.delete('/user/:id', deleteUser);
router.delete('/note/:id', deleteNote);

module.exports = router;
