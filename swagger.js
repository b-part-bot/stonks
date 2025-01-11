const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Stonks API',
        version: '1.0.0',
        description: 'API documentation for the Stonks project',
    },
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // Path to the API routes in your app
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;