class BorrowingsController {
    constructor(pool) {
    this.pool = pool;
    }
    async borrowBook(req, res) {
        const { book_id, user_id } = req.body;
    
        try {
        const checkBorrowingQuery = `
            SELECT * FROM borrowings
            WHERE book_id = $1 AND user_id = $2 AND date_to IS NULL
        `;
        const checkBorrowingResult = await this.pool.query(checkBorrowingQuery, [book_id, user_id]);
    
        if (checkBorrowingResult.rows.length > 0) {
            return res.status(400).json({ error: 'Вы уже взяли эту книгу и не вернули ее' });
        }
    
        const insertBorrowingQuery = `
            INSERT INTO borrowings (book_id, user_id, date_from)
            VALUES ($1, $2, CURRENT_DATE)
            RETURNING *
        `;
        const insertBorrowingResult = await this.pool.query(insertBorrowingQuery, [book_id, user_id]);
    
        res.json({ message: 'Книга успешно взята', borrowing: insertBorrowingResult.rows[0] });
        } catch (error) {
        console.error('Ошибка при взятии книги:', error);
        res.status(500).send('Внутренняя ошибка сервера');
        }
    }

async returnBook(req, res) {
    const { book_id, user_id } = req.body;

    try {
    console.log(`Запрос на удаление записи о возврате книги. book_id: ${book_id}, user_id: ${user_id}`);

    const deleteBorrowingQuery = `
        DELETE FROM borrowings
        WHERE book_id = $1 AND user_id = $2
        RETURNING *
    `;
    const deleteBorrowingResult = await this.pool.query(deleteBorrowingQuery, [book_id, user_id]);

    if (deleteBorrowingResult.rowCount === 0) {
        console.log(`Ошибка: запись для удаления не найдена. book_id: ${book_id}, user_id: ${user_id}`);
        return res.status(400).json({ error: 'Запись о возврате не найдена' });
    }

    console.log(`Книга успешно возвращена и запись удалена:`, deleteBorrowingResult.rows[0]);

    res.json({ message: 'Книга успешно возвращена и запись удалена' });
    } catch (error) {
    console.error('Ошибка при возврате книги:', error);
    res.status(500).send('Внутренняя ошибка сервера');
    }
}

async getMyBooks(req, res) {
    const user_id = req.params.user_id;

    try {
    console.log(`Получение всех книг для пользователя с ID: ${user_id}`);
    
    const query = `
        SELECT books.*
        FROM books
        JOIN borrowings ON books.id = borrowings.book_id
        WHERE borrowings.user_id = $1
    `;
    const result = await this.pool.query(query, [user_id]);
    
    console.log(`Найдено ${result.rows.length} книг для пользователя с ID: ${user_id}`);
    console.log(result.rows);

    res.json(result.rows);
    } catch (error) {
    console.error('Ошибка при получении книг пользователя:', error);
    res.status(500).send('Внутренняя ошибка сервера');
    }
}

    async getAvailableBooks(req, res) {
    try {
        const query = `
        SELECT * FROM books
        WHERE id NOT IN (
            SELECT book_id FROM borrowings WHERE date_to IS NULL
        )
        `;
        const result = await this.pool.query(query);

        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении доступных книг:', error);
        res.status(500).send('Внутренняя ошибка сервера');
    }
    }
}

module.exports = BorrowingsController;
    