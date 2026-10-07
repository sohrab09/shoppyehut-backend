require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");
const runMigrations = require("./scripts/migrate");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await pool.query("SELECT 1");

        console.log("Database connection verified");

        await runMigrations();

        app.listen(PORT, () => {
            console.log(
                `Server running on http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Failed to start server:",
            error
        );

        await pool.end();

        process.exit(1);
    }
};

startServer();