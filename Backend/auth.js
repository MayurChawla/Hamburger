const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Sample users database (in a real app, this would come from a database)
// Initialize default users with hashed passwords
// Note: In production, these should be stored in a database
let users = [];

// Initialize default users (passwords: admin123 and employee123)
// These will be properly hashed when the module loads
let usersInitialized = false;

async function initializeUsers() {
  if (usersInitialized) return;
  
  const adminPassword = await bcrypt.hash('admin123', 10);
  const employeePassword = await bcrypt.hash('employee123', 10);
  
  users = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      employeeId: null,
    },
    {
      id: '2',
      username: 'john_doe',
      email: 'john@example.com',
      password: employeePassword,
      role: 'employee',
      employeeId: '1',
    },
  ];
  
  usersInitialized = true;
}

// Initialize users asynchronously
initializeUsers().catch(console.error);

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Hash password
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Compare password
async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Get user by username or email
function getUserByUsernameOrEmail(usernameOrEmail) {
  return users.find(
    (user) => user.username === usernameOrEmail || user.email === usernameOrEmail
  );
}

// Get user by ID
function getUserById(id) {
  return users.find((user) => user.id === id);
}

// Create new user
function createUser(userData) {
  const newUser = {
    id: String(users.length + 1),
    username: userData.username,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'employee',
    employeeId: userData.employeeId || null,
  };
  users.push(newUser);
  return newUser;
}

// Check if user has required role
function hasRole(user, requiredRole) {
  if (!user) return false;
  return user.role === requiredRole;
}

// Check if user is admin
function isAdmin(user) {
  return hasRole(user, 'admin');
}

// Check if user is employee
function isEmployee(user) {
  return hasRole(user, 'employee');
}

// Check if user can access employee data (admin can access all, employee can only access their own)
function canAccessEmployee(user, employeeId) {
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (isEmployee(user) && user.employeeId === employeeId) return true;
  return false;
}

module.exports = {
  users,
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  getUserByUsernameOrEmail,
  getUserById,
  createUser,
  hasRole,
  isAdmin,
  isEmployee,
  canAccessEmployee,
  JWT_SECRET,
};

