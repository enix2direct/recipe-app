const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('recipes.db');
db.serialize(() => {
  // Recipes table (unchanged)
  db.run('CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY, title TEXT)');
  // New ingredients table
  db.run('CREATE TABLE IF NOT EXISTS ingredients (id INTEGER PRIMARY KEY, recipe_id INTEGER, name TEXT, FOREIGN KEY(recipe_id) REFERENCES recipes(id))');
});
module.exports = db;