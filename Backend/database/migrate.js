const fs = require('fs');
const path = require('path');
const { initializeDatabase, execute, query } = require('./connection');
const logger = require('../utils/logger');

/**
 * Run database migrations
 */
const runMigrations = async () => {
  try {
    await initializeDatabase();
    
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    logger.info(`Found ${files.length} migration files`);

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      logger.info(`Running migration: ${file}`);
      
      // Remove comments and split by semicolon
      const cleanedSql = sql
        .split('\n')
        .map(line => {
          // Remove single-line comments
          const commentIndex = line.indexOf('--');
          if (commentIndex !== -1) {
            return line.substring(0, commentIndex).trim();
          }
          return line.trim();
        })
        .filter(line => line.length > 0 && !line.startsWith('--'))
        .join('\n');

      // Split by semicolon and execute each statement
      const statements = cleanedSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        if (statement.length > 0) {
          await execute(statement);
        }
      }
      
      logger.info(`Migration ${file} completed`);
    }

    logger.info('All migrations completed successfully');
  } catch (error) {
    logger.error('Migration error:', error);
    throw error;
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      logger.info('Migrations completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations };

