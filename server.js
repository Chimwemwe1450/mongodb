const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/bookstore')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define a Schema and Model
const BookSchema = new mongoose.Schema({
    Title: String,
    Author: String,
    pages: Number,
    geners: [String],
    ratings: Number,
    publisher: {
        name: String,
        location: String,
        year: Number,
    },
    reviews: [
        {
            reviewer: String,
            rating: Number,
            comment: String,
        }
    ],
});

const Book = mongoose.model('Book', BookSchema);

// API Route
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/books', async (req, res) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.json(newBook);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
