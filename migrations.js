const {pool} = require('../lib-express/db');

(async () => {
    try {
        await pool.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) NOT NULL CHECK (role IN ('библиотекарь', 'читатель'))
        );
        `);

        await pool.query(`
        CREATE TABLE readers (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            фамилия VARCHAR(50) NOT NULL,
            имя VARCHAR(50) NOT NULL,
            дата_рождения DATE
        );
        `);

        await pool.query(`
        CREATE TABLE books (
            id SERIAL PRIMARY KEY,
            автор VARCHAR(100) NOT NULL,
            название VARCHAR(200) NOT NULL,
            год_издания INTEGER,
            количество INTEGER NOT NULL DEFAULT 0
        );
        `);

        await pool.query(`
        CREATE TABLE borrowings (
            id SERIAL PRIMARY KEY,
            book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
            reader_id INTEGER REFERENCES readers(id) ON DELETE CASCADE,
            дата_выдачи DATE NOT NULL DEFAULT CURRENT_DATE,
            дата_возврата DATE
        );
        `);

        await pool.query(`
        -- Уменьшение количества при выдаче
        CREATE OR REPLACE FUNCTION decrease_book_quantity()
        RETURNS TRIGGER AS $$
        BEGIN
            UPDATE books SET количество = количество - 1 WHERE id = NEW.book_id;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        CREATE TRIGGER trg_decrease_book_quantity
        AFTER INSERT ON borrowings
        FOR EACH ROW
        WHEN (NEW.дата_возврата IS NULL)
        EXECUTE FUNCTION decrease_book_quantity();
        
        -- Увеличение количества при возврате
        CREATE OR REPLACE FUNCTION increase_book_quantity()
        RETURNS TRIGGER AS $$
        BEGIN
            UPDATE books SET количество = количество + 1 WHERE id = NEW.book_id;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        CREATE TRIGGER trg_increase_book_quantity
        AFTER UPDATE OF дата_возврата ON borrowings
        FOR EACH ROW
        WHEN (OLD.дата_возврата IS NULL AND NEW.дата_возврата IS NOT NULL)
        EXECUTE FUNCTION increase_book_quantity();        
        `);

        console.log('Все миграции успешно загружены')
    } catch (error) {
        console.error('Ошибка загрузки миграций', error);
    } finally {
        await pool.end();
    }
});