const userModel = require('../../models/user/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generating Token
const generateToken = function (email) {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

exports.createUser = (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, userName } = req.body;

        if (!firstName || !lastName || !email || !phone || !password || !userName) {
            throw new Error('Please fill up all required fields');
        }
        else {
            const userEmailExists = userModel.find({ email: email });
            const userMobileNoExists = userModel.findOne({ phone });

            if (userEmailExists.count() > 0) {
                res.status(400);
                throw new Error('User already registered with this email');
            }

            if (userMobileNoExists.count() > 0) {
                res.status(400);
                throw new Error('User already registered with this mobile no')
            }

            if (password.length < 8) {
                res.status(400);
                throw new Error('Password must be at least 8 characters');
            }
            else {
                let imageData = {};
                if (req.file) {
                    imageData = {
                        fileName: req.file.originalname,
                        filePath: req.file.path,
                        fileType: req.file.mimetype,
                        fileSize: req.file.size
                    }
                }

                // const reqPayload = {
                //     firstName: firstName,
                //     lastName: lastName,
                //     email: email,
                //     phone: phone,
                //     password: password,
                //     userName: userName,
                //     photo: imageData
                // }

                // userModel.create(reqPayload, (error, data) => {
                //     if (error) {
                //         res.status(400).json({ message: 'User creation failed', data: error })
                //     }
                //     else {
                //         res.status(200).json({ message: 'User created successfully', data: data })
                //     }
                // });

                const user = userModel.create({
                    firstName,
                    lastName,
                    phone,
                    email,
                    password,
                    userName,
                    photo: imageData
                });

                if (user) {
                    res.status(201).json({ message: "User created successfully", data: user });
                }
                else {
                    res.status(400).json({ message: "User creation failed" })
                }
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.userLogin = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        res.status(404);
        throw new Error('Please provide email or password');
    }
    else {
        const userExists = await userModel.find({ userName: userName });
        const userPass = userExists.map(a => a.password);
        // console.log(userPass)
        // console.log(password)
        //const userExists = await userModel.findOne({ userName: userName });

        // First Process
        if (userExists.length <= 0) {
            res.status(404);
            throw new Error('User Not Found, Please Sign up first');
        }
        else {
            bcrypt.compare(password, userPass[0], (err, data) => {
                console.log(data)
                if (data == true) {
                    const token = generateToken(userExists[0]['email']);
                    res.cookie("token", token, {
                        path: '/',
                        httpOnly: true,
                        sameSite: "none",
                        expires: new Date(Date.now() + 1000 * 2592000) // 30 Days
                    })
                    res.status(200).json({ message: "Successfully Login", token: token, data: userExists });
                }
                else {
                    res.status(400).json({ message: "Password Incorrect" });
                }
            });

            // bcrypt.compare(password, userExists[0]['password'], (err, data) => {
            //     console.log(data)
            //     if (data == true) {
            //         const token = generateToken(userExists[0]['email']);
            //         res.cookie("token", token, {
            //             path: '/',
            //             httpOnly: true,
            //             sameSite: "none",
            //             expires: new Date(Date.now() + 1000 * 2592000) // 30 Days
            //         })
            //         res.status(200).json({ message: "Successfully Login", token: token, data: userExists });
            //     }
            //     else {
            //         res.status(400).json({ message: "Password Incorrect" });
            //     }
            // });

        }

        // Second Process
        // if (userExists.length > 0) {
        //     bcrypt.compare(password, userPass[0], (err, result) => {
        //         console.log(result);
        //         if (result == true) {
        //             const token = generateToken(userExists[0]['email']);
        //             res.cookie("token", token, {
        //                 path: '/',
        //                 httpOnly: true,
        //                 sameSite: "none",
        //                 expires: new Date(Date.now() + 1000 * 2592000) // 30 Days
        //             })
        //             res.status(200).json({ message: "Successfully Login", token: token, data: userExists });
        //         }
        //         else {
        //             res.status(400).json({ message: "Password Incorrect" });
        //         }
        //     })
        // }
        // else {
        //     res.status(400);
        //     throw new Error('User Not Found, Please Login First');
        // }
    }
});

exports.updateUser = (req, res) => {
    const { firstName, lastName, phone, city, DOB, email } = req.body;
    const userEmail = req.user;
    const updatedAt = Date.now();

    const userExists = userModel.findOne({ email: userEmail });
    if (userExists.length <= 0) {
        res.status(404);
        throw new Error('User Not Found, Please Login');
    }
    else {
        let imageData = {};
        if (req.file) {
            imageData = {
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileType: req.file.mimetype,
                fileSize: req.file.size
            }
        }
        const reqPayload = {
            firstName: firstName || firstName,
            lastName: lastName || lastName,
            phone: phone || phone,
            city: city || city,
            DOB: DOB || DOB,
            photo: Object.keys(imageData).length === 0 ? userExists?.photo : imageData,
            updatedAt: updatedAt
        }

        userModel.updateOne({ email: userEmail }, { $set: reqPayload }, { upsert: true }, (err, data) => {
            if (err) {
                res.status(400);
                throw new Error(err.message);
            }
            else {
                res.status(200).json({ message: "Updated Successfully", data: data })
            }
        })
    }
};

exports.getAllUser = (req, res) => {
    try {

        userModel.find({}, { createdAt: 0, updatedAt: 0, _id: 0, password: 0, photo: 0 }, (error, data) => {
            if (error) {
                throw new Error(error.message);
            }
            else {
                res.status(200).json({ message: "Successful", data: data })
            }
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getUserById = asyncHandler(async function (req, res) {
    const userId = req.query.id;

    const user = await userModel.findById(userId);

    const { _id, firstName, lastName, email, phone } = user;

    res.status(200).json({ message: "Successful", _id, firstName, lastName, email, phone })
});

exports.userLogOut = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        expires: new Date(0)
    });

    res.status(200).json({ message: "Successfully Logged Out" });
});
