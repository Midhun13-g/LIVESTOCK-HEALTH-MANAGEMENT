import React, { useState } from "react";
import "./HealthRecordsPage.css";

const HealthRecordsPage = () => {
  const [records, setRecords] = useState([
    {
      name: "Bella",
      status: "normal",
      type: "Routine Checkup",
      date: "2024-03-15",
      treatment: "Vaccination",
      notes: "Regular vaccination schedule completed",
    },
    {
      name: "Max",
      status: "warning",
      type: "Emergency Visit",
      date: "2024-03-14",
      treatment: "Antibiotics prescribed",
      notes: "Showing signs of infection",
    },
    {
      name: "Luna",
      status: "normal",
      type: "Follow-up",
      date: "2024-03-13",
      treatment: "Wound dressing",
      notes: "Healing well",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const handleAddRecord = (newRecord) => {
    setRecords([...records, newRecord]);
    setIsModalOpen(false);
  };

  const filteredRecords = filter
    ? records.filter((record) => record.status === filter)
    : records;

  return (
    <div className="health-records-container">
      <div className="health-records-header">
        <h2>Health Records</h2>
        <div className="actions">
          <button className="add-record-btn" onClick={() => setIsModalOpen(true)}>
            + Add Record
          </button>
          <select
            className="filter-btn"
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
          >
            <option value="">All</option>
            <option value="normal">Normal</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
      <div className="records-list">
        {filteredRecords.map((record, index) => (
          <div className={`record-card ${record.status}`} key={index}>
            <h3>{record.name}</h3>
            <p>{record.type}</p>
            <p>Date: {record.date}</p>
            <p>Treatment: {record.treatment}</p>
            <p>Notes: {record.notes}</p>
            <span className={`status-label ${record.status}`}>
              {record.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <AddRecordModal onClose={() => setIsModalOpen(false)} onAdd={handleAddRecord} />
      )}
    </div>
  );
};

const AddRecordModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    type: "",
    date: "",
    treatment: "",
    status: "normal",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Add Health Record</h3>
        <form onSubmit={handleSubmit}>
          <label>Animal Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />

          <label>Type</label>
          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="Routine Checkup">Routine Checkup</option>
            <option value="Emergency Visit">Emergency Visit</option>
            <option value="Follow-up">Follow-up</option>
          </select>

          <label>Date</label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <label>Treatment</label>
          <input name="treatment" value={form.treatment} onChange={handleChange} />

          <label>Severity</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="normal">Normal</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>

          <label>Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows="3"
          ></textarea>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Add Record</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthRecordsPage;
