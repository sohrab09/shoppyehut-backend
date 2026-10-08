require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");
const runMigrations = require("./scripts/migrate");

const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try {
        await pool.query("SELECT 1");
        console.log("Database connection verified");

        await runMigrations();
        console.log("Database migrations completed successfully.");

        const server = app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Process ID: ${process.pid}`);
        });

        server.on("error", (error) => {
            console.error("HTTP Server Error:", error);
            process.exit(1);
        });

        const shutdown = async (signal) => {
            console.log(`${signal} received. Shutting down gracefully...`);

            server.close(async () => {
                try {
                    await pool.end();
                    console.log("PostgreSQL connection pool closed.");
                    process.exit(0);
                } catch (error) {
                    console.error("Error during shutdown:", error);
                    process.exit(1);
                }
            });
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    } catch (error) {
        console.error("Failed to start server:", error);

        await pool.end().catch(() => { });

        process.exit(1);
    }
};

startServer();

process.on("uncaughtException", (error) => {
    console.error("UNCAUGHT EXCEPTION:", error);
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    console.error("UNHANDLED REJECTION:", reason);
    process.exit(1);
});