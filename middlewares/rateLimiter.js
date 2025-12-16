const { rateLimit } = require('express-rate-limit');
const HttpStatusText = require('../utils/httpStatusText');

const requestLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: HttpStatusText.FAIL,
        message: "Too many requests. Try again later."
    }
})

module.exports = {
    requestLimiter
}