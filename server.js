// Require in the express and mongoose modules.
const express = require('express');
const mongoose = require('mongoose');

// Assign the invocation of the express module to a variable.
const app = express();
// Create a port using an environmental variable or local host.
const PORT = process.env.PORT || 3001;

// Middleware functionality for handling requests from the front-end.
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Express module uses the route logic in the routes folder.
app.use(require('./routes'));

// connect to the mongodb through the mongoose module.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network-api');

// Log the mongoose queries.
mongoose.set('debug', true);

// Express listens for the port to connect to the server.
app.listen(PORT, () => console.log(`Connection to localhost:${PORT} is successful!`));

