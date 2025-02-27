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
  const rawIngredients = req.body.ingredients ? req.body.ingredients.split(',').map(i => i.trim()) : [];
  const ingredients = rawIngredients.map(ing => {
    const parts = ing.split(' ').filter(Boolean); // Split on spaces, remove empties
    const quantity = parseFloat(parts[0]) || 0; // First part as number
    const unit = parts.length > 2 ? parts[1] : ''; // Second part as unit (if present)
    const name = parts.slice(parts.length > 2 ? 2 : 1).join(' '); // Rest as name
    return { quantity, unit, name };
  });
  db.run('INSERT INTO recipes (title) VALUES (?)', [recipeTitle], function(err) {
    if (err) {
      console.log('Error adding recipe:', err);
      return res.send('Error adding recipe');
    }
    const recipeId = this.lastID;
    if (ingredients.length > 0) {
      const placeholders = ingredients.map(() => '(?, ?, ?, ?)').join(',');
      const values = ingredients.flatMap(ing => [recipeId, ing.quantity, ing.unit, ing.name]);
      db.run(`INSERT INTO ingredients (recipe_id, quantity, unit, name) VALUES ${placeholders}`, values, (err) => {
        if (err) {
          console.log('Error adding ingredients:', err);
          return res.send('Error adding ingredients');
        }
        res.redirect('/');
      });
    } else {
      res.redirect('/');
    }
  });
});
app.get('/recipes', (req, res) => {
  db.all('SELECT r.id, r.title, i.quantity, i.unit, i.name FROM recipes r LEFT JOIN ingredients i ON r.id = i.recipe_id', (err, rows) => {
    if (err) {
      console.log('Fetch Error:', err);
      return res.send('Error fetching recipes');
    }
    const recipes = {};
    rows.forEach(row => {
      if (!recipes[row.id]) {
        recipes[row.id] = { id: row.id, title: row.title, ingredients: [] };
      }
      if (row.name) {
        recipes[row.id].ingredients.push({ quantity: row.quantity, unit: row.unit, name: row.name });
      }
    });
    res.json(Object.values(recipes));
  });
});
app.delete('/recipes/:id', (req, res) => {
  const recipeId = req.params.id;
  db.run('DELETE FROM ingredients WHERE recipe_id = ?', [recipeId], (err) => {
    if (err) {
      console.log('Error deleting ingredients:', err);
      return res.status(500).send('Error deleting ingredients');
    }
    db.run('DELETE FROM recipes WHERE id = ?', [recipeId], (err) => {
      if (err) {
        console.log('Error deleting recipe:', err);
        return res.status(500).send('Error deleting recipe');
      }
      res.status(200).send('Recipe deleted');
    });
  });
});
app.listen(3000, () => console.log('Server running on port 3000'));