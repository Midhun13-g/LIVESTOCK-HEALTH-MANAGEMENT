import React, { useState } from "react";
import AnimalCard from "./AnimalCard"; // Import AnimalCard Component
import "./Dashboard.css"; // Import CSS for styling

function Dashboard() {
  // State to manage animals list
  const [animals, setAnimals] = useState([
    { id: 1, name: "Bella", type: "Holstein cattle", status: "healthy", born: "1/15/2022", nextCheckup: "4/15/2024", insemination: "5/1/2024" },
    { id: 2, name: "Max", type: "Yorkshire pig", status: "treatment", born: "3/20/2023", nextCheckup: "3/25/2024" },
    { id: 3, name: "Luna", type: "Merino sheep", status: "healthy", born: "6/10/2023", nextCheckup: "4/10/2024" },
  ]);

  // State to manage form visibility and input data
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'healthy',
    born: '',
    nextCheckup: '',
    insemination: '',
  });

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [editingAnimal, setEditingAnimal] = useState(null); // Track the animal being edited

  // Handle input change for new animal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle submitting the new animal form
  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnimal = { ...formData, id: animals.length + 1 };
    setAnimals([...animals, newAnimal]);
    setFormData({ name: '', type: '', status: 'healthy', born: '', nextCheckup: '', insemination: '' });
    setIsFormVisible(false);
  };

  // Handle saving an edited animal
  const handleSave = (updatedAnimal) => {
    // Update the animal data in the state
    setAnimals(animals.map(animal => 
      animal.id === updatedAnimal.id ? updatedAnimal : animal
    ));
    setEditingAnimal(null); // Close the edit form after saving
    setFormData({ name: '', type: '', status: 'healthy', born: '', nextCheckup: '', insemination: '' }); // Reset form data
    setIsFormVisible(false); // Close the form
  };

  // Handle filter status change
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Remove an animal from the list
  const handleRemove = (id) => {
    setAnimals(animals.filter((animal) => animal.id !== id));
  };

  // Filter animals based on their status
  const filteredAnimals = animals.filter((animal) =>
    filterStatus ? animal.status === filterStatus : true
  );

  // Start editing an animal's information
  const handleEdit = (animal) => {
    setFormData(animal); // Populate the form with the animal's current data
    setEditingAnimal(animal); // Set the animal being edited
    setIsFormVisible(true); // Show the form
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Livestock Health Management</h1>
        <div className="dashboard-buttons">
          {/* <button className="add-animal-btn" onClick={() => setIsFormVisible(true)}>
            Add Animal
          </button> */}
          <div className="filter-section">
            <button className="filter-btn">Filter</button>
            <select className="filter-dropdown" onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="healthy">Healthy</option>
              <option value="treatment">Treatment</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      <div className="animal-cards-container">
        {filteredAnimals.map((animal) => (
          <AnimalCard
            key={animal.id}
            {...animal}
            onRemove={handleRemove}
            onEdit={handleEdit}  // Pass the edit function to AnimalCard
            onSave={handleSave}  // Pass the save function to AnimalCard
          />
        ))}
      </div>

      {/* Add/Edit Animal Form */}
      {isFormVisible && (
        <div className="add-animal-form-container">
          <div className="add-animal-form">
            <form onSubmit={(e) => { e.preventDefault(); editingAnimal ? handleSave(formData) : handleSubmit(e); }}>
              <div className="form-field">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Type</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="healthy">Healthy</option>
                  <option value="treatment">Treatment</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="form-field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="born"
                  value={formData.born}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Next Checkup</label>
                <input
                  type="date"
                  name="nextCheckup"
                  value={formData.nextCheckup}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Insemination Date (optional)</label>
                <input
                  type="date"
                  name="insemination"
                  value={formData.insemination}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit">{editingAnimal ? "Save Changes" : "Add Animal"}</button>
                <button type="button" onClick={() => setIsFormVisible(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
