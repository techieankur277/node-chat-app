const jwt = require('jsonwebtoken');
const { red } = require('colorette');

const basicAuth = (req, res, next) => {
    const token = req.headers['authorization'];

    if (token && token.startsWith('Basic')) {
        const base64Credentials = token.slice(6);
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [username, password] = credentials.split(':');

        if (!username || !password) {
            console.log(red('Invalid Basic Auth credentials.'));
            return res.status(401).json({ message: 'Unauthorized: Invalid Basic Auth credentials' });
        }

        const USER_NAME = process.env.USER_NAME;
        const PASSWORD = process.env.PASSWORD;

        if (username === USER_NAME && password === PASSWORD) {
            return next();
        } else {
            return res.status(401).json({ message: 'Unauthorized: Invalid Basic Auth credentials' });
        }
    } else {
        return res.status(401).json({ message: 'Unauthorized: Basic Auth token missing' });
    }
};

const userSession = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token missing. Unauthorized access.' });
    }

    try {
        const cleanedToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded = jwt.verify(cleanedToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(red('Invalid token.'));
        res.status(403).json({ message: 'Invalid token. Unauthorized access.' });
    }
};

module.exports = { basicAuth, userSession };
