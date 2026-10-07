const pool = require("../config/db");

const getAllCategories = async () => {
    const result = await pool.query(`
    SELECT
      id,
      name,
      slug,
      description,
      status,
      created_at,
      updated_at
    FROM categories
    ORDER BY id DESC
  `);

    return result.rows;
};

const getCategoryById = async (id) => {
    const result = await pool.query(
        `
      SELECT
        id,
        name,
        slug,
        description,
        status,
        created_at,
        updated_at
      FROM categories
      WHERE id = $1
    `,
        [id]
    );

    return result.rows[0];
};

const createCategory = async ({
    name,
    slug,
    description,
}) => {
    const result = await pool.query(
        `
      INSERT INTO categories (
        name,
        slug,
        description
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        name,
        slug,
        description,
        status,
        created_at,
        updated_at
    `,
        [
            name,
            slug,
            description || null,
        ]
    );

    return result.rows[0];
};

const updateCategory = async (
    id,
    {
        name,
        slug,
        description,
        status,
    }
) => {
    const result = await pool.query(
        `
      UPDATE categories
      SET
        name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        description = COALESCE($3, description),
        status = COALESCE($4, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING
        id,
        name,
        slug,
        description,
        status,
        created_at,
        updated_at
    `,
        [
            name,
            slug,
            description,
            status,
            id,
        ]
    );

    return result.rows[0];
};

const deleteCategory = async (id) => {
    const result = await pool.query(
        `
      UPDATE categories
      SET
        status = 0,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id
    `,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};