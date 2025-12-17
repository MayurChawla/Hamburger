import { useState, useEffect } from 'react';
import '../styles/EmployeeGrid.css';
import EmployeeFilter from './EmployeeFilter';
import { useAuth } from '../contexts/AuthContext';

const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';
const PAGE_SIZE = 10;

const EmployeeGrid = () => {
  const { user, isAdmin, isEmployee } = useAuth();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'tile'
  const [openMenuId, setOpenMenuId] = useState(null); // Track which menu is open
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Track selected employee for detail view
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    name: '',
    department: '',
    location: '',
    status: '',
  });
  const [activeFilters, setActiveFilters] = useState({});

  // Edit state
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Fetch employees with pagination and filters
  const fetchEmployees = async (page = 1, filterParams = {}) => {
    try {
      setLoading(true);

      // Build filter object for GraphQL
      const filter = {};
      if (filterParams.name) filter.name = filterParams.name;
      if (filterParams.department) filter.department = filterParams.department;
      if (filterParams.location) filter.location = filterParams.location;
      if (filterParams.status) filter.status = filterParams.status;

      const token = localStorage.getItem('authToken');
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          query: `
            query GetEmployees($pagination: PaginationInput, $filter: EmployeeFilterInput) {
              employeesConnection(pagination: $pagination, filter: $filter) {
                nodes {
                  id
                  name
                  email
                  department
                  position
                  salary
                  startDate
                  status
                  location
                  manager
                  phone
                  age
                  class
                  subjects
                }
                pageInfo {
                  currentPage
                  totalPages
                  totalCount
                  hasNextPage
                  hasPreviousPage
                }
                totalCount
              }
            }
          `,
          variables: {
            pagination: { page, limit: PAGE_SIZE },
            filter: Object.keys(filter).length > 0 ? filter : null,
          },
        }),
      });

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      const { nodes, pageInfo, totalCount } = result.data.employeesConnection;
      setEmployees(nodes);
      setTotalCount(totalCount);
      setTotalPages(pageInfo.totalPages);
      setHasNextPage(pageInfo.hasNextPage);
      setHasPreviousPage(pageInfo.hasPreviousPage);
      setCurrentPage(pageInfo.currentPage);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single employee details
  const fetchEmployeeDetails = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          query: `
            query GetEmployee($id: String!) {
              employee(id: $id) {
                id
                name
                email
                department
                position
                salary
                startDate
                status
                location
                manager
                phone
                age
                class
                subjects
                attendance {
                  date
                  present
                }
              }
            }
          `,
          variables: { id },
        }),
      });

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      return result.data.employee;
    } catch (err) {
      console.error('Error fetching employee details:', err);
      return null;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchEmployees(1, activeFilters);
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchEmployees(newPage, activeFilters);
    }
  };

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    const newFilters = {};
    if (filters.name) newFilters.name = filters.name;
    if (filters.department) newFilters.department = filters.department;
    if (filters.location) newFilters.location = filters.location;
    if (filters.status) newFilters.status = filters.status;
    setActiveFilters(newFilters);
    setCurrentPage(1);
    fetchEmployees(1, newFilters);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({ name: '', department: '', location: '', status: '' });
    setActiveFilters({});
    setCurrentPage(1);
    fetchEmployees(1, {});
  };

  // Edit functions (Admin only)
  const startEditing = (employee) => {
    if (!isAdmin()) return;
    setEditingEmployee(employee.id);
    setEditForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      salary: employee.salary,
      status: employee.status,
      location: employee.location,
      manager: employee.manager,
      phone: employee.phone,
    });
  };

  const cancelEditing = () => {
    setEditingEmployee(null);
    setEditForm({});
  };

  const saveEmployee = async () => {
    if (!isAdmin()) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation UpdateEmployee($id: String!, $name: String, $email: String, $department: String, $position: String, $salary: Float, $status: String, $location: String, $manager: String, $phone: String) {
              updateEmployee(id: $id, name: $name, email: $email, department: $department, position: $position, salary: $salary, status: $status, location: $location, manager: $manager, phone: $phone) {
                id
                name
                email
                department
                position
                salary
                status
                location
                manager
                phone
              }
            }
          `,
          variables: {
            id: editingEmployee,
            ...editForm,
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      // Update the employee in the list
      setEmployees(employees.map(emp =>
        emp.id === editingEmployee ? result.data.updateEmployee : emp
      ));

      cancelEditing();
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error updating employee: ' + error.message);
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

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

  const handleTileClick = async (employee, e) => {
    // Don't open modal if clicking on menu button or dropdown
    if (e.target.closest('.tile-menu-container') || e.target.closest('.tile-menu-dropdown')) {
      return;
    }
    // Fetch full employee details including attendance
    const fullEmployee = await fetchEmployeeDetails(employee.id);
    setSelectedEmployee(fullEmployee || employee);
    setOpenMenuId(null); // Close any open menus
  };

  const handleRowClick = async (employee) => {
    const fullEmployee = await fetchEmployeeDetails(employee.id);
    setSelectedEmployee(fullEmployee || employee);
  };

  const closeDetailModal = () => {
    setSelectedEmployee(null);
  };

  if (loading) {
    return (
      <div className="employee-grid-container">
        <div className="loading-state">Loading employees...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-grid-container">
        <div className="error-state">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="employee-grid-container">
      <div className="grid-header">
        <div className="header-content">
          <div>
            <h2>Employee Directory</h2>
            <p className="grid-subtitle">
              {isAdmin() ? `Total Employees: ${totalCount}` : 'Your Employee Profile'}
            </p>
            <p className="user-info">
              Logged in as: <strong>{user?.username}</strong> ({user?.role})
            </p>
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

      {/* Filter Section */}
      <EmployeeFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={applyFilters}
        onClear={clearFilters}
      />
      
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
                {isAdmin() && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} style={{ cursor: isAdmin() ? 'pointer' : 'default' }} onClick={() => handleRowClick(employee)}>
                  <td className="cell-id">{employee.id}</td>
                  <td className="cell-name">
                    {editingEmployee === employee.id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => handleEditFormChange('name', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      employee.name
                    )}
                  </td>
                  <td className="cell-email">
                    {editingEmployee === employee.id ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => handleEditFormChange('email', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      employee.email
                    )}
                  </td>
                  <td className="cell-department">
                    {editingEmployee === employee.id ? (
                      <select
                        value={editForm.department}
                        onChange={(e) => handleEditFormChange('department', e.target.value)}
                        className="edit-select"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Sales">Sales</option>
                        <option value="Marketing">Marketing</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="Executive">Executive</option>
                      </select>
                    ) : (
                      <span className={`dept-badge dept-${employee.department.toLowerCase().replace(/\s+/g, '-')}`}>
                        {employee.department}
                      </span>
                    )}
                  </td>
                  <td className="cell-position">
                    {editingEmployee === employee.id ? (
                      <input
                        type="text"
                        value={editForm.position}
                        onChange={(e) => handleEditFormChange('position', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      employee.position
                    )}
                  </td>
                  <td className="cell-salary">
                    {editingEmployee === employee.id ? (
                      <input
                        type="number"
                        value={editForm.salary}
                        onChange={(e) => handleEditFormChange('salary', Number(e.target.value))}
                        className="edit-input"
                      />
                    ) : (
                      formatCurrency(employee.salary)
                    )}
                  </td>
                  <td className="cell-date">{formatDate(employee.startDate)}</td>
                  <td className="cell-status">
                    {editingEmployee === employee.id ? (
                      <select
                        value={editForm.status}
                        onChange={(e) => handleEditFormChange('status', e.target.value)}
                        className="edit-select"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    ) : (
                      <span className={`status-badge status-${employee.status.toLowerCase()}`}>
                        {employee.status}
                      </span>
                    )}
                  </td>
                  <td className="cell-location">
                    {editingEmployee === employee.id ? (
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => handleEditFormChange('location', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      employee.location
                    )}
                  </td>
                  <td className="cell-manager">{employee.manager}</td>
                  <td className="cell-phone">
                    {editingEmployee === employee.id ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => handleEditFormChange('phone', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      employee.phone
                    )}
                  </td>
                  <td className="cell-actions">
                    {isAdmin() && (
                      <div className="action-buttons">
                        {editingEmployee === employee.id ? (
                          <>
                            <button onClick={saveEmployee} className="action-btn save-btn">Save</button>
                            <button onClick={cancelEditing} className="action-btn cancel-btn">Cancel</button>
                          </>
                        ) : (
                          <button onClick={() => startEditing(employee)} className="action-btn edit-btn">Edit</button>
                        )}
                      </div>
                    )}
                  </td>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(1)}
            disabled={!hasPreviousPage}
            className="pagination-btn"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages} ({totalCount} total)
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="pagination-btn"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={!hasNextPage}
            className="pagination-btn"
          >
            Last
          </button>
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

