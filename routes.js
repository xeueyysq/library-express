const express = require('express');
const { pool } = require('../lib-express/db');

const router = express.Router();

const BooksController = require('../lib-express/controllers/booksController');
const booksController = new BooksController(pool);

router.get('/get-all-books', booksController.getAllBooks.bind(booksController));

module.exports = router;