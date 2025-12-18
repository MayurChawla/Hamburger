/**
 * Validation utilities
 */

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateRequired = (value, fieldName) => {
  if (value === null || value === undefined || value === '') {
    throw new Error(`${fieldName} is required`);
  }
};

const validateStringLength = (value, min, max, fieldName) => {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  if (value.length < min) {
    throw new Error(`${fieldName} must be at least ${min} characters`);
  }
  if (max && value.length > max) {
    throw new Error(`${fieldName} must be at most ${max} characters`);
  }
};

const validateNumber = (value, min, max, fieldName) => {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`${fieldName} must be a number`);
  }
  if (min !== undefined && num < min) {
    throw new Error(`${fieldName} must be at least ${min}`);
  }
  if (max !== undefined && num > max) {
    throw new Error(`${fieldName} must be at most ${max}`);
  }
  return num;
};

const validateEnum = (value, allowedValues, fieldName) => {
  if (!allowedValues.includes(value)) {
    throw new Error(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
  }
};

module.exports = {
  validateEmail,
  validateRequired,
  validateStringLength,
  validateNumber,
  validateEnum,
};

