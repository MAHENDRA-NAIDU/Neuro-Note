const Note = require('../models/Note');
const Notification = require('../models/Notification');

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id }).populate('linkedNotes', 'title');
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, content, tags, linkedNotes, favorite, pinned, reminderDate, summary } = req.body;
    
    const note = new Note({
      userId: req.user._id,
      title,
      content,
      tags,
      linkedNotes,
      favorite,
      pinned,
      reminderDate,
      summary,
    });

    const createdNote = await note.save();

    await Notification.create({
      userId: req.user._id,
      message: `You created a new note: "${title}"`,
      type: 'success',
      link: `/edit-note/${createdNote._id}`
    });

    res.status(201).json(createdNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (note) {
      if (note.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      note.title = req.body.title || note.title;
      note.content = req.body.content || note.content;
      note.tags = req.body.tags || note.tags;
      note.linkedNotes = req.body.linkedNotes || note.linkedNotes;
      note.favorite = req.body.favorite !== undefined ? req.body.favorite : note.favorite;
      note.pinned = req.body.pinned !== undefined ? req.body.pinned : note.pinned;
      note.reminderDate = req.body.reminderDate !== undefined ? req.body.reminderDate : note.reminderDate;
      note.summary = req.body.summary !== undefined ? req.body.summary : note.summary;

      const updatedNote = await note.save();

      await Notification.create({
        userId: req.user._id,
        message: `You updated note: "${note.title}"`,
        type: 'info',
        link: `/edit-note/${updatedNote._id}`
      });

      res.json(updatedNote);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (note) {
      if (note.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      await Note.deleteOne({ _id: note._id });
      res.json({ message: 'Note removed' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchNotes = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const regex = new RegExp(q, 'i');
    const notes = await Note.find({
      userId: req.user._id,
      $or: [{ title: regex }, { content: regex }, { tags: regex }]
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
};
