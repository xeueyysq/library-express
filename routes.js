const express = require('express');
const { pool } = require('../lib-express/db');

const router = express.Router();

const BooksController = require('./src/controllers/booksController');
const booksController = new BooksController(pool);

router.get('/get-all-books', (req, res) => booksController.getAllBooks(req, res));
router.post('/add-book', (req, res) => booksController.addBook(req, res));

const findBooks = require('./src/modules/findBooks');

router.post('/find-books', findBooks);

const UserModel = require('./src/models/user')
const UserController = require('./src/controllers/userController');

const userModel = new UserModel(pool);
const userController = new UserController(userModel);

router.get('/users', (req, res) => userController.getAllUsers(req, res));
router.get('/users/:id', (req, res) => userController.getUserById(req, res));
router.post('/users', (req, res) => userController.createUser(req, res));
router.post('/users/profile', (req, res) => userController.createUserProfile(req, res));

router.post('/register', (req, res) => userController.registerUser(req, res));
router.post('/login', (req, res) => userController.loginUser(req, res));

const BorrowingsController = require('../src/controllers/borrowingsController');
const borrowingsController = new BorrowingsController(pool);

router.post('/api/books/borrow', (req, res) => borrowingsController.borrowBook(req, res));
router.post('/api/books/return', (req, res) => borrowingsController.returnBook(req, res));
router.get('/api/my-books/:reader_id', (req, res) => borrowingsController.getMyBooks(req, res));


module.exports = router;