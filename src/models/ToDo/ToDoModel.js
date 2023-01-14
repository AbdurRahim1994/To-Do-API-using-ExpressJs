const mongoose = require('mongoose');
const { Schema } = mongoose

const ToDoSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'userModel'
    },

    userName: {
        type: String,
        required: [true, 'Please provide user name'],
        default: "N/A"
    },

    ToDoSubject: {
        type: String,
        is: [/^[A-Za-z]+$/, 'Subject allows only characters']
    },

    ToDoDescription: {
        type: String,
        allowNull: true,
        len: [1, 10]
    },

    ToDoStatus: {
        type: String,
        default: "Pending"
    }
}, { versionKey: false, timestamps: true })

const ToDoModel = mongoose.model('ToDoLists', ToDoSchema);
module.exports = ToDoModel;

