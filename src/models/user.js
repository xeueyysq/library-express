class UserModel {
    constructor(pool) {
        this.pool = pool;
    }

    async getAllUsers() {
        const query = 'SELECT * FROM users';
        const result = await this.pool.query(query);
        return result.rows;
    }

    async getUserById(userId) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const values = [userId];
        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async createUser(username, password, role) {
        const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *';
        const values = [username, password, role];
        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async createUserProfile(userId, lastName, firstName, birthDate) {
        const query = 'INSERT INTO user_profiles (user_id, last_name, first_name, birth_date) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [userId, lastName, firstName, birthDate];
        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async findUserByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';
        const values = [username];
        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async saveUser(username, password, role) {
        const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *';
        const values = [username, password, role];
        const result = await this.pool.query(query, values);
        return result.rows[0];
    }
}

module.exports = UserModel;
