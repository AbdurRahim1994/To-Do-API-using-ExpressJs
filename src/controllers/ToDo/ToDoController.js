const ToDoModel = require('../../models/ToDo/ToDoModel');
const userModel = require('../../models/user/userModel');
const asyncHandler = require('express-async-handler');

exports.createToDo = asyncHandler(async (req, res) => {
    const { ToDoSubject, ToDoDescription, ToDoStatus } = req.body;
    const userEmail = req.user;
    const user = await userModel.findOne({ email: userEmail })
    if (user.length <= 0) {
        throw new Error('User Not Found');
    }
    else {
        const userId = user._id;

        const reqPayload = {
            userId: userId,
            userName: user.firstName + " " + user.lastName,
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
    }
});

exports.updateToDo = async function (req, res) {
    const toDoId = req.params.id;
    const updatedAt = Date.now();
    const userEmail = req.user;

    const user = await userModel.findOne({ email: userEmail });

    const toDoList = await ToDoModel.findOne({ _id: toDoId })
    if (toDoList.length <= 0) {
        throw new Error('To Do List Not Found');
    }
    else {
        if (user._id == toDoList.userId) {

            const reqPayload = {
                ToDoSubject: toDoList.ToDoSubject || req.body.ToDoSubject,
                ToDoDescription: toDoList.ToDoDescription || req.body.ToDoDescription,
                updatedAt: updatedAt
            }

            ToDoModel.updateOne({ _id: toDoId }, { $set: reqPayload }, { upsert: true }, (err, result) => {
                if (err) {
                    throw new Error(err.message);
                }
                else {
                    res.status(200).json({ message: "Updated Successfully", data: result })
                }
            })
        }
        else {
            throw new Error('Unauthorized User, you can not update this data');
        }
    }
};

exports.selectAllToDo = async function (req, res) {
    const userEmail = req.user;
    const user = await userModel.findOne({ email: userEmail }).select('userName')

    ToDoModel.find({ userName: user.userName }, (err, data) => {
        if (err) {
            res.status(404).json({ message: err.message })
        }
        else {
            res.status(200).json({ message: "Successful", data: data });
        }
    })
};

exports.selectToDoByStatus = async (req, res) => {
    const userEmail = req.user;
    const user = await userModel.findOne({ email: userEmail }).select('userName') // _id selected by default
    const toDoStatus = req.params.status;

    ToDoModel.find({ userName: user.userName, ToDoStatus: toDoStatus }, (err, data) => {
        if (err) {
            res.status(404).json({ message: err.message })
        }
        else {
            res.status(200).json({ message: "Successful", data: data });
        }
    })
};

exports.updateToDoStatus = async (req, res) => {
    const userEmail = req.user;
    const user = await userModel.findOne({ email: userEmail }).select('userName')

    const toDoId = req.params.id;
    const toDoStatusData = req.body;

    ToDoModel.updateOne({ userName: user.userName, _id: toDoId }, { $set: toDoStatusData }, (err, data) => {
        if (err) {
            res.status(400).json({ message: err.message })
        }
        else {
            res.status(200).json({ message: "Successful", data: data });
        }
    })

};

exports.selectToDoByDate = async (req, res) => {
    const userEmail = req.user;
    const user = await userModel.findOne({ email: userEmail }).select('userName');

    const { fromDate, toDate } = req.query;
    console.log(fromDate)
    console.log(toDate)

    ToDoModel.find({ userName: user.userName, createdAt: { $gte: fromDate, $lte: toDate } }, (err, data) => {
        if (err) {
            res.status(404).json({ message: err.message })
        }
        else {
            res.status(200).json({ message: "Successful", data: data });
        }
    })
}