const { query, queryOne, execute } = require('../database/connection');
const { NotFoundError, ConflictError } = require('../utils/errors');
const logger = require('../utils/logger');

class Employee {
  /**
   * Find employee by ID
   */
  static async findById(id) {
    const employee = await queryOne(
      'SELECT * FROM employees WHERE id = ?',
      [id]
    );

    if (!employee) {
      return null;
    }

    // Get subjects
    const subjects = await query(
      'SELECT s.name FROM subjects s INNER JOIN employee_subjects es ON s.id = es.subject_id WHERE es.employee_id = ?',
      [id]
    );
    employee.subjects = subjects.map(s => s.name);

    // Get attendance
    const attendance = await query(
      'SELECT date, present FROM attendance WHERE employee_id = ? ORDER BY date DESC',
      [id]
    );
    employee.attendance = attendance.map(a => ({
      date: a.date,
      present: Boolean(a.present),
    }));

    return employee;
  }

  /**
   * Find all employees with filters, sorting, and pagination
   */
  static async findAll(filters = {}, sort = {}, pagination = {}) {
    let sql = 'SELECT * FROM employees WHERE 1=1';
    const params = [];

    // Apply filters
    if (filters.name) {
      sql += ' AND name LIKE ?';
      params.push(`%${filters.name}%`);
    }
    if (filters.department) {
      sql += ' AND department = ?';
      params.push(filters.department);
    }
    if (filters.position) {
      sql += ' AND position LIKE ?';
      params.push(`%${filters.position}%`);
    }
    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters.location) {
      sql += ' AND location = ?';
      params.push(filters.location);
    }
    if (filters.class) {
      sql += ' AND class = ?';
      params.push(filters.class);
    }
    if (filters.minAge !== undefined) {
      sql += ' AND age >= ?';
      params.push(filters.minAge);
    }
    if (filters.maxAge !== undefined) {
      sql += ' AND age <= ?';
      params.push(filters.maxAge);
    }
    if (filters.minSalary !== undefined) {
      sql += ' AND salary >= ?';
      params.push(filters.minSalary);
    }
    if (filters.maxSalary !== undefined) {
      sql += ' AND salary <= ?';
      params.push(filters.maxSalary);
    }

    // Apply sorting
    if (sort.field) {
      const order = sort.order === 'DESC' ? 'DESC' : 'ASC';
      sql += ` ORDER BY ${sort.field} ${order}`;
    } else {
      sql += ' ORDER BY created_at DESC';
    }

    // Apply pagination
    const limit = pagination.limit || 10;
    const offset = pagination.offset !== undefined 
      ? pagination.offset 
      : ((pagination.page || 1) - 1) * limit;

    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const employees = await query(sql, params);

    // Get total count for pagination (same WHERE conditions, no LIMIT/OFFSET)
    let countSql = 'SELECT COUNT(*) as total FROM employees WHERE 1=1';
    const countParams = [];
    
    // Apply same filters for count query
    if (filters.name) {
      countSql += ' AND name LIKE ?';
      countParams.push(`%${filters.name}%`);
    }
    if (filters.department) {
      countSql += ' AND department = ?';
      countParams.push(filters.department);
    }
    if (filters.position) {
      countSql += ' AND position LIKE ?';
      countParams.push(`%${filters.position}%`);
    }
    if (filters.status) {
      countSql += ' AND status = ?';
      countParams.push(filters.status);
    }
    if (filters.location) {
      countSql += ' AND location = ?';
      countParams.push(filters.location);
    }
    if (filters.class) {
      countSql += ' AND class = ?';
      countParams.push(filters.class);
    }
    if (filters.minAge !== undefined) {
      countSql += ' AND age >= ?';
      countParams.push(filters.minAge);
    }
    if (filters.maxAge !== undefined) {
      countSql += ' AND age <= ?';
      countParams.push(filters.maxAge);
    }
    if (filters.minSalary !== undefined) {
      countSql += ' AND salary >= ?';
      countParams.push(filters.minSalary);
    }
    if (filters.maxSalary !== undefined) {
      countSql += ' AND salary <= ?';
      countParams.push(filters.maxSalary);
    }
    
    const countResult = await queryOne(countSql, countParams);
    const totalCount = countResult.total;

    // Enrich with subjects and attendance
    for (const employee of employees) {
      const subjects = await query(
        'SELECT s.name FROM subjects s INNER JOIN employee_subjects es ON s.id = es.subject_id WHERE es.employee_id = ?',
        [employee.id]
      );
      employee.subjects = subjects.map(s => s.name);

      const attendance = await query(
        'SELECT date, present FROM attendance WHERE employee_id = ? ORDER BY date DESC',
        [employee.id]
      );
      employee.attendance = attendance.map(a => ({
        date: a.date,
        present: Boolean(a.present),
      }));
    }

    return {
      employees,
      totalCount,
      pageInfo: {
        currentPage: pagination.page || Math.floor(offset / limit) + 1,
        perPage: limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: offset + limit < totalCount,
        hasPreviousPage: offset > 0,
      },
    };
  }

  /**
   * Create a new employee
   */
  static async create(employeeData) {
    const {
      name,
      email,
      department,
      position,
      salary,
      startDate,
      status = 'Active',
      location = null,
      manager = null,
      phone = null,
      age = null,
      class: className = null,
      subjects = [],
    } = employeeData;

    // Check if email already exists
    const existing = await queryOne('SELECT id FROM employees WHERE email = ?', [email]);
    if (existing) {
      throw new ConflictError('Employee with this email already exists');
    }

    // Generate ID
    const id = Date.now().toString();

    await execute(
      `INSERT INTO employees 
       (id, name, email, department, position, salary, start_date, status, location, manager, phone, age, class)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, email, department, position, salary, startDate, status, location, manager, phone, age, className]
    );

    // Add subjects
    if (subjects && subjects.length > 0) {
      for (const subjectName of subjects) {
        // Get or create subject
        let subject = await queryOne('SELECT id FROM subjects WHERE name = ?', [subjectName]);
        if (!subject) {
          const subjectResult = await execute('INSERT INTO subjects (name) VALUES (?)', [subjectName]);
          subject = { id: subjectResult.lastID };
        }

        // Link employee to subject
        await execute(
          'INSERT OR IGNORE INTO employee_subjects (employee_id, subject_id) VALUES (?, ?)',
          [id, subject.id]
        );
      }
    }

    logger.info(`Employee created: ${name} (${id})`);
    return await this.findById(id);
  }

  /**
   * Update employee
   */
  static async update(id, updates) {
    const employee = await this.findById(id);
    if (!employee) {
      throw new NotFoundError('Employee');
    }

    const allowedFields = [
      'name', 'email', 'department', 'position', 'salary', 'start_date',
      'status', 'location', 'manager', 'phone', 'age', 'class'
    ];
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      const dbKey = key === 'startDate' ? 'start_date' : key;
      if (allowedFields.includes(dbKey) && value !== undefined) {
        fields.push(`${dbKey} = ?`);
        values.push(value);
      }
    }

    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      await execute(
        `UPDATE employees SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Update subjects if provided
    if (updates.subjects !== undefined) {
      // Remove existing subjects
      await execute('DELETE FROM employee_subjects WHERE employee_id = ?', [id]);

      // Add new subjects
      if (updates.subjects && updates.subjects.length > 0) {
        for (const subjectName of updates.subjects) {
          let subject = await queryOne('SELECT id FROM subjects WHERE name = ?', [subjectName]);
          if (!subject) {
            const subjectResult = await execute('INSERT INTO subjects (name) VALUES (?)', [subjectName]);
            subject = { id: subjectResult.lastID };
          }
          await execute(
            'INSERT INTO employee_subjects (employee_id, subject_id) VALUES (?, ?)',
            [id, subject.id]
          );
        }
      }
    }

    logger.info(`Employee updated: ${id}`);
    return await this.findById(id);
  }

  /**
   * Delete employee
   */
  static async delete(id) {
    const employee = await this.findById(id);
    if (!employee) {
      throw new NotFoundError('Employee');
    }

    await execute('DELETE FROM employees WHERE id = ?', [id]);
    logger.info(`Employee deleted: ${id}`);
    return employee;
  }

  /**
   * Mark attendance
   */
  static async markAttendance(employeeId, date, present) {
    const employee = await this.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee');
    }

    await execute(
      'INSERT OR REPLACE INTO attendance (employee_id, date, present) VALUES (?, ?, ?)',
      [employeeId, date, present ? 1 : 0]
    );

    logger.info(`Attendance marked for employee ${employeeId} on ${date}: ${present ? 'present' : 'absent'}`);
    return await this.findById(employeeId);
  }
}

module.exports = Employee;

