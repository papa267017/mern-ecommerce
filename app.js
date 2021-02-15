const express = require('express');
const app = express();

const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors');
require("dotenv").config();
// imports routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product'); 
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected from atlas !!"));

// moiddlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

const port = process.env.PORT || 8000;
app.listen(port, ()=>{
	console.log(`Server is running on port ${port}`);
}) 

