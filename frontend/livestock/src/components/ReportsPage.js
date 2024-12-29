// ReportsPage.js
import React, { useState } from 'react';
import './ReportsPage.css';

const ReportsPage = () => {
  const [reports] = useState([
    { name: 'Monthly Health Report', date: '2024-03-15', type: 'Health Report', status: 'completed' },
    { name: 'Q1 Inventory Report', date: '2024-03-14', type: 'Inventory Report', status: 'pending' },
    { name: 'Annual Financial Summary', date: '2024-03-13', type: 'Financial Report', status: 'completed' },
  ]);

  const handleGenerateReport = () => {
    alert('Generate Report button clicked!');
  };

  const handleExportReports = () => {
    alert('Export Reports button clicked!');
  };

  const handleDelete = (name) => {
    alert(`Delete action triggered for ${name}!`);
  };

  const handleDownload = (name) => {
    alert(`Download action triggered for ${name}!`);
  };

  return (
    <div className="container">
      <div className="header">
        <div>
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

        <div>
          <button onClick={handleGenerateReport}>Generate Report</button>
          <button onClick={handleExportReports}>Export</button>
        </div>
      </div>

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
                <button onClick={() => handleDownload(report.name)} title="Download">📥</button>
                <button onClick={() => handleDelete(report.name)} title="Delete">🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsPage;