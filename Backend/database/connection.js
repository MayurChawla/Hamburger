const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const config = require('../config');
const logger = require('../utils/logger');

// Ensure data directory exists
const dataDir = path.dirname(config.database.path);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db = null;

/**
 * Initialize database connection
 */
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(
      config.database.path,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        if (err) {
          logger.error('Database connection error:', err);
          reject(err);
        } else {
          logger.info('Database connected successfully');
          // Enable foreign keys
          db.run('PRAGMA foreign_keys = ON');
          resolve(db);
        }
      }
    );
  });
};

/**
 * Get database instance
 */
const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
};

/**
 * Close database connection
 */
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve();
      return;
    }
    db.close((err) => {
      if (err) {
        logger.error('Error closing database:', err);
        reject(err);
      } else {
        logger.info('Database connection closed');
        db = null;
        resolve();
      }
    });
  });
};

/**
 * Execute a query and return results
 */
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDatabase().all(sql, params, (err, rows) => {
      if (err) {
        logger.error('Query error:', { sql, params, error: err.message });
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

/**
 * Execute a query and return first result
 */
const queryOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDatabase().get(sql, params, (err, row) => {
      if (err) {
        logger.error('Query error:', { sql, params, error: err.message });
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

/**
 * Execute a query (INSERT, UPDATE, DELETE)
 */
const execute = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    getDatabase().run(sql, params, function (err) {
      if (err) {
        logger.error('Execute error:', { sql, params, error: err.message });
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
};

/**
 * Begin a transaction
 */
const beginTransaction = () => {
  return execute('BEGIN TRANSACTION');
};

/**
 * Commit a transaction
 */
const commit = () => {
  return execute('COMMIT');
};

/**
 * Rollback a transaction
 */
const rollback = () => {
  return execute('ROLLBACK');
};

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase,
  query,
  queryOne,
  execute,
  beginTransaction,
  commit,
  rollback,
};

