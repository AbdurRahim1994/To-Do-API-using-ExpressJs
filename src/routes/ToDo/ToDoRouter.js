const ToDoController = require('../../controllers/ToDo/ToDoController');
const express = require('express');
const ToDoRouter = express.Router();
const authVerify = require('../../middlewares/auth')

ToDoRouter.post('/createToDo', authVerify, ToDoController.createToDo);
ToDoRouter.post('/updateToDo/:id', authVerify, ToDoController.updateToDo);
ToDoRouter.get('/selectAllToDo', authVerify, ToDoController.selectAllToDo);
ToDoRouter.get('/selectToDoByStatus/:status', authVerify, ToDoController.selectToDoByStatus);
ToDoRouter.post('/updateToDoStatus/:id', authVerify, ToDoController.updateToDoStatus);
ToDoRouter.get('/selectToDoByDate', authVerify, ToDoController.selectToDoByDate);

module.exports = ToDoRouter;