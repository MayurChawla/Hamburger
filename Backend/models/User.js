const bcrypt = require('bcryptjs');
const { query, queryOne, execute } = require('../database/connection');
const { NotFoundError, ConflictError } = require('../utils/errors');
const logger = require('../utils/logger');

class User {
  /**
   * Find user by ID
   */
  static async findById(id) {
    const user = await queryOne(
      'SELECT id, username, email, role, employee_id, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return user || null;
  }

  /**
   * Find user by username or email
   */
  static async findByUsernameOrEmail(usernameOrEmail) {
    const user = await queryOne(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [usernameOrEmail, usernameOrEmail]
    );
    return user || null;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const user = await queryOne(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return user || null;
  }

  /**
   * Create a new user
   */
  static async create(userData) {
    const { username, email, password, role = 'employee', employeeId = null } = userData;

    // Check if user already exists
    const existingUser = await this.findByUsernameOrEmail(username);
    if (existingUser) {
      throw new ConflictError('User with this username or email already exists');
    }
    // Also check by email
    const existingByEmail = await this.findByEmail(email);
    if (existingByEmail) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate ID
    const id = Date.now().toString();

    await execute(
      'INSERT INTO users (id, username, email, password, role, employee_id) VALUES (?, ?, ?, ?, ?, ?)',
      [id, username, email, hashedPassword, role, employeeId]
    );

    const user = await this.findById(id);
    logger.info(`User created: ${username}`);
    return user;
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Update user
   */
  static async update(id, updates) {
    const allowedFields = ['username', 'email', 'role', 'employee_id'];
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return await this.findById(id);
  }

  /**
   * Delete user
   */
  static async delete(id) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }

    await execute('DELETE FROM users WHERE id = ?', [id]);
    logger.info(`User deleted: ${id}`);
    return user;
  }

  /**
   * Get all users (with pagination)
   */
  static async findAll(limit = 100, offset = 0) {
    return await query(
      'SELECT id, username, email, role, employee_id, created_at, updated_at FROM users LIMIT ? OFFSET ?',
      [limit, offset]
    );
  }
}

module.exports = User;

