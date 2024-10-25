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
        const updateBorrowingQuery = `
          UPDATE borrowings
          SET date_to = CURRENT_DATE
          WHERE book_id = $1 AND user_id = $2 AND date_to IS NULL
          RETURNING *
        `;
        const updateBorrowingResult = await this.pool.query(updateBorrowingQuery, [book_id, user_id]);
  
        if (updateBorrowingResult.rowCount === 0) {
          return res.status(400).json({ error: 'У вас нет невозвращенных экземпляров этой книги' });
        }
  
        res.json({ message: 'Книга успешно возвращена' });
      } catch (error) {
        console.error('Ошибка при возврате книги:', error);
        res.status(500).send('Внутренняя ошибка сервера');
      }
    }
  
    async getMyBooks(req, res) {
      const user_id = req.params.user_id;
  
      try {
        const query = `
          SELECT books.*
          FROM books
          JOIN borrowings ON books.id = borrowings.book_id
          WHERE borrowings.user_id = $1 AND borrowings.date_to IS NULL
        `;
        const result = await this.pool.query(query, [user_id]);
  
        res.json(result.rows);
      } catch (error) {
        console.error('Ошибка при получении книг пользователя:', error);
        res.status(500).send('Внутренняя ошибка сервера');
      }
    }
  }
  
  module.exports = BorrowingsController;
  