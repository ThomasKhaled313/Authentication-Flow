const errorHanlder = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || "FAIL";
    const message = err.message || "Something went wrong";

    res.status(statusCode).json({
        status,
        message
    });
};

module.exports = errorHanlder;