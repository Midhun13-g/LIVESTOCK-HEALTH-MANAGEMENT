import React, { useState } from 'react';
import './ReportsPage.css';

const ReportsPage = () => {
  const [reports, setReports] = useState([
    { name: 'Monthly Health Report', date: '2024-03-15', type: 'Health Report', status: 'completed' },
    { name: 'Annual Financial Summary', date: '2024-03-13', type: 'Financial Report', status: 'completed' },
  ]);

  const [showFilters, setShowFilters] = useState(false);
  const [showCreateReportModal, setShowCreateReportModal] = useState(false);
  const [newReport, setNewReport] = useState({
    name: '',
    date: '',
    type: 'Inventory Report',
    status: 'pending',
  });

  // Add missing states for filters
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('');

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleGenerateReport = () => {
    const report = { ...newReport, date: new Date().toLocaleDateString() };
    setReports((prevReports) => [...prevReports, report]);
    setShowCreateReportModal(false); // Close the modal after submitting
    alert('New report generated!');
    setNewReport({
      name: '',
      date: '',
      type: 'Inventory Report',
      status: 'pending',
    });
  };

  const handleExportReports = () => {
    const csvData = reports
      .map((report) => `${report.name}, ${report.date}, ${report.type}, ${report.status}`)
      .join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'reports.csv';
    link.click();
    alert('Export Reports button clicked! Reports exported as CSV.');
  };

  const handleDelete = (name) => {
    const updatedReports = reports.filter((report) => report.name !== name);
    setReports(updatedReports);
    alert(`Delete action triggered for ${name}! Report deleted.`);
  };

  const handleDownload = (name) => {
    const report = reports.find((report) => report.name === name);
    if (report) {
      const blob = new Blob(
        [
          `Report: ${report.name}\nDate: ${report.date}\nType: ${report.type}\nStatus: ${report.status}`,
        ],
        { type: 'application/pdf' }
      );
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${name}.pdf`;
      link.click();
      alert(`Download action triggered for ${name}! Report downloaded as PDF.`);
    }
  };

  const handleFilterChange = () => {
    setFilterType(document.getElementById('reportType').value);
    setFilterStatus(document.getElementById('status').value);
    setFilterDateRange(document.getElementById('dateRange').value);
  };

  const filteredReports = reports.filter((report) => {
    const matchType = filterType ? report.type === filterType : true;
    const matchStatus = filterStatus !== 'all' ? report.status === filterStatus : true;
    const matchDateRange =
      filterDateRange ? new Date(report.date) >= new Date(filterDateRange) : true;
    return matchType && matchStatus && matchDateRange;
  });

  return (
    <div className="container">
      <div className="buttons">
        <button onClick={() => setShowCreateReportModal(true)}>Generate Report</button>
        <button onClick={handleExportReports}>Export</button>
        <button className="filter-togglee" onClick={toggleFilters}>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
      </div>

      

      {showFilters && (
        <div className="filters">
          <label htmlFor="reportType">Report Type:</label>
          <select id="reportType" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Inventory Report">Inventory Report</option>
            <option value="Health Report">Health Report</option>
            <option value="Financial Report">Financial Report</option>
          </select>

          <label htmlFor="dateRange">Date Range:</label>
          <input type="date" id="dateRange" onChange={handleFilterChange} />

          <label htmlFor="status">Status:</label>
          <select id="status" onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      )}

      {/* Modal for creating new report */}
      {showCreateReportModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowCreateReportModal(false)}>
              &times;
            </span>
            <h3>Create New Report</h3>
            <input
              type="text"
              placeholder="Report Name"
              value={newReport.name}
              onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
            />
            <select
              value={newReport.type}
              onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
            >
              <option value="Inventory Report">Inventory Report</option>
              <option value="Health Report">Health Report</option>
              <option value="Financial Report">Financial Report</option>
            </select>
            <select
              value={newReport.status}
              onChange={(e) => setNewReport({ ...newReport, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <button onClick={handleGenerateReport}>Create Report</button>
          </div>
        </div>
      )}

      <div className="reports-table">
        <table>
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Date Generated</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.name}>
                <td>{report.name}</td>
                <td>{report.date}</td>
                <td>{report.type}</td>
                <td>
                  <span className={`status ${report.status}`}>{report.status}</span>
                </td>
                <td className="actions">
                  <button onClick={() => handleDownload(report.name)} title="Download">
                    📥
                  </button>
                  <button onClick={() => handleDelete(report.name)} title="Delete">
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
