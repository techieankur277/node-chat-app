const UserService = require('../service/user.service');


class UserController {

    async signUp(req, res) {
        try {
            const user = await UserService.signUp(req.body);
            res.json({ ...user });
        } catch (error) {
            res.status(500).json({ success: false, message: 'While signup', error });
        }
    }

    async login(req, res) {
        try {
            const login = await UserService.login(req.body);
            res.json({ ...login });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error creating user', error });
        }
    }
}

module.exports = new UserController();
