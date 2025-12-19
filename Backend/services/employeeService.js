const Employee = require('../models/Employee');
const { NotFoundError, ValidationError, AuthorizationError } = require('../utils/errors');
const { validateEmail, validateRequired, validateNumber } = require('../utils/validation');
const logger = require('../utils/logger');

class EmployeeService {
  /**
   * Get all employees with filters, sorting, and pagination
   */
  static async getEmployees(filters = {}, sort = {}, pagination = {}, user = null) {
    // Both admin and employee can see all employees
    const result = await Employee.findAll(filters, sort, pagination);
    return result;
  }

  /**
   * Get employee by ID
   */
  static async getEmployeeById(id, user = null) {
    const employee = await Employee.findById(id);
    if (!employee) {
      throw new NotFoundError('Employee');
    }

    // Both admin and employee can access any employee data
    return employee;
  }

  /**
   * Create employee
   */
  static async createEmployee(employeeData, user = null) {
    // Only admins can create employees
    if (user && user.role !== 'admin') {
      throw new AuthorizationError('Only admins can create employees');
    }

    // Validation
    validateRequired(employeeData.name, 'Name');
    validateRequired(employeeData.email, 'Email');
    validateRequired(employeeData.department, 'Department');
    validateRequired(employeeData.position, 'Position');
    validateRequired(employeeData.salary, 'Salary');
    validateRequired(employeeData.startDate, 'Start date');

    if (!validateEmail(employeeData.email)) {
      throw new ValidationError('Invalid email format');
    }

    validateNumber(employeeData.salary, 0, undefined, 'Salary');

    if (employeeData.age !== undefined) {
      validateNumber(employeeData.age, 18, 100, 'Age');
    }

    const employee = await Employee.create(employeeData);
    logger.info(`Employee created: ${employee.name} (${employee.id})`);
    return employee;
  }

  /**
   * Update employee
   */
  static async updateEmployee(id, updates, user = null) {
    // Both admin and employee can update any employee data

    // Validation
    if (updates.email && !validateEmail(updates.email)) {
      throw new ValidationError('Invalid email format');
    }

    if (updates.salary !== undefined) {
      validateNumber(updates.salary, 0, undefined, 'Salary');
    }

    if (updates.age !== undefined) {
      validateNumber(updates.age, 18, 100, 'Age');
    }

    const employee = await Employee.update(id, updates);
    logger.info(`Employee updated: ${id}`);
    return employee;
  }

  /**
   * Delete employee
   */
  static async deleteEmployee(id, user = null) {
    // Only admins can delete employees
    if (user && user.role !== 'admin') {
      throw new AuthorizationError('Only admins can delete employees');
    }

    const employee = await Employee.delete(id);
    logger.info(`Employee deleted: ${id}`);
    return employee;
  }

  /**
   * Mark attendance
   */
  static async markAttendance(employeeId, date, present, user = null) {
    // Both admin and employee can mark attendance for any employee

    // Validation
    validateRequired(date, 'Date');
    if (typeof present !== 'boolean') {
      throw new ValidationError('Present must be a boolean');
    }

    const employee = await Employee.markAttendance(employeeId, date, present);
    logger.info(`Attendance marked for employee ${employeeId} on ${date}`);
    return employee;
  }
}

module.exports = EmployeeService;

