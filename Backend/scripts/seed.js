const bcrypt = require('bcryptjs');
const { initializeDatabase, execute, query } = require('../database/connection');
const Employee = require('../models/Employee');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Seed initial data
 */
const seedData = async () => {
  try {
    await initializeDatabase();

    logger.info('Starting data seeding...');

    // Seed default users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const employeePassword = await bcrypt.hash('employee123', 10);

    // Check if users already exist
    const existingAdmin = await User.findByEmail('admin@example.com');
    if (!existingAdmin) {
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin',
        employeeId: null,
      });
      logger.info('Admin user created');
    }

    // Seed sample employees
    const sampleEmployees = [
      {
        name: 'John Doe',
        email: 'john.doe@company.com',
        department: 'Engineering',
        position: 'Senior Developer',
        salary: 95000,
        startDate: '2020-01-15',
        status: 'Active',
        location: 'New York',
        manager: 'Jane Smith',
        phone: '+1-555-0101',
        age: 30,
        class: 'A',
        subjects: ['Mathematics', 'Science', 'English'],
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        department: 'Engineering',
        position: 'Engineering Manager',
        salary: 120000,
        startDate: '2018-03-20',
        status: 'Active',
        location: 'New York',
        manager: 'Robert Johnson',
        phone: '+1-555-0102',
        age: 25,
        class: 'B',
        subjects: ['History', 'Geography', 'English'],
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        department: 'Sales',
        position: 'Sales Representative',
        salary: 65000,
        startDate: '2021-06-10',
        status: 'Active',
        location: 'Los Angeles',
        manager: 'Sarah Williams',
        phone: '+1-555-0103',
        age: 35,
        class: 'A',
        subjects: ['Mathematics', 'Physics', 'Chemistry'],
      },
    ];

    for (const empData of sampleEmployees) {
      const existing = await query(
        'SELECT id FROM employees WHERE email = ?',
        [empData.email]
      );
      if (existing.length === 0) {
        await Employee.create(empData);
        logger.info(`Employee created: ${empData.name}`);
      }
    }

    // Create employee user linked to first employee
    const firstEmployee = await query('SELECT id FROM employees LIMIT 1');
    if (firstEmployee.length > 0) {
      const existingEmployeeUser = await User.findByEmail('john@example.com');
      if (!existingEmployeeUser) {
        await User.create({
          username: 'john_doe',
          email: 'john@example.com',
          password: employeePassword,
          role: 'employee',
          employeeId: firstEmployee[0].id,
        });
        logger.info('Employee user created');
      }
    }

    // Seed some attendance records
    const employees = await query('SELECT id FROM employees LIMIT 3');
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      for (const emp of employees) {
        await execute(
          'INSERT OR IGNORE INTO attendance (employee_id, date, present) VALUES (?, ?, ?)',
          [emp.id, dateStr, Math.random() > 0.2 ? 1 : 0]
        );
      }
    }

    logger.info('Data seeding completed successfully');
  } catch (error) {
    logger.error('Error seeding data:', error);
    throw error;
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData()
    .then(() => {
      logger.info('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedData };

