const express = require('express');
const app = express();
const db = require('./database.js');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.post('/recipes', (req, res) => {
  const recipeTitle = req.body.title;
  db.run('INSERT INTO recipes (title) VALUES (?)', [recipeTitle], (err) => {
    if (err) {
      console.log('Error:', err); // Log errors
      res.send('Error adding recipe');
    } else {
      res.redirect('/');
    }
  });
});
app.get('/recipes', (req, res) => {
  db.all('SELECT * FROM recipes', (err, rows) => {
    if (err) {
      console.log('Fetch Error:', err); // Log fetch issues
      res.send('Error fetching recipes');
    } else {
      res.json(rows); // Send recipes as JSON
    }
  });
});
app.listen(3000, () => console.log('Server running on port 3000'));