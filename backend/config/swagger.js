import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "FASYL PMO API",
            version: "1.0.0",
            description: "Project Workflow Management API",
        },

        servers: [
            {
                url: "http://localhost:5000/api/v1",
            },
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                },
            },
        },

        security: [
            {
                bearerAuth: [],
            },
        ],
    },

    apis: [
        "./backend/modules/**/*.js",
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;