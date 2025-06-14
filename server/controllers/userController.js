const userBL = require('../bl/userBL');
const {generateToken} = require('../utils/utils');

const userController = {

// controller
async signup(req, res) {
    try {
        const userData = req.body;

        // אם יש תמונה מצורפת
        if (req.file) {
            // נשתמש בשם הקובץ בלבד עם נתיב יחסי – זה מה שייבנה בצד הקליינט
            userData.profileImage = `uploads/${req.file.filename}`;
        }

        const user = await userBL.signup(userData);

        const token = generateToken({ id: user.id, role: user.role });

        res.status(200).json({ user, token });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(400).json({ error: error.message });
    }
}

,

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await userBL.login(username, password);
            if (user) {
                const token = generateToken({id: user.id, role: user.role});
                res.status(200).json({ user, token });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getUserById(req, res) {
        try {
            const user = await userBL.getUserById(req.params.id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async updateUser(req, res) {
        try {
            const user = await userBL.updateUser(req.params.id, req.body);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async deleteUser(req, res) {
        try {
            const result = await userBL.deleteUser(req.params.id);
            if (result) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getAllUsers(req, res) {
        try {
            const users = await userBL.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getUsersByParams(req, res) {
        try {
            const params = req.query; 
            const users = await userBL.getUsersByParams(params);
            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

};

module.exports = userController;