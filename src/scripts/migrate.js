require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const migrationsPath = path.join(__dirname, "../migrations");

const runMigrations = async () => {
    const client = await pool.connect();

    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        migration VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

        const files = fs
            .readdirSync(migrationsPath)
            .filter((file) => file.endsWith(".sql"))
            .sort();

        for (const file of files) {
            const existingMigration = await client.query(
                `
          SELECT id
          FROM schema_migrations
          WHERE migration = $1
        `,
                [file]
            );

            if (existingMigration.rows.length > 0) {
                continue;
            }

            console.log(`Running migration: ${file}`);

            const sql = fs.readFileSync(
                path.join(migrationsPath, file),
                "utf8"
            );

            try {
                await client.query("BEGIN");

                await client.query(sql);

                await client.query(
                    `
            INSERT INTO schema_migrations (migration)
            VALUES ($1)
          `,
                    [file]
                );

                await client.query("COMMIT");

                console.log(`Migration completed: ${file}`);
            } catch (error) {
                await client.query("ROLLBACK");

                console.error(`Migration failed: ${file}`);
                throw error;
            }
        }

        console.log("Database migrations completed successfully.");
    } catch (error) {
        console.error("Database migration error:", error);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = runMigrations;

if (require.main === module) {
    runMigrations()
        .then(async () => {
            await pool.end();
            process.exit(0);
        })
        .catch(async () => {
            await pool.end();
            process.exit(1);
        });
}