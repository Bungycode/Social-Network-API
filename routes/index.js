// Require express router
const router = require('express').Router();

// Import all of the API routes
const apiRoutes = require('./api');

// add prefix of '/api' to all of the api routes
router.use('/api', apiRoutes);

// 404 status error message
router.use((req, res) => {
  res.status(400).send('<h1> 404 error....</h1>');
});

// module exports router
module.exports = router;