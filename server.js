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
      res.send('Error adding recipe');
    } else {
      res.redirect('/'); // Back to the form
    }
  });
});
app.listen(3000, () => console.log('Server running on port 3000'));