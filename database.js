const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('recipes.db');
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY, title TEXT)');
});
module.exports = db;