const { pool } = require('./db');

(async () => {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('библиотекарь', 'читатель'))
        );
        `);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS books (
        id VARCHAR(50) PRIMARY KEY,
        author VARCHAR(100) NOT NULL,
        title VARCHAR(200) NOT NULL,
        poster TEXT,
        description TEXT,
        pagecount INTEGER NOT NULL,
        publish_date DATE,
        categories TEXT[]
    );
        `);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS borrowings (
        id SERIAL PRIMARY KEY,
        book_id VARCHAR(50) REFERENCES books(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date_from DATE NOT NULL DEFAULT CURRENT_DATE,
        date_to DATE
        );
        `);

        console.log('Все миграции успешно загружены');
    } catch (error) {
        console.error('Ошибка загрузки миграций', error);
    } finally {
        await pool.end();``
    }
})();