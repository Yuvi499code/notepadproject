// models/Note.js
const mongoose = require('mongoose');

// Define the note schema
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  userId: {
    type: String, // Assuming userId is a string for simplicity
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a Mongoose model based on the schema
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
