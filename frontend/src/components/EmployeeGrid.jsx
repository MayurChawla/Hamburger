import { useState, useEffect } from 'react';
import './EmployeeGrid.css';

const EmployeeGrid = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'tile'
  const [openMenuId, setOpenMenuId] = useState(null); // Track which menu is open
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Track selected employee for detail view
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
        setSelectedEmployee(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleTileClick = (employee, e) => {
    // Don't open modal if clicking on menu button or dropdown
    if (e.target.closest('.tile-menu-container') || e.target.closest('.tile-menu-dropdown')) {
      return;
    }
    setSelectedEmployee(employee);
    setOpenMenuId(null); // Close any open menus
  };

  const closeDetailModal = () => {
    setSelectedEmployee(null);
  };

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
              <div 
                key={employee.id} 
                className="employee-tile"
                onClick={(e) => handleTileClick(employee, e)}
              >
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

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="detail-modal-overlay" onClick={closeDetailModal}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="detail-modal-close" onClick={closeDetailModal} aria-label="Close">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="detail-modal-header">
              <div className="detail-avatar-large">
                {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="detail-header-info">
                <h2 className="detail-name">{selectedEmployee.name}</h2>
                <p className="detail-position">{selectedEmployee.position}</p>
                <div className="detail-badges">
                  <span className={`dept-badge dept-${selectedEmployee.department.toLowerCase().replace(/\s+/g, '-')}`}>
                    {selectedEmployee.department}
                  </span>
                  <span className={`status-badge status-${selectedEmployee.status.toLowerCase()}`}>
                    {selectedEmployee.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-modal-body">
              <div className="detail-section">
                <h3 className="detail-section-title">Contact Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 4L8 8L14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      </svg>
                      Email
                    </span>
                    <span className="detail-value">{selectedEmployee.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.33333 2.66667H6.66667L8 6L5.33333 7.33333C6.06667 9.06667 6.93333 9.93333 8.66667 10.6667L10 8L13.3333 9.33333V12.6667C13.3333 13.4 12.9333 14 12.4 14.2667C11.8667 14.5333 11.2 14.4 10.6667 14L3.33333 6.66667C2.8 6.13333 2.66667 5.46667 2.93333 4.93333C3.2 4.4 3.8 4 4.53333 4H7.86667L9.2 1.33333H3.33333C2.59667 1.33333 2 1.93 2 2.66667V12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                      Phone
                    </span>
                    <span className="detail-value">{selectedEmployee.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 8.66667C9.10457 8.66667 10 7.77124 10 6.66667C10 5.5621 9.10457 4.66667 8 4.66667C6.89543 4.66667 6 5.5621 6 6.66667C6 7.77124 6.89543 8.66667 8 8.66667Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        <path d="M2.66667 6.66667C2.66667 5.5621 3.5621 4.66667 4.66667 4.66667H5.33333C5.70152 4.66667 6.05468 4.52619 6.32971 4.26914C6.60474 4.0121 6.78571 3.65443 6.83867 3.26267L7.00533 2.196C7.09467 1.46267 7.7 1 8.33333 1H8.66667C9.77124 1 10.6667 1.89543 10.6667 3V3.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        <path d="M13.3333 6.66667C13.3333 7.77124 12.4379 8.66667 11.3333 8.66667H10.6667C10.2985 8.66667 9.94532 8.80714 9.67029 9.06419C9.39526 9.32124 9.21429 9.6789 9.16133 10.0707L8.99467 11.1373C8.90533 11.8707 8.3 12.3333 7.66667 12.3333H7.33333C6.22876 12.3333 5.33333 11.4379 5.33333 10.3333V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        <path d="M8 14.6667C9.38071 14.6667 10.5 13.5474 10.5 12.1667C10.5 10.7859 9.38071 9.66667 8 9.66667C6.61929 9.66667 5.5 10.7859 5.5 12.1667C5.5 13.5474 6.61929 14.6667 8 14.6667Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      </svg>
                      Location
                    </span>
                    <span className="detail-value">{selectedEmployee.location}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3 className="detail-section-title">Employment Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        <path d="M2 6H14" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M5 3V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M11 3V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      Start Date
                    </span>
                    <span className="detail-value">{formatDate(selectedEmployee.startDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 1V15M8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7M8 1C9.65685 1 11 2.34315 11 4C11 5.65685 9.65685 7 8 7M8 7C9.65685 7 11 8.34315 11 10C11 11.6569 9.65685 13 8 13M8 7C6.34315 7 5 8.34315 5 10C5 11.6569 6.34315 13 8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                      </svg>
                      Salary
                    </span>
                    <span className="detail-value detail-salary">{formatCurrency(selectedEmployee.salary)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        <path d="M2 13.3333C2 11.1242 3.79086 9.33333 6 9.33333H10C12.2091 9.33333 14 11.1242 14 13.3333V14H2V13.3333Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      </svg>
                      Manager
                    </span>
                    <span className="detail-value">{selectedEmployee.manager}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        <path d="M2 5H14" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      Employee ID
                    </span>
                    <span className="detail-value">#{selectedEmployee.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeGrid;

