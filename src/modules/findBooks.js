const axios = require('axios');
const API_KEY = process.env.GOOGLE_API_KEY;

const findBooks = async (req, res) => {
    try{
        const {book} = req.body;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${book}&printType=books&maxResults=40&key=${API_KEY}`;
        const response = await axios.get(url);
        res.json(response.data.items);
    } catch (error) {
        console.error('Ошибка поиска книг', error);
    }
}

module.exports = findBooks;