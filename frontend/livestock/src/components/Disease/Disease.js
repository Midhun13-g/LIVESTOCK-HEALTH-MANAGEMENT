import React, { useState } from "react";
import Modal from "./Modal"; // Import Modal component
import SearchBar from "./SearchBar";
import DiseaseCard from "./DiseaseCard";
import Filter from "./Filter";
import "./Disease.css";

const Disease = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("all");
  // const [selectedRisk, setSelectedRisk] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);

  const diseases = [
    {
      name: "Foot and Mouth Disease",
      species: "Cattle",
      risk: "high",
      keySymptoms: [
        "Fever and elevated body temperature",
        "Blisters around mouth, feet, and teats",
        "Reduced appetite and depression",
      ],
      detectionWindow: "2-3 days after exposure, with symptoms developing within 3-8 days",
      riskLevel: "High risk of spread",
      earlyWarningSigns: [
        "Fever over 40°C",
        "Lameness in animals",
        "Blisters on mouth and feet",
      ],
      detectionTimeline: "Symptoms become apparent 2-3 days after exposure",
      recommendedActions: [
        "Quarantine affected animals immediately",
        "Notify veterinary authorities",
        "Vaccinate unaffected animals",
      ],
      preventionTips: [
        "Implement strict biosecurity measures",
        "Regularly monitor livestock for symptoms",
        "Control animal movements",
      ],
    },
    {
      name: "Bovine Respiratory Disease",
      species: "Cattle",
      risk: "medium",
      keySymptoms: [
        "Persistent coughing",
        "Nasal and eye discharge",
        "Rapid or difficult breathing",
      ],
      detectionWindow: "Symptoms typically appear within 7-14 days of stress or exposure",
      riskLevel: "Medium risk of spread",
      earlyWarningSigns: [
        "Persistent coughing",
        "Labored breathing",
        "Nasal discharge",
      ],
      detectionTimeline: "Symptoms become evident within 1-2 weeks of exposure",
      recommendedActions: [
        "Isolate affected animals",
        "Administer appropriate antibiotics as prescribed by a vet",
        "Provide supportive care like hydration and temperature control",
      ],
      preventionTips: [
        "Minimize stress factors in livestock",
        "Maintain proper ventilation in barns",
        "Vaccinate against respiratory pathogens",
      ],
    },
    {
      name: "Pseudorabies",
      species: "Pig",
      risk: "high",
      keySymptoms: [
        "Fever",
        "Loss of coordination",
        "Seizures",
        "Paralysis",
      ],
      detectionWindow: "Symptoms appear 5-14 days post exposure",
      riskLevel: "High risk of spread",
      earlyWarningSigns: [
        "Fever and nervous system abnormalities",
        "Slight coordination loss",
      ],
      detectionTimeline: "Symptoms develop within 5-14 days of exposure",
      recommendedActions: [
        "Quarantine affected pigs immediately",
        "Consult veterinary authorities",
        "Vaccinate unaffected animals",
      ],
      preventionTips: [
        "Maintain strict biosecurity",
        "Regular veterinary checks",
        "Avoid introducing infected animals",
      ],
    },
    {
      name: "Scrapie",
      species: "Sheep",
      risk: "medium",
      keySymptoms: [
        "Itchy skin",
        "Loss of coordination",
        "Weight loss despite good appetite",
        "Behavioral changes",
      ],
      detectionWindow: "Symptoms appear 2-5 years post exposure",
      riskLevel: "Medium risk of spread",
      earlyWarningSigns: [
        "Excessive itching and rubbing",
        "Behavioral changes such as aggression or nervousness",
      ],
      detectionTimeline: "Symptoms develop 2-5 years post exposure",
      recommendedActions: [
        "Isolate affected sheep",
        "Notify health authorities",
        "Avoid breeding infected animals",
      ],
      preventionTips: [
        "Monitor flock health regularly",
        "Culling infected animals",
        "Maintain biosecurity protocols",
      ],
    },
    {
      name: "Avian Influenza (Bird Flu)",
      species: "Poultry",
      risk: "high",
      keySymptoms: [
        "Sudden death",
        "Swelling of head, neck, and eyes",
        "Coughing and sneezing",
        "Loss of appetite",
      ],
      detectionWindow: "Symptoms can appear 1-3 days post exposure",
      riskLevel: "High risk of spread",
      earlyWarningSigns: [
        "Rapid loss of appetite",
        "Changes in egg production",
      ],
      detectionTimeline: "Symptoms appear 1-3 days after exposure",
      recommendedActions: [
        "Quarantine infected birds",
        "Inform authorities and cull infected birds",
        "Clean and disinfect the barn",
      ],
      preventionTips: [
        "Limit bird contact with wild birds",
        "Regularly disinfect equipment and housing",
        "Vaccinate where possible",
      ],
    },
    {
      name: "Contagious Caprine Pleuropneumonia",
      species: "Goat",
      risk: "high",
      keySymptoms: [
        "Fever",
        "Difficulty breathing",
        "Nasal discharge",
        "Coughing",
      ],
      detectionWindow: "Symptoms appear 1-3 days post exposure",
      riskLevel: "High risk of spread",
      earlyWarningSigns: [
        "Rapid breathing",
        "Coughing and nasal discharge",
      ],
      detectionTimeline: "Symptoms appear 1-3 days after exposure",
      recommendedActions: [
        "Isolate infected goats",
        "Consult a veterinarian for antibiotics",
        "Culling may be required in severe cases",
      ],
      preventionTips: [
        "Avoid overcrowding in pens",
        "Maintain clean and dry living conditions",
        "Vaccinate against known diseases",
      ],
    },
    {
      name: "All Animal Influenza",
      species: "All Animals",
      risk: "medium",
      keySymptoms: [
        "Coughing and sneezing",
        "Fever",
        "Loss of appetite",
        "Tiredness",
      ],
      detectionWindow: "Symptoms appear 2-4 days after exposure",
      riskLevel: "Medium risk of spread",
      earlyWarningSigns: [
        "Respiratory distress",
        "Lethargy",
      ],
      detectionTimeline: "Symptoms appear 2-4 days post exposure",
      recommendedActions: [
        "Quarantine sick animals",
        "Notify authorities and consult a vet",
        "Provide supportive care",
      ],
      preventionTips: [
        "Ensure proper hygiene",
        "Minimize animal contact with infected populations",
        "Provide vaccines where available",
      ],
    },
    // Lower Risk Diseases
    {
      name: "Caseous Lymphadenitis (CL)",
      species: "Sheep, Goats",
      risk: "low",
      keySymptoms: [
        "Swollen lymph nodes",
        "Abscess formation under the skin",
        "Weight loss",
      ],
      detectionWindow: "Symptoms appear gradually",
      riskLevel: "Low risk of spread",
      earlyWarningSigns: [
        "Visible abscesses on neck or jaw",
        "Loss of condition despite adequate feeding",
      ],
      detectionTimeline: "Symptoms develop over time",
      recommendedActions: [
        "Isolate infected animals",
        "Practice good hygiene and sanitation",
        "Prevent overcrowding in pens",
      ],
      preventionTips: [
        "Regular health checks",
        "Minimize stress",
        "Maintain good farm hygiene",
      ],
    },
    {
      name: "Pink Eye (Infectious Bovine Keratoconjunctivitis)",
      species: "Cattle",
      risk: "low",
      keySymptoms: [
        "Red, swollen eyes",
        "Excessive tearing",
        "Squinting and sensitivity to light",
      ],
      detectionWindow: "Symptoms appear 2-7 days post exposure",
      riskLevel: "Low risk of spread",
      earlyWarningSigns: [
        "Eye discharge",
        "Conjunctivitis",
        "Lachrymation",
      ],
      detectionTimeline: "Symptoms typically appear within a week",
      recommendedActions: [
        "Minimize dust exposure",
        "Provide clean, dry bedding",
        "Isolate infected animals",
      ],
      preventionTips: [
        "Maintain proper hygiene",
        "Prevent overcrowding",
        "Provide good ventilation",
      ],
    },
    {
      name: "Tetanus",
      species: "Cattle, Horses, Pigs, Sheep, Goats",
      risk: "low",
      keySymptoms: [
        "Muscle stiffness",
        "Lockjaw",
        "Difficulty moving",
      ],
      detectionWindow: "Symptoms appear 5-10 days after injury",
      riskLevel: "Low risk of spread",
      earlyWarningSigns: [
        "Muscle rigidity",
        "Sensitivity to sound",
        "Jaw clenching",
      ],
      detectionTimeline: "Symptoms emerge after injury",
      recommendedActions: [
        "Administer tetanus vaccination",
        "Provide wound care",
        "Isolate affected animals",
      ],
      preventionTips: [
        "Prevent injuries",
        "Ensure vaccination for tetanus",
        "Keep living environments clean",
      ],
    },
    {
      name: "Cryptosporidiosis",
      species: "Cattle, Sheep, Goats",
      risk: "low",
      keySymptoms: [
        "Diarrhea",
        "Dehydration",
        "Reduced weight gain",
      ],
      detectionWindow: "Symptoms appear 2-7 days post exposure",
      riskLevel: "Low risk of spread",
      earlyWarningSigns: [
        "Diarrhea with mucous",
        "Loss of appetite",
        "Dehydration",
      ],
      detectionTimeline: "Symptoms become evident within a week",
      recommendedActions: [
        "Clean water sources",
        "Isolate affected animals",
        "Improve sanitation",
      ],
      preventionTips: [
        "Good hygiene practices",
        "Regular veterinary checks",
        "Ensure clean drinking water",
      ],
    },
    {
      name: "Leptospirosis",
      species: "Cattle, Pigs, Horses",
      risk: "low",
      keySymptoms: [
        "Fever",
        "Jaundice",
        "Lethargy",
      ],
      detectionWindow: "Symptoms appear 7-14 days post exposure",
      riskLevel: "Low risk of spread",
      earlyWarningSigns: [
        "Fever",
        "Lethargy",
        "Increased drinking and urination",
      ],
      detectionTimeline: "Symptoms develop within 1-2 weeks of exposure",
      recommendedActions: [
        "Vaccinate against leptospirosis",
        "Control rodent populations",
        "Provide clean water sources",
      ],
      preventionTips: [
        "Proper sanitation",
        "Control wildlife access to pastures",
        "Vaccinate regularly",
      ],
    },
  ];
  
  

  const filteredDiseases = diseases.filter(
    (disease) =>
      (disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.keySymptoms.some((symptom) =>
          symptom.toLowerCase().includes(searchTerm.toLowerCase())
        )) &&
      (selectedSpecies === "all" || disease.species === selectedSpecies)
  );

  // Function to open the modal with disease details
  const handleLearnMore = (disease) => {
    setSelectedDisease(disease); // Set the selected disease
    setIsModalOpen(true); // Open the modal
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDisease(null);
  };

  return (
    <div className="disease-container">
     
      <SearchBar onSearch={(term) => setSearchTerm(term)} />
      
      <div className="filters">
        <Filter 
          onSpeciesChange={(e) => setSelectedSpecies(e.target.value)}  
        />
      </div>

      <div className="disease-grid">
        {filteredDiseases.map((disease, index) => (
          <DiseaseCard
            key={index}
            disease={disease}
            onLearnMore={() => handleLearnMore(disease)}  // Pass the handleLearnMore function
          />
        ))}
      </div>

      {/* Modal to display disease details */}
      <Modal isOpen={isModalOpen} onClose={closeModal} disease={selectedDisease} />
    </div>
  );
};

export default Disease;
