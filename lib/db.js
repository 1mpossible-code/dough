import Database from 'better-sqlite3';

const db = new Database('./db.sqlite', { verbose: console.log });

db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      details TEXT,
      postingDate DATE NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      balance REAL,
      category TEXT
    );
  `);

export default db;

// (details, postingDate, description, amount, type, balance)