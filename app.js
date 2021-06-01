const express = require('express');
require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose")
const cors = require("cors")
const indexRouter = require('./routes/index');
const {emailInternalHelper}= require("./helpers/email")
// require("./helpers/passport");


mongoose
	.connect(process.env.MONGODB_URI, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log(`MongoDB database connection established successfully!`);
		// require("./testing/testSchema");
        emailInternalHelper.createTemplatesIfNotExists();
	})
	.catch((err) => console.error("Could not connect to database!", err));

const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended: true }));
// app.use(express.json());
app.use(logger('dev'));
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(passport.initialize());
app.use('/api', indexRouter);


module.exports = app;
