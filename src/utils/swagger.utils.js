const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');

const swaggerDocs = (app, port) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        customCss: '.swagger-ui .topbar { display: none }',  // Optionally hide the top bar
        customSiteTitle: 'My API Docs',  // Custom title in the Swagger UI
        explorer: true // Optionally enable the Swagger UI "Explorer" mode (which shows more options)
    }));
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
};

module.exports = { swaggerDocs };
