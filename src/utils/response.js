const successResponse = (
    res,
    data = null,
    message = "Success",
    statusCode = 200
) => {
    return res.status(statusCode).json({
        success: true,
        statusCode,
        message,
        data,
    });
};

const errorResponse = (
    res,
    message = "Something went wrong",
    statusCode = 500
) => {
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
};

module.exports = {
    successResponse,
    errorResponse,
};