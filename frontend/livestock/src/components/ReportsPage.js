import React, { useState } from 'react';
import './ReportsPage.css';

const ReportsPage = () => {
  const [reports, setReports] = useState([
    { name: 'Monthly Health Report', date: '2024-03-15', type: 'Health Report', status: 'completed' },
    { name: 'Q1 Inventory Report', date: '2024-03-14', type: 'Inventory Report', status: 'pending' },
    { name: 'Annual Financial Summary', date: '2024-03-13', type: 'Financial Report', status: 'completed' },
  ]);

  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleGenerateReport = () => {
    const newReport = {
      name: 'New Generated Report',
      date: new Date().toLocaleDateString(),
      type: 'Generated Report',
      status: 'pending',
    };
    setReports((prevReports) => [...prevReports, newReport]);
    alert('Generate Report button clicked! New report added.');
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
      )
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${name}.pdf`;
      link.click();
      alert(`Download action triggered for ${name}! Report downloaded as PDF.`);
    }
  };

  return (
    <div className="container">
      <div className="buttons">
        <button onClick={handleGenerateReport}>Generate Report</button>
        <button onClick={handleExportReports}>Export</button>
      </div>

      <button className="filter-toggle" onClick={toggleFilters}>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {showFilters && (
        <div className="filters">
          <label htmlFor="reportType">Report Type:</label>
          <select id="reportType">
            <option value="Inventory Report">Inventory Report</option>
            <option value="Health Report">Health Report</option>
            <option value="Financial Report">Financial Report</option>
          </select>

          <label htmlFor="dateRange">Date Range:</label>
          <input type="date" id="dateRange" />

          <label htmlFor="status">Status:</label>
          <select id="status">
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
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
            {reports.map((report) => (
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
