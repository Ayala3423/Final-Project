const userBL = require('../bl/userBL');
const { generateToken } = require('../utils/utils');
const { generateRefreshToken } = require('../utils/utils');

const userController = {

    async signup(req, res) {
        try {
            const userData = req.body;

            // אם יש תמונה מצורפת
            if (req.file) {
                // נשתמש בשם הקובץ בלבד עם נתיב יחסי – זה מה שייבנה בצד הקליינט
                // userData.profileImage = `${req.file.filename}`;
                userData.profileImage = `/uploads/profileImages/${req.file.filename}`;
            }

            const user = await userBL.signup(userData);
            const token = generateToken({ id: user.id, role: user.role });
            const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

            res.status(200).json({ user, token, refreshToken });
        } catch (error) {
            console.error("Signup error:", error);
            res.status(400).json({ error: error.message });
        }
    },

    async login(req, res) {
        try {
            const { username, password, role } = req.body;
            const user = await userBL.login(username, password, role);
            if (user.role) {
                const token = generateToken({ id: user.id, role: role });
                const refreshToken = generateRefreshToken({ userId: user.id, role: role });

                res.status(200).json({
                    user: { ...user.dataValues, role: user.role },
                    token,
                    refreshToken
                });
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
            const id = req.params.id;

            // פרטי גוף הבקשה
            const data = { ...req.body };

            // אם יש קובץ תמונה - נוסיף אותו לשדות לעדכון
            if (req.file) {
                data.profileImage = `/uploads/profileImages/${req.file.filename}`;

                // data.profileImage = req.file.filename; // או req.file.path לפי איך שאת שומרת
            }

            const updatedUser = await userBL.updateUser(id, data);

            if (updatedUser) {
                res.status(200).json(updatedUser);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error("Error updating user:", error);
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
    },

    async getOrdersPerMonth(req, res) {
        try {
            console.log("Fetching orders per month for user:", req.user.id);

            const ownerId = req.user.id;
            const chartData = await userBL.getOrdersPerMonth(ownerId);
            res.status(200).json(chartData);
        }
        catch (error) {
            console.error("Error fetching orders per month:", error);
            res.status(400).json({ error: error.message });
        }
    }
    
};

module.exports = userController;