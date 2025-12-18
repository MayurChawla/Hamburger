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

    // Seed sample employees (all 12 from original data)
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
      {
        name: 'Sarah Williams',
        email: 'sarah.williams@company.com',
        department: 'Sales',
        position: 'Sales Manager',
        salary: 85000,
        startDate: '2019-09-05',
        status: 'Active',
        location: 'Los Angeles',
        manager: 'Robert Johnson',
        phone: '+1-555-0104',
        age: 28,
        class: 'C',
        subjects: ['Biology', 'Chemistry'],
      },
      {
        name: 'David Brown',
        email: 'david.brown@company.com',
        department: 'Marketing',
        position: 'Marketing Specialist',
        salary: 70000,
        startDate: '2022-02-14',
        status: 'Active',
        location: 'Chicago',
        manager: 'Emily Davis',
        phone: '+1-555-0105',
        age: 32,
        class: 'B',
        subjects: ['English', 'Art', 'Music'],
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@company.com',
        department: 'Marketing',
        position: 'Marketing Director',
        salary: 110000,
        startDate: '2017-11-30',
        status: 'Active',
        location: 'Chicago',
        manager: 'Robert Johnson',
        phone: '+1-555-0106',
        age: 40,
        class: 'A',
        subjects: ['Mathematics', 'Economics'],
      },
      {
        name: 'Chris Wilson',
        email: 'chris.wilson@company.com',
        department: 'HR',
        position: 'HR Coordinator',
        salary: 60000,
        startDate: '2023-01-08',
        status: 'Active',
        location: 'Boston',
        manager: 'Lisa Anderson',
        phone: '+1-555-0107',
        age: 26,
        class: 'C',
        subjects: ['Psychology', 'Sociology'],
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa.anderson@company.com',
        department: 'HR',
        position: 'HR Manager',
        salary: 90000,
        startDate: '2016-05-22',
        status: 'Active',
        location: 'Boston',
        manager: 'Robert Johnson',
        phone: '+1-555-0108',
        age: 38,
        class: 'B',
        subjects: ['Management', 'Communication'],
      },
      {
        name: 'Robert Johnson',
        email: 'robert.johnson@company.com',
        department: 'Executive',
        position: 'CEO',
        salary: 200000,
        startDate: '2015-01-10',
        status: 'Active',
        location: 'New York',
        manager: 'Board of Directors',
        phone: '+1-555-0109',
        age: 50,
        class: 'A',
        subjects: ['Leadership', 'Strategy'],
      },
      {
        name: 'Amanda Taylor',
        email: 'amanda.taylor@company.com',
        department: 'Finance',
        position: 'Financial Analyst',
        salary: 75000,
        startDate: '2021-08-17',
        status: 'Active',
        location: 'Seattle',
        manager: 'Michael Chen',
        phone: '+1-555-0110',
        age: 29,
        class: 'B',
        subjects: ['Accounting', 'Finance'],
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@company.com',
        department: 'Finance',
        position: 'Finance Director',
        salary: 105000,
        startDate: '2018-07-12',
        status: 'Active',
        location: 'Seattle',
        manager: 'Robert Johnson',
        phone: '+1-555-0111',
        age: 42,
        class: 'A',
        subjects: ['Finance', 'Economics', 'Statistics'],
      },
      {
        name: 'Jessica Martinez',
        email: 'jessica.martinez@company.com',
        department: 'Engineering',
        position: 'Junior Developer',
        salary: 70000,
        startDate: '2023-03-01',
        status: 'Active',
        location: 'Austin',
        manager: 'Jane Smith',
        phone: '+1-555-0112',
        age: 24,
        class: 'C',
        subjects: ['Computer Science', 'Mathematics'],
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
    const employees = await query('SELECT id FROM employees');
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

