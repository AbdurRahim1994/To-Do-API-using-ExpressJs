const ToDoModel = require('../../models/ToDo/ToDoModel');
const userModel = require('../../models/user/userModel');
const asyncHandler = require('express-async-handler');

exports.createToDo = asyncHandler(async (req, res) => {
    const { ToDoSubject, ToDoDescription, ToDoStatus } = req.body;
    const userEmail = req.user;
    console.log(userEmail)
    const user = userModel.findOne({ email: userEmail }, { email: 1 })
    //const userId = user._id;
    console.log(user)

    const reqPayload = {
        //userId: userId,
        userName: user.firstName + user.lastName,
        ToDoSubject: ToDoSubject,
        ToDoDescription: ToDoDescription,
        ToDoStatus: ToDoStatus
    }

    ToDoModel.create(reqPayload, (err, data) => {
        if (err) {
            res.status(400).json({ message: err.message })
        }
        else {
            res.status(201).json({ message: "Successful", data: data })
        }
    })
})