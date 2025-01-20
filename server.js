// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Note = require('./models/Note');
const app = express();

// Middleware
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/notesApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

// Home Route
app.get('/', (req, res) => {
  res.send('Welcome to Notes App!');
});

// Route to render notes using EJS
app.get('/notes', async (req, res) => {
  const { userId } = req.query;  // Assuming user ID is passed as a query parameter
  try {
    // Fetch all notes for the user
    const notes = await Note.find({ userId });
    // Render the notes using EJS
    res.render('notes', { notes });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving notes', error });
  }
});

// Create a new note
app.post('/notes', async (req, res) => {
  const { title, content, userId } = req.body;
  const note = new Note({
    title,
    content,
    userId,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  try {
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: 'Error creating note', error });
  }
});

// Get a specific note by ID
app.get('/notes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving note', error });
  }
});

// Update a note
app.put('/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const note = await Note.findByIdAndUpdate(id, { title, content, updatedAt: new Date() }, { new: true });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error });
  }
});

// Delete a note
app.delete('/notes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
