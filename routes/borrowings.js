const express = require('express');
const { pool } = require('../db');

const router = express.Router();

const BorrowingsController = require('../src/controllers/borrowingsController');
const borrowingsController = new BorrowingsController(pool);

router.post('/books/borrow', (req, res) => borrowingsController.borrowBook(req, res));
router.post('/books/return', (req, res) => borrowingsController.returnBook(req, res));
router.get('/my-books/:user_id', (req, res) => borrowingsController.getMyBooks(req, res));

module.exports = router;
