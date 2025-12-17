import '../styles/EmployeeFilter.css';

const EmployeeFilter = ({ filters, onFilterChange, onApply, onClear }) => {
  return (
    <div className="filter-section">
      <div className="filter-row">
        <input
          type="text"
          placeholder="Search by name..."
          value={filters.name}
          onChange={(e) => onFilterChange('name', e.target.value)}
          className="filter-input"
        />
        <select
          value={filters.department}
          onChange={(e) => onFilterChange('department', e.target.value)}
          className="filter-select"
        >
          <option value="">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Sales">Sales</option>
          <option value="Marketing">Marketing</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Executive">Executive</option>
        </select>
        <select
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.target.value)}
          className="filter-select"
        >
          <option value="">All Locations</option>
          <option value="New York">New York</option>
          <option value="Los Angeles">Los Angeles</option>
          <option value="Chicago">Chicago</option>
          <option value="Boston">Boston</option>
          <option value="Seattle">Seattle</option>
          <option value="Austin">Austin</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button onClick={onApply} className="filter-btn filter-btn-apply">Apply</button>
        <button onClick={onClear} className="filter-btn filter-btn-clear">Clear</button>
      </div>
    </div>
  );
};

export default EmployeeFilter;

