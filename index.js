const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

//console.log(process.env);

// Express server
const app = express();

// Data Base
dbConnection();

// CORS
app.use(cors());

// Public directory
app.use(express.static('public'));

// Body reading and parsing
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Listen
app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
