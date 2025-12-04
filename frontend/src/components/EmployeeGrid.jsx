import { useState, useEffect } from 'react';
import './EmployeeGrid.css';

const EmployeeGrid = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'tile'
  const [openMenuId, setOpenMenuId] = useState(null); // Track which menu is open
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

  const handleMenuToggle = (employeeId, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === employeeId ? null : employeeId);
  };

  const handleMenuAction = (employeeId, action, e) => {
    e.stopPropagation();
    console.log(`${action} action for employee ${employeeId}`);
    // Here you would implement the actual action logic
    setOpenMenuId(null);
  };

  // Close menu when clicking outside
  const handleClickOutside = () => {
    setOpenMenuId(null);
  };

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="employee-grid-container">
      <div className="grid-header">
        <div className="header-content">
          <div>
            <h2>Employee Directory</h2>
            <p className="grid-subtitle">Total Employees: {employees.length}</p>
          </div>
          <div className="view-switcher">
            <button
              className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <rect x="12" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <rect x="2" y="12" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <rect x="12" y="12" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              Grid
            </button>
            <button
              className={`view-button ${viewMode === 'tile' ? 'active' : ''}`}
              onClick={() => setViewMode('tile')}
              aria-label="Tile view"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <rect x="11" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <rect x="2" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <rect x="11" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              Tile
            </button>
          </div>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
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
      ) : (
        <div className="tile-wrapper" onClick={handleClickOutside}>
          <div className="employee-tiles">
            {employees.map((employee) => (
              <div key={employee.id} className="employee-tile">
                <div className="tile-header">
                  <div className="tile-avatar">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="tile-name-section">
                    <h3 className="tile-name">{employee.name}</h3>
                    <span className={`status-badge status-${employee.status.toLowerCase()}`}>
                      {employee.status}
                    </span>
                  </div>
                  <div className="tile-menu-container">
                    <button
                      className="tile-menu-button"
                      onClick={(e) => handleMenuToggle(employee.id, e)}
                      aria-label="More options"
                      aria-expanded={openMenuId === employee.id}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="5" r="1.5" fill="currentColor"/>
                        <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                        <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
                      </svg>
                    </button>
                    {openMenuId === employee.id && (
                      <div className="tile-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="menu-item"
                          onClick={(e) => handleMenuAction(employee.id, 'edit', e)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.333 2.00001C11.5084 1.82445 11.7163 1.68507 11.9447 1.59123C12.1731 1.49738 12.4173 1.45117 12.6637 1.45534C12.9101 1.45951 13.1527 1.51395 13.3776 1.61519C13.6025 1.71643 13.8052 1.86233 13.9747 2.04435C14.1442 2.22637 14.2771 2.44074 14.3659 2.67557C14.4547 2.9104 14.4975 3.16088 14.4919 3.41235C14.4863 3.66382 14.4324 3.91154 14.3333 4.14168L14 4.66668L11.333 2.00001ZM10 3.33334L2.66667 10.6667V13.3333H5.33333L12.6667 6.00001L10 3.33334Z" fill="currentColor"/>
                          </svg>
                          Edit
                        </button>
                        <button
                          className="menu-item"
                          onClick={(e) => handleMenuAction(employee.id, 'flag', e)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.66667 2.66667H14.6667L13.3333 8L14.6667 13.3333H2.66667V2.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                            <path d="M2.66667 2.66667V14.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Flag
                        </button>
                        <button
                          className="menu-item"
                          onClick={(e) => handleMenuAction(employee.id, 'view', e)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 2.66667C4.66667 2.66667 2 6 2 8C2 10 4.66667 13.3333 8 13.3333C11.3333 13.3333 14 10 14 8C14 6 11.3333 2.66667 8 2.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                          </svg>
                          View Details
                        </button>
                        <button
                          className="menu-item"
                          onClick={(e) => handleMenuAction(employee.id, 'duplicate', e)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5.33333" y="5.33333" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                            <path d="M2.66667 2.66667H10.6667V10.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Duplicate
                        </button>
                        <div className="menu-divider"></div>
                        <button
                          className="menu-item menu-item-danger"
                          onClick={(e) => handleMenuAction(employee.id, 'delete', e)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 4H14M5.33333 4V2.66667C5.33333 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4H12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="tile-body">
                  <div className="tile-field">
                    <span className="tile-label">Position</span>
                    <span className="tile-value">{employee.position}</span>
                  </div>
                  <div className="tile-field">
                    <span className="tile-label">Department</span>
                    <span className={`dept-badge dept-${employee.department.toLowerCase().replace(/\s+/g, '-')}`}>
                      {employee.department}
                    </span>
                  </div>
                  <div className="tile-field">
                    <span className="tile-label">Email</span>
                    <span className="tile-value tile-email">{employee.email}</span>
                  </div>
                  <div className="tile-field">
                    <span className="tile-label">Location</span>
                    <span className="tile-value">{employee.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeGrid;

