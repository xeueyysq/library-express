class Books {
    constructor(pool) {
        this.pool = pool;
    }

    async getAllBooks () {
        try {
            const results = await this.pool.query(`
            select * from books
            order by id asc`);

            return results.rows;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
}

module.export = Books;