const User = require('../models/user.model');
const { incryptPassword, decriptPassword, createToken } = require('../utils/helper.utils');
const { Session } = require('../models/session.model');


class UserService {
    constructor() {
        this.Model = User
    }

    async signUp(userDto) {
        try {
            const isEmailExists = await this.Model.findOne({
                email: userDto?.email
            }, { _id: 0, email: 1 }).lean().exec();

            if (isEmailExists) {
                return {
                    statusCode: 400,
                    error: true,
                    message: 'Email already exists',
                    data: null
                }
            }

            userDto.password = await incryptPassword(userDto.password);
            await this.Model.create(userDto);
            return {
                error: false,
                message: 'User registered successfully',
                data: null
            };
        } catch (error) {
            console.error('Error :', error.message);
        }
    }

    async login(userDto) {
        try {
            const isEmailExists = await this.Model.findOne({
                email: userDto?.email
            }, { email: 1, password: 1 }).lean().exec();

            if (!isEmailExists) {
                return {
                    statusCode: 400,
                    error: true,
                    message: 'User does not exists',
                    data: null
                }
            }

            const userId = isEmailExists._id?.toString();
            const dbPassword = isEmailExists?.password;
            const isValidPassword = await decriptPassword(userDto.password, dbPassword);

            if (!isValidPassword) {
                return {
                    error: true,
                    statusCode: 400,
                    message: 'Either email password is incorrect, please check and retry'
                }
            }

            const createSession = await Session.create({ userId: userId, type: 1 });
            const sessionId = createSession._id?.toString();
            const authToken = createToken(userId, sessionId);

            if (authToken) {
                return {
                    error: false,
                    statusCode: 200,
                    message: 'User loged in successfully',
                    data: { authToken }
                }
            } else {
                return {
                    error: true,
                    statusCode: 500,
                    message: 'Internal server error, Please try again!',
                    data: null
                }
            }
        } catch (error) {
            console.error('Error :', error.message);
        }
    }
}

module.exports = new UserService(); 
