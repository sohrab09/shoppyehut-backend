const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const categoryRoutes = require("./routes/category.routes");

const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

const apiPrefix = "/api/v1";

app.get(`${apiPrefix}/health`, (req, res) => {
    res.status(200).json({
        success: true,
        statusCode: 200,
        message:
            "Shoppyehut LIFESTYLE E-COMMERCE API is running",
        timestamp: new Date().toISOString(),
    });
});

app.use(`${apiPrefix}/categories`, categoryRoutes);

app.use(notFound);

app.use(errorHandler);

module.exports = app;