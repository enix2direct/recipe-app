const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('recipes.db');
db.serialize(() => {
  // Recipes table (unchanged)
  db.run('CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY, title TEXT)');
  // Drop old ingredients table (if it exists) and recreate with new columns
  db.run('DROP TABLE IF EXISTS ingredients');
  db.run('CREATE TABLE ingredients (id INTEGER PRIMARY KEY, recipe_id INTEGER, quantity REAL, unit TEXT, name TEXT, FOREIGN KEY(recipe_id) REFERENCES recipes(id))');
});
module.exports = db;