const categoryService = require("../services/category.service");
const {
    successResponse,
    errorResponse,
} = require("../utils/response");

const getCategories = async (req, res, next) => {
    try {
        const categories =
            await categoryService.getAllCategories();

        return successResponse(
            res,
            categories,
            "Categories fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

const getCategory = async (req, res, next) => {
    try {
        const category =
            await categoryService.getCategoryById(
                req.params.id
            );

        if (!category) {
            return errorResponse(
                res,
                "Category not found",
                404
            );
        }

        return successResponse(
            res,
            category,
            "Category fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const {
            name,
            slug,
            description,
        } = req.body;

        if (!name || !slug) {
            return errorResponse(
                res,
                "Name and slug are required",
                400
            );
        }

        const category =
            await categoryService.createCategory({
                name,
                slug,
                description,
            });

        return successResponse(
            res,
            category,
            "Category created successfully",
            201
        );
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const category =
            await categoryService.updateCategory(
                req.params.id,
                req.body
            );

        if (!category) {
            return errorResponse(
                res,
                "Category not found",
                404
            );
        }

        return successResponse(
            res,
            category,
            "Category updated successfully"
        );
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const category =
            await categoryService.deleteCategory(
                req.params.id
            );

        if (!category) {
            return errorResponse(
                res,
                "Category not found",
                404
            );
        }

        return successResponse(
            res,
            category,
            "Category deleted successfully"
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
};