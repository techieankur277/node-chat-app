const express = require('express');
const bodyParser = require('body-parser');
const { swaggerDocs } = require('./utils/swagger.utils');
const colorette = require('colorette');
const userRoutes = require('./routes/user.route');
const MongoDBService = require('./utils/db.utils');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const mongodb = new MongoDBService(process.env.MONGO_URI);

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/v1/users', userRoutes);

// cors handling:

app.use(cors());

// mongo connect:
mongodb.connect();


// Swagger
swaggerDocs(app, PORT);

// Start server
app.listen(PORT, () => {
    console.log(colorette.green(`SERVER:  running on ${process.env.LOCAL_HOST}${PORT}`));
    console.log(colorette.yellow(`SWAGGER:  running on ${process.env.LOCAL_HOST}${PORT}/api-docs`));
});

module.exports = app;
