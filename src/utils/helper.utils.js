const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const incryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);
    return hashedPwd;
}

const decriptPassword = async (userPwd, dbPwd) => {
    if (!userPwd || !dbPwd) {
        return {
            error: true,
            message: 'user password and db password required'
        }
    }

    return await bcrypt.compare(userPwd, dbPwd);
}

const createToken = (userId, sessionId, type = 1) => {
    const payload = {
        userId,
        sessionId,
        type
    };

    const secretKey = process.env.JWT_SECRET_KEY;

    const token = jwt.sign(payload, secretKey, {
        algorithm: 'HS512',
        expiresIn: process.env.TOKEN_EXPIRE
    });

    return token;
};

module.exports = {
    incryptPassword,
    decriptPassword,
    createToken
}