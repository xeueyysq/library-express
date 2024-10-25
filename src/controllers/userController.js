class UserController {
    constructor(userModel) {
        this.userModel = userModel;
    }

    async getAllUsers(req, res) {
        try {
            const users = await this.userModel.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error(error);
        }
    }

    async getUserById(req, res) {
        const userId = req.params.id;
        try {
            const user = await this.userModel.getUserById(userId);
            if (user) {
                res.json(user);
            } else {
                res.status(404).send('Нет такого пользователя');
            }
        } catch (error) {
            console.error(error);
        }
    }

    async createUser(req, res) {
        const { username, password, role } = req.body;
        try {
            const newUser = await this.userModel.createUser(username, password, role);
            res.status(201).json(newUser);
        } catch (error) {
            console.error(error);
        }
    }

    async createUserProfile(req, res) {
        const { userId, lastName, firstName, birthDate } = req.body;
        try {
            const newUserProfile = await this.userModel.createUserProfile(userId, lastName, firstName, birthDate);
            res.status(201).json(newUserProfile);
        } catch (error) {
            console.error(error);
        }
    }
    
    async registerUser(req, res) {
        const { username, password, role } = req.body;
        try {
            const existingUser = await this.userModel.findUserByUsername(username);
            if (existingUser) {
                return res.status(400).json({ error: 'Пользователь уже существует' });
            }

            const newUser = await this.userModel.saveUser(username, password, role || 'читатель');
            res.status(201).json({ message: 'Регистрация прошла успешно', user: newUser });
        } catch (error) {
            console.error('Ошибка регистрации пользователя:', error);
            res.status(500).send('Внутренняя ошибка сервера');
        }
    }

    async loginUser(req, res) {
        const { username, password } = req.body;
        try {
            const user = await this.userModel.findUserByUsername(username);
            if (!user || user.password !== password) {
                return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
            }

            res.json({ message: 'Вход выполнен успешно', user });
        } catch (error) {
            console.error('Ошибка входа пользователя:', error);
            res.status(500).send('Внутренняя ошибка сервера');
        }
    }
}

module.exports = UserController;
