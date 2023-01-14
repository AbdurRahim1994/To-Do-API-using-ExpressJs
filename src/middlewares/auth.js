const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const userModel = require('../models/user/userModel')

const authVerify = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401);
        throw new Error('User Unauthorized, Please Login First');
    }
    else {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const userExists = await userModel.findOne({ email: verified.email });
        if (userExists.length <= 0) {
            res.status(404);
            throw new Error('User Not Found, Please Sign Up First');
        }
        else {
            req.user = verified.email;
            next();
        }
    }
});

module.exports = authVerify;