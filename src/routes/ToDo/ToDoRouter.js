const ToDoController = require('../../controllers/ToDo/ToDoController');
const express = require('express');
const ToDoRouter = express.Router();
const authVerify = require('../../middlewares/auth')

ToDoRouter.post('/createToDo', authVerify, ToDoController.createToDo);

module.exports = ToDoRouter;