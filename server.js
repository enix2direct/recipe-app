const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.post('/recipes', (req, res) => {
  const recipeTitle = req.body.title; // Get the form input
  res.send(`Added recipe: ${recipeTitle}`); // Temporary response
});
app.listen(3000, () => console.log('Server running on port 3000'));