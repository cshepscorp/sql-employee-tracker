const db = require('./db/connection');
const express = require('express'); // import express
const PORT = process.env.PORT || 3001;
const app = express();

// import routes
const apiRoutes = require('./routes/apiRoutes'); // Remember that you don't have to specify index.js in the path (e.g., ./routes/apiRoutes/index.js). If the directory has an index.js file in it, Node.js will automatically look for it when requiring the directory.

// add Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Add after Express middleware
app.use('/api', apiRoutes); // By adding the /api prefix here, we can remove it from the individual route expressions after we move them to their new home.


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });

// start the Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });