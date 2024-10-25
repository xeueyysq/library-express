const express = require('express');
const { pool } = require('../db');

const router = express.Router();

const UserModel = require('../src/models/user');
const UserController = require('../src/controllers/userController');

const userModel = new UserModel(pool);
const userController = new UserController(userModel);

router.get('/', (req, res) => userController.getAllUsers(req, res));
router.get('/:id', (req, res) => userController.getUserById(req, res));
router.post('/', (req, res) => userController.createUser(req, res));
router.post('/profile', (req, res) => userController.createUserProfile(req, res));

router.post('/register', (req, res) => userController.registerUser(req, res));
router.post('/login', (req, res) => userController.loginUser(req, res));

module.exports = router;