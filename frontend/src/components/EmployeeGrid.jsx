import { useState } from 'react';
import './EmployeeGrid.css';

const EmployeeGrid = () => {
  const [employees] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'Engineering',
      position: 'Senior Developer',
      salary: 95000,
      startDate: '2020-01-15',
      status: 'Active',
      location: 'New York',
      manager: 'Jane Smith',
      phone: '+1-555-0101'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      department: 'Engineering',
      position: 'Engineering Manager',
      salary: 120000,
      startDate: '2018-03-20',
      status: 'Active',
      location: 'New York',
      manager: 'Robert Johnson',
      phone: '+1-555-0102'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      department: 'Sales',
      position: 'Sales Representative',
      salary: 65000,
      startDate: '2021-06-10',
      status: 'Active',
      location: 'Los Angeles',
      manager: 'Sarah Williams',
      phone: '+1-555-0103'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.williams@company.com',
      department: 'Sales',
      position: 'Sales Manager',
      salary: 85000,
      startDate: '2019-09-05',
      status: 'Active',
      location: 'Los Angeles',
      manager: 'Robert Johnson',
      phone: '+1-555-0104'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@company.com',
      department: 'Marketing',
      position: 'Marketing Specialist',
      salary: 70000,
      startDate: '2022-02-14',
      status: 'Active',
      location: 'Chicago',
      manager: 'Emily Davis',
      phone: '+1-555-0105'
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      department: 'Marketing',
      position: 'Marketing Director',
      salary: 110000,
      startDate: '2017-11-30',
      status: 'Active',
      location: 'Chicago',
      manager: 'Robert Johnson',
      phone: '+1-555-0106'
    },
    {
      id: 7,
      name: 'Chris Wilson',
      email: 'chris.wilson@company.com',
      department: 'HR',
      position: 'HR Coordinator',
      salary: 60000,
      startDate: '2023-01-08',
      status: 'Active',
      location: 'Boston',
      manager: 'Lisa Anderson',
      phone: '+1-555-0107'
    },
    {
      id: 8,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@company.com',
      department: 'HR',
      position: 'HR Manager',
      salary: 90000,
      startDate: '2016-05-22',
      status: 'Active',
      location: 'Boston',
      manager: 'Robert Johnson',
      phone: '+1-555-0108'
    },
    {
      id: 9,
      name: 'Robert Johnson',
      email: 'robert.johnson@company.com',
      department: 'Executive',
      position: 'CEO',
      salary: 200000,
      startDate: '2015-01-10',
      status: 'Active',
      location: 'New York',
      manager: 'Board of Directors',
      phone: '+1-555-0109'
    },
    {
      id: 10,
      name: 'Amanda Taylor',
      email: 'amanda.taylor@company.com',
      department: 'Finance',
      position: 'Financial Analyst',
      salary: 75000,
      startDate: '2021-08-17',
      status: 'Active',
      location: 'Seattle',
      manager: 'Michael Chen',
      phone: '+1-555-0110'
    },
    {
      id: 11,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      department: 'Finance',
      position: 'Finance Director',
      salary: 105000,
      startDate: '2018-07-12',
      status: 'Active',
      location: 'Seattle',
      manager: 'Robert Johnson',
      phone: '+1-555-0111'
    },
    {
      id: 12,
      name: 'Jessica Martinez',
      email: 'jessica.martinez@company.com',
      department: 'Engineering',
      position: 'Junior Developer',
      salary: 70000,
      startDate: '2023-03-01',
      status: 'Active',
      location: 'Austin',
      manager: 'Jane Smith',
      phone: '+1-555-0112'
    }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="employee-grid-container">
      <div className="grid-header">
        <h2>Employee Directory</h2>
        <p className="grid-subtitle">Total Employees: {employees.length}</p>
      </div>
      
      <div className="grid-wrapper">
        <table className="employee-grid">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Start Date</th>
              <th>Status</th>
              <th>Location</th>
              <th>Manager</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="cell-id">{employee.id}</td>
                <td className="cell-name">{employee.name}</td>
                <td className="cell-email">{employee.email}</td>
                <td className="cell-department">
                  <span className={`dept-badge dept-${employee.department.toLowerCase().replace(/\s+/g, '-')}`}>
                    {employee.department}
                  </span>
                </td>
                <td className="cell-position">{employee.position}</td>
                <td className="cell-salary">{formatCurrency(employee.salary)}</td>
                <td className="cell-date">{formatDate(employee.startDate)}</td>
                <td className="cell-status">
                  <span className={`status-badge status-${employee.status.toLowerCase()}`}>
                    {employee.status}
                  </span>
                </td>
                <td className="cell-location">{employee.location}</td>
                <td className="cell-manager">{employee.manager}</td>
                <td className="cell-phone">{employee.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeGrid;

