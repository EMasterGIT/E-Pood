// swagger.js
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");



const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rimi E-shop API",
      version: "1.0.0",
      description: "API for managing users, products, orders, and carts in Rimi e-shop"
    },
    servers: [
      {
        url: "http://localhost:3001/api",
        description: "Development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Kasutaja: {
          type: "object",
          properties: {
            KasutajaID: { type: "integer" },
            Nimi: { type: "string" },
            Email: { type: "string", format: "email" },
            Telefoninumber: { type: "string" },
            Parool: { type: "string" },
            Roll: { type: "string", enum: ["user", "admin"] }
          },
          required: ["Nimi", "Email", "Parool"]
        },
        Kuller: {
          type: "object",
          properties: {
            KullerID: { type: "integer" },
            Nimi: { type: "string" },
            Telefoninumber: { type: "string" },
            Tähtaeg: { type: "string", format: "date-time" }
          }
        },
        Ostukorv: {
          type: "object",
          properties: {
            OstukorvID: { type: "integer" },
            KasutajaID: { type: "integer" },
            Staatus: { type: "string", enum: ["Aktiivne", "Kinnitatud"] }
          },
          required: ["KasutajaID"]
        },
        OstukorviToode: {
          type: "object",
          properties: {
            OstukorviToodeID: { type: "integer" },
            OstukorvID: { type: "integer" },
            ToodeID: { type: "integer" },
            Kogus: { type: "integer" },
            Hind: { type: "number", format: "decimal" }
          },
          required: ["OstukorvID", "ToodeID", "Kogus", "Hind"]
        },
        Teenindaja: {
          type: "object",
          properties: {
            TeenindajaID: { type: "integer" },
            Nimi: { type: "string" },
            TellimusID: { type: "integer" },
            KullerID: { type: "integer" }
          },
          required: ["TellimusID"]
        },
        Tellimus: {
          type: "object",
          properties: {
            TellimusID: { type: "integer" },
            KasutajaID: { type: "integer" },
            OstukorvID: { type: "integer" },
            KullerID: { type: "integer" },
            Staatus: { type: "string" },
            Asukoht: { type: "string" }
          },
          required: ["KasutajaID", "Asukoht"]
        },
        Toode: {
          type: "object",
          properties: {
            ToodeID: { type: "integer" },
            Nimi: { type: "string" },
            Kirjeldus: { type: "string" },
            Hind: { type: "number", format: "decimal" },
            Kategooria: { type: "string" },
            Laoseis: { type: "integer" },
            PiltURL: { type: "string", format: "uri" }
          },
          required: ["Nimi", "Hind"]
        }
      }
    },
    
    security: [
      {
        bearerAuth: []
      }
    ]

  },
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
