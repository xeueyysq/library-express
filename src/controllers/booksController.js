const Books = require('../models/books')

class BooksController {
    constructor (pool) {
        this.model = new Books(pool);
    }

    async getAllBooks (req, res) {
        try{
            const record = await this.model.getAllBooks();
            res.json(record);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = BooksController;