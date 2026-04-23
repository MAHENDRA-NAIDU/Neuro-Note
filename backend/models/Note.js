const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  linkedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
  favorite: { type: Boolean, default: false },
  pinned: { type: Boolean, default: false },
  reminderDate: { type: Date },
  summary: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
