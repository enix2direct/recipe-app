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
  const ingredients = req.body.ingredients ? req.body.ingredients.split(',').map(i => i.trim()) : [];
  // Step 1: Insert the recipe
  db.run('INSERT INTO recipes (title) VALUES (?)', [recipeTitle], function(err) {
    if (err) {
      console.log('Error adding recipe:', err);
      return res.send('Error adding recipe');
    }
    const recipeId = this.lastID; // Get the new recipe's ID
    // Step 2: Insert each ingredient
    if (ingredients.length > 0) {
      const placeholders = ingredients.map(() => '(?, ?)').join(',');
      const values = ingredients.flatMap(ing => [recipeId, ing]);
      db.run(`INSERT INTO ingredients (recipe_id, name) VALUES ${placeholders}`, values, (err) => {
        if (err) {
          console.log('Error adding ingredients:', err);
          return res.send('Error adding ingredients');
        }
        res.redirect('/');
      });
    } else {
      res.redirect('/'); // No ingredients, just redirect
    }
  });
});
app.get('/recipes', (req, res) => {
  db.all('SELECT r.id, r.title, i.name AS ingredient FROM recipes r LEFT JOIN ingredients i ON r.id = i.recipe_id', (err, rows) => {
    if (err) {
      console.log('Fetch Error:', err);
      return res.send('Error fetching recipes');
    }
    // Group ingredients by recipe
    const recipes = {};
    rows.forEach(row => {
      if (!recipes[row.id]) {
        recipes[row.id] = { id: row.id, title: row.title, ingredients: [] };
      }
      if (row.ingredient) {
        recipes[row.id].ingredients.push(row.ingredient);
      }
    });
    res.json(Object.values(recipes));
  });
});
app.listen(3000, () => console.log('Server running on port 3000'));