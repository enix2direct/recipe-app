const express = require('express');
const app = express();
app.use(express.static('public')); // Serve static files
app.use(express.urlencoded({ extended: true })); // Parse form data
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.listen(3000, () => console.log('Server running on port 3000'));