const User = require('../models/User');
const Note = require('../models/Note');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({}).populate('userId', 'name email');
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne({ _id: user._id });
      await Note.deleteMany({ userId: user._id }); // Delete user's notes
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      await Note.deleteOne({ _id: note._id });
      res.json({ message: 'Note removed' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalNotes = await Note.countDocuments();
    res.json({ totalUsers, totalNotes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAllNotes,
  deleteUser,
  deleteNote,
  getStats
};
