const express = require('express');
const dotEnv = require('dotenv');
const userRouter = require('./src/routes/user/userRouter');
const { readdirSync } = require('fs');
const errorHandler = require('./src/middlewares/errorHandler')
const app = express();

// Security Middleware Import
const mongoose = require('mongoose');
dotEnv.config({ path: './config.env' })
const morgan = require('morgan');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');

// Security Middleware Implement
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(morgan());
app.use(cookieParser())
app.use(helmet());
app.use(cors());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }))
// const multerObj = multer();
// app.use(multerObj.array())

// Routing
readdirSync('./src/routes/user').map(r => app.use('/api/v1', require(`./src/routes/user/${r}`))) //providing folder path whre js file are hosted
readdirSync('./src/routes/ToDo').map(r => app.use('/api/v1', require(`./src/routes/ToDo/${r}`)))
//app.use('/api/v1', userRouter);

// Error Handing Middleware
app.use(errorHandler);

// MongoDB Connection
const uri = process.env.DATABASE;
const option = { user: '', pass: '' };
mongoose.connect(uri, option).then(() => {
    // if (err) {
    //     console.log("Database Connection Failed");
    // }
    // else {
    //     console.log("Database Connected Successfully");
    // }
    console.log("Database Connected Successfully")
});
module.exports = app;