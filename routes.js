const express = require('express');
const { pool } = require('../lib-express/db');

const router = express.Router();

const BooksController = require('./src/controllers/booksController');
const booksController = new BooksController(pool);

router.get('/get-all-books', (req, res) => booksController.getAllBooks(req, res));

const findBooks = require('./src/modules/findBooks');

router.post('/find-books', findBooks);

module.exports = router;