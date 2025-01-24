const app = require('./app'); // Import your app instance
require('dotenv').config(); // Load environment variables

const PORT = process.env.PORT || 3000; // Default port

// Optional: Define a test route in case you want to verify the server directly
app.get('/', (req, res) => {
  res.send('Server is running successfully!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});