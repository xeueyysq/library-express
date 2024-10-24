require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const booksRouter = require('./routes');

app.use(cors());
app.use(express.json());

app.use('/api/books', booksRouter);

app.get('/', (req, res) => {
  res.send('Библиотека');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
