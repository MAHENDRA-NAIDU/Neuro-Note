const express = require('express');
const router = express.Router();
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/search', protect, require('../controllers/noteController').searchNotes);

router.route('/')
  .get(protect, getNotes)
  .post(protect, createNote);

router.route('/:id')
  .put(protect, updateNote)
  .delete(protect, deleteNote);

module.exports = router;
