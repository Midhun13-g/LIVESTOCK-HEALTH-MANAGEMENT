import React, { useState } from "react";
import Modal from "./Modal";
import DiseaseCard from "./DiseaseCard";
import "./Disease.css";

export const DISEASES = [
  {
    name: "Foot and Mouth Disease", species: "Cattle", risk: "high",
    keySymptoms: ["Fever and elevated body temperature", "Blisters around mouth, feet, and teats", "Reduced appetite and depression"],
    riskLevel: "High risk of spread", detectionTimeline: "Symptoms become apparent 2–3 days after exposure",
    earlyWarningSigns: ["Fever over 40°C", "Lameness in animals", "Blisters on mouth and feet"],
    recommendedActions: ["Quarantine affected animals immediately", "Notify veterinary authorities", "Vaccinate unaffected animals"],
    preventionTips: ["Implement strict biosecurity measures", "Regularly monitor livestock for symptoms", "Control animal movements"],
    transmission: "Direct contact with infected animals, contaminated feed, water, or equipment",
    mortalityRate: "Low in adults (<5%), higher in young animals (up to 50%)",
    treatment: "No specific treatment; supportive care, wound cleaning, and soft feed. Vaccination is the primary control.",
    zoonotic: false,
    affectedAgeGroups: "All ages; young animals most severely affected",
  },
  {
    name: "Bovine Respiratory Disease", species: "Cattle", risk: "medium",
    keySymptoms: ["Persistent coughing", "Nasal and eye discharge", "Rapid or difficult breathing"],
    riskLevel: "Medium risk of spread", detectionTimeline: "Symptoms become evident within 1–2 weeks of exposure",
    earlyWarningSigns: ["Persistent coughing", "Labored breathing", "Nasal discharge"],
    recommendedActions: ["Isolate affected animals", "Administer appropriate antibiotics as prescribed by a vet", "Provide supportive care"],
    preventionTips: ["Minimize stress factors in livestock", "Maintain proper ventilation in barns", "Vaccinate against respiratory pathogens"],
    transmission: "Airborne droplets, direct contact, stress-induced immunosuppression",
    mortalityRate: "1–5% if untreated; low with early treatment",
    treatment: "Antibiotics (florfenicol, tulathromycin), anti-inflammatories, supportive fluids",
    zoonotic: false,
    affectedAgeGroups: "Primarily calves 6 weeks to 6 months; feedlot cattle",
  },
  {
    name: "Pseudorabies (Aujeszky's Disease)", species: "Pig", risk: "high",
    keySymptoms: ["Fever", "Loss of coordination", "Seizures", "Paralysis"],
    riskLevel: "High risk of spread", detectionTimeline: "Symptoms develop within 5–14 days of exposure",
    earlyWarningSigns: ["Fever and nervous system abnormalities", "Slight coordination loss"],
    recommendedActions: ["Quarantine affected pigs immediately", "Consult veterinary authorities", "Vaccinate unaffected animals"],
    preventionTips: ["Maintain strict biosecurity", "Regular veterinary checks", "Avoid introducing infected animals"],
    transmission: "Direct contact, aerosol, contaminated fomites; wild boar are reservoir hosts",
    mortalityRate: "Near 100% in piglets under 1 week; 5–10% in adults",
    treatment: "No cure; vaccination reduces severity. Supportive care for affected animals.",
    zoonotic: false,
    affectedAgeGroups: "All ages; neonatal piglets most vulnerable",
  },
  {
    name: "Scrapie", species: "Sheep", risk: "medium",
    keySymptoms: ["Itchy skin", "Loss of coordination", "Weight loss despite good appetite", "Behavioral changes"],
    riskLevel: "Medium risk of spread", detectionTimeline: "Symptoms develop 2–5 years post exposure",
    earlyWarningSigns: ["Excessive itching and rubbing", "Behavioral changes such as aggression or nervousness"],
    recommendedActions: ["Isolate affected sheep", "Notify health authorities", "Avoid breeding infected animals"],
    preventionTips: ["Monitor flock health regularly", "Culling infected animals", "Maintain biosecurity protocols"],
    transmission: "Prion protein via direct contact, contaminated pasture, placenta",
    mortalityRate: "100% — always fatal once clinical signs appear",
    treatment: "No treatment available. Genetic selection for resistant breeds (ARR/ARR genotype).",
    zoonotic: false,
    affectedAgeGroups: "Adults 2–5 years old",
  },
  {
    name: "Avian Influenza (Bird Flu)", species: "Poultry", risk: "high",
    keySymptoms: ["Sudden death", "Swelling of head, neck, and eyes", "Coughing and sneezing", "Loss of appetite"],
    riskLevel: "High risk of spread", detectionTimeline: "Symptoms appear 1–3 days after exposure",
    earlyWarningSigns: ["Rapid loss of appetite", "Changes in egg production"],
    recommendedActions: ["Quarantine infected birds", "Inform authorities and cull infected birds", "Clean and disinfect the barn"],
    preventionTips: ["Limit bird contact with wild birds", "Regularly disinfect equipment and housing", "Vaccinate where possible"],
    transmission: "Direct contact with infected birds, contaminated water, fomites, wild bird migration",
    mortalityRate: "Up to 100% for HPAI strains within 48 hours",
    treatment: "No treatment for HPAI; antiviral drugs (oseltamivir) used in some cases. Culling is primary control.",
    zoonotic: true,
    affectedAgeGroups: "All ages and species of birds",
  },
  {
    name: "Contagious Caprine Pleuropneumonia", species: "Goat", risk: "high",
    keySymptoms: ["Fever", "Difficulty breathing", "Nasal discharge", "Coughing"],
    riskLevel: "High risk of spread", detectionTimeline: "Symptoms appear 1–3 days after exposure",
    earlyWarningSigns: ["Rapid breathing", "Coughing and nasal discharge"],
    recommendedActions: ["Isolate infected goats", "Consult a veterinarian for antibiotics", "Culling may be required in severe cases"],
    preventionTips: ["Avoid overcrowding in pens", "Maintain clean and dry living conditions", "Vaccinate against known diseases"],
    transmission: "Airborne droplets from infected animals; close contact",
    mortalityRate: "Up to 80% in naive herds without treatment",
    treatment: "Tylosin, oxytetracycline, or tiamulin antibiotics. Early treatment critical.",
    zoonotic: false,
    affectedAgeGroups: "All ages; adults more commonly affected",
  },
  {
    name: "Caseous Lymphadenitis (CL)", species: "Sheep, Goats", risk: "low",
    keySymptoms: ["Swollen lymph nodes", "Abscess formation under the skin", "Weight loss"],
    riskLevel: "Low risk of spread", detectionTimeline: "Symptoms develop over weeks to months",
    earlyWarningSigns: ["Visible abscesses on neck or jaw", "Loss of condition despite adequate feeding"],
    recommendedActions: ["Isolate infected animals", "Practice good hygiene and sanitation", "Prevent overcrowding in pens"],
    preventionTips: ["Regular health checks", "Minimize stress", "Maintain good farm hygiene"],
    transmission: "Corynebacterium pseudotuberculosis via skin wounds, shearing cuts, contaminated soil",
    mortalityRate: "Low; chronic debilitating disease rather than acutely fatal",
    treatment: "Surgical drainage of abscesses, antibiotic therapy (penicillin). Vaccination available in some countries.",
    zoonotic: true,
    affectedAgeGroups: "Adults most commonly; rare in young animals",
  },
  {
    name: "Pink Eye (Infectious Bovine Keratoconjunctivitis)", species: "Cattle", risk: "low",
    keySymptoms: ["Red, swollen eyes", "Excessive tearing", "Squinting and sensitivity to light"],
    riskLevel: "Low risk of spread", detectionTimeline: "Symptoms typically appear within a week",
    earlyWarningSigns: ["Eye discharge", "Conjunctivitis", "Lachrymation"],
    recommendedActions: ["Minimize dust exposure", "Provide clean, dry bedding", "Isolate infected animals"],
    preventionTips: ["Maintain proper hygiene", "Prevent overcrowding", "Provide good ventilation"],
    transmission: "Moraxella bovis bacteria; spread by flies, direct contact, dust",
    mortalityRate: "Rarely fatal; can cause permanent blindness if untreated",
    treatment: "Topical or systemic antibiotics (oxytetracycline, penicillin). Eye patches to reduce UV exposure.",
    zoonotic: false,
    affectedAgeGroups: "Young cattle under 2 years most susceptible",
  },
  {
    name: "Tetanus", species: "Cattle, Horses, Pigs, Sheep, Goats", risk: "low",
    keySymptoms: ["Muscle stiffness", "Lockjaw", "Difficulty moving"],
    riskLevel: "Low risk of spread", detectionTimeline: "Symptoms emerge 1–3 weeks after injury",
    earlyWarningSigns: ["Muscle rigidity", "Sensitivity to sound", "Jaw clenching"],
    recommendedActions: ["Administer tetanus antitoxin", "Provide wound care", "Isolate affected animals"],
    preventionTips: ["Prevent injuries", "Ensure vaccination for tetanus", "Keep living environments clean"],
    transmission: "Clostridium tetani spores enter through wounds; not contagious between animals",
    mortalityRate: "50–80% without treatment; lower with early antitoxin",
    treatment: "Tetanus antitoxin, penicillin, wound debridement, muscle relaxants, supportive care",
    zoonotic: false,
    affectedAgeGroups: "All ages; unvaccinated animals at highest risk",
  },
  {
    name: "Leptospirosis", species: "Cattle, Pigs, Horses", risk: "low",
    keySymptoms: ["Fever", "Jaundice", "Lethargy", "Reduced milk production"],
    riskLevel: "Low risk of spread", detectionTimeline: "Symptoms develop within 1–2 weeks of exposure",
    earlyWarningSigns: ["Fever", "Lethargy", "Increased drinking and urination"],
    recommendedActions: ["Vaccinate against leptospirosis", "Control rodent populations", "Provide clean water sources"],
    preventionTips: ["Proper sanitation", "Control wildlife access to pastures", "Vaccinate regularly"],
    transmission: "Leptospira bacteria via urine-contaminated water, soil, or direct contact",
    mortalityRate: "Variable; 5–15% in acute cases; chronic form causes reproductive losses",
    treatment: "Penicillin or streptomycin antibiotics; supportive fluids and care",
    zoonotic: true,
    affectedAgeGroups: "All ages; young animals and pregnant females most at risk",
  },
  {
    name: "Bovine Tuberculosis", species: "Cattle", risk: "high",
    keySymptoms: ["Progressive weight loss", "Chronic cough", "Enlarged lymph nodes", "Reduced milk yield"],
    riskLevel: "High risk of spread", detectionTimeline: "Months to years; slow progressive disease",
    earlyWarningSigns: ["Gradual weight loss", "Intermittent cough", "Reduced productivity"],
    recommendedActions: ["Test-and-slaughter policy", "Notify animal health authorities", "Restrict animal movements"],
    preventionTips: ["Regular tuberculin skin testing", "Strict biosecurity", "Control badger populations in endemic areas"],
    transmission: "Mycobacterium bovis via aerosol, contaminated feed/water, direct contact",
    mortalityRate: "Chronic disease; animals rarely die acutely but are culled",
    treatment: "No treatment permitted in most countries; infected animals are culled",
    zoonotic: true,
    affectedAgeGroups: "All ages; older animals more commonly test positive",
  },
  {
    name: "Brucellosis", species: "Cattle, Sheep, Goats, Pigs", risk: "high",
    keySymptoms: ["Abortion in late pregnancy", "Retained placenta", "Reduced fertility", "Orchitis in males"],
    riskLevel: "High risk of spread", detectionTimeline: "Abortion typically occurs in last trimester",
    earlyWarningSigns: ["Abortion storms in herd", "Retained placenta", "Weak newborns"],
    recommendedActions: ["Quarantine and test all animals", "Notify authorities immediately", "Vaccinate susceptible animals"],
    preventionTips: ["Vaccinate heifers (S19 or RB51)", "Test all purchased animals", "Maintain closed herds"],
    transmission: "Brucella spp. via aborted fetuses, placenta, vaginal discharge, milk, direct contact",
    mortalityRate: "Low mortality but severe reproductive losses",
    treatment: "No treatment in livestock; infected animals are culled. Vaccination is primary control.",
    zoonotic: true,
    affectedAgeGroups: "Sexually mature animals; pregnant females most affected",
  },
  {
    name: "Newcastle Disease", species: "Poultry", risk: "high",
    keySymptoms: ["Sudden death", "Respiratory distress", "Nervous signs (twisting neck)", "Drop in egg production"],
    riskLevel: "High risk of spread", detectionTimeline: "Symptoms appear 2–15 days after exposure",
    earlyWarningSigns: ["Sudden drop in egg production", "Gasping and coughing", "Green diarrhea"],
    recommendedActions: ["Quarantine flock immediately", "Report to veterinary authorities", "Depopulate if VVND confirmed"],
    preventionTips: ["Vaccinate regularly (La Sota, B1 strains)", "Strict biosecurity", "Prevent contact with wild birds"],
    transmission: "Airborne, direct contact, contaminated equipment, wild birds",
    mortalityRate: "Up to 100% for velogenic strains in unvaccinated flocks",
    treatment: "No specific treatment; supportive care and vaccination of exposed birds",
    zoonotic: false,
    affectedAgeGroups: "All ages; unvaccinated flocks most vulnerable",
  },
  {
    name: "African Swine Fever", species: "Pig", risk: "high",
    keySymptoms: ["High fever (40–42°C)", "Hemorrhagic skin lesions", "Vomiting and diarrhea", "Sudden death"],
    riskLevel: "High risk of spread", detectionTimeline: "Symptoms appear 4–19 days after exposure",
    earlyWarningSigns: ["Sudden high fever", "Loss of appetite", "Reddening of skin on ears and flanks"],
    recommendedActions: ["Immediate quarantine and culling", "Notify authorities", "Disinfect all premises thoroughly"],
    preventionTips: ["Ban feeding kitchen scraps", "Strict biosecurity", "Control wild boar contact"],
    transmission: "Direct contact, contaminated feed (especially pork products), ticks (Ornithodoros), fomites",
    mortalityRate: "Up to 100% in acute form",
    treatment: "No vaccine or treatment available; stamping-out policy",
    zoonotic: false,
    affectedAgeGroups: "All ages equally susceptible",
  },
  {
    name: "Mastitis", species: "Cattle, Goats, Sheep", risk: "medium",
    keySymptoms: ["Swollen, hot, painful udder", "Abnormal milk (clots, watery, bloody)", "Reduced milk yield", "Fever"],
    riskLevel: "Medium risk of spread", detectionTimeline: "Clinical signs within 12–36 hours of infection",
    earlyWarningSigns: ["Changes in milk appearance", "Udder asymmetry", "Animal reluctance to be milked"],
    recommendedActions: ["Strip and discard infected milk", "Administer intramammary antibiotics", "Consult vet for systemic cases"],
    preventionTips: ["Teat dipping post-milking", "Dry cow therapy", "Maintain clean milking equipment"],
    transmission: "Staphylococcus aureus, Streptococcus spp., E. coli via milking equipment, environment",
    mortalityRate: "Low; peracute coliform mastitis can be fatal without rapid treatment",
    treatment: "Intramammary antibiotics, systemic antibiotics for severe cases, anti-inflammatories, frequent stripping",
    zoonotic: false,
    affectedAgeGroups: "Lactating females of all ages; older high-producing cows most at risk",
  },
  {
    name: "Bluetongue", species: "Sheep, Cattle, Goats", risk: "medium",
    keySymptoms: ["Fever", "Swollen face and tongue (blue discoloration)", "Lameness", "Nasal discharge"],
    riskLevel: "Medium risk of spread", detectionTimeline: "Incubation 5–20 days after midge bite",
    earlyWarningSigns: ["Facial swelling", "Excessive salivation", "Reddening of mucous membranes"],
    recommendedActions: ["Isolate affected animals", "Notify authorities", "Vaccinate susceptible animals"],
    preventionTips: ["Vaccinate in endemic areas", "Use insecticides to control Culicoides midges", "House animals at dusk/dawn"],
    transmission: "Culicoides biting midges (not directly contagious between animals)",
    mortalityRate: "2–30% in sheep; lower in cattle and goats",
    treatment: "No specific treatment; supportive care, anti-inflammatories, wound care for mouth lesions",
    zoonotic: false,
    affectedAgeGroups: "All ages; sheep most severely affected",
  },
  {
    name: "Ringworm (Dermatophytosis)", species: "Cattle, Horses, Sheep, Goats", risk: "low",
    keySymptoms: ["Circular crusty skin lesions", "Hair loss in patches", "Itching and irritation"],
    riskLevel: "Low risk of spread", detectionTimeline: "Lesions appear 1–4 weeks after exposure",
    earlyWarningSigns: ["Small raised circular patches", "Scaling and crusting of skin"],
    recommendedActions: ["Isolate affected animals", "Apply antifungal treatment", "Disinfect housing and equipment"],
    preventionTips: ["Avoid overcrowding", "Maintain good nutrition", "Disinfect shared equipment"],
    transmission: "Trichophyton and Microsporum fungi via direct contact, contaminated equipment, bedding",
    mortalityRate: "Non-fatal; self-limiting in most cases",
    treatment: "Topical antifungals (natamycin, enilconazole), oral griseofulvin in severe cases",
    zoonotic: true,
    affectedAgeGroups: "Young animals under 1 year most susceptible",
  },
  {
    name: "Clostridial Diseases (Blackleg)", species: "Cattle, Sheep", risk: "medium",
    keySymptoms: ["Sudden death", "Swollen, crepitant muscles", "High fever", "Severe lameness"],
    riskLevel: "Medium risk of spread", detectionTimeline: "Death often within 12–48 hours of first signs",
    earlyWarningSigns: ["Sudden lameness", "Swelling of hindquarters", "Depression and fever"],
    recommendedActions: ["Vaccinate entire herd immediately", "Remove carcasses promptly", "Notify vet"],
    preventionTips: ["Annual clostridial vaccination (7-in-1)", "Avoid soil disturbance in endemic areas", "Proper carcass disposal"],
    transmission: "Clostridium chauvoei spores from soil; not directly contagious",
    mortalityRate: "Near 100% once clinical signs appear",
    treatment: "High-dose penicillin if caught very early; usually fatal before treatment possible",
    zoonotic: false,
    affectedAgeGroups: "Cattle 6 months to 2 years; well-nourished rapidly growing animals",
  },
  {
    name: "Equine Influenza", species: "Horse", risk: "medium",
    keySymptoms: ["High fever (up to 41°C)", "Dry harsh cough", "Nasal discharge", "Muscle soreness"],
    riskLevel: "Medium risk of spread", detectionTimeline: "Symptoms appear 1–3 days after exposure",
    earlyWarningSigns: ["Sudden fever", "Dry cough", "Lethargy and reduced appetite"],
    recommendedActions: ["Rest affected horses for 3 weeks minimum", "Isolate from other horses", "Consult vet for secondary infections"],
    preventionTips: ["Biannual vaccination", "Quarantine new arrivals for 2 weeks", "Avoid crowded events during outbreaks"],
    transmission: "Highly contagious via aerosol droplets; spreads rapidly at shows and racing events",
    mortalityRate: "Low in healthy adults; higher risk in foals and elderly horses",
    treatment: "Rest, supportive care, NSAIDs for fever. Antibiotics only for secondary bacterial infections.",
    zoonotic: false,
    affectedAgeGroups: "All ages; unvaccinated young horses most at risk",
  },
  {
    name: "Porcine Reproductive and Respiratory Syndrome (PRRS)", species: "Pig", risk: "high",
    keySymptoms: ["Reproductive failure (abortions, stillbirths)", "Respiratory distress in piglets", "Blue discoloration of ears", "Fever"],
    riskLevel: "High risk of spread", detectionTimeline: "Reproductive signs within 2–3 weeks; respiratory signs in 1–2 weeks",
    earlyWarningSigns: ["Increased late-term abortions", "Weak-born piglets", "Ear cyanosis"],
    recommendedActions: ["Implement strict biosecurity", "Vaccinate breeding herd", "Notify vet immediately"],
    preventionTips: ["Closed herd management", "Vaccination of gilts before breeding", "Air filtration in barns"],
    transmission: "Aerosol, direct contact, semen, contaminated equipment, insects",
    mortalityRate: "5–20% in piglets; reproductive losses significant in sows",
    treatment: "No cure; vaccination reduces severity. Antibiotics for secondary infections.",
    zoonotic: false,
    affectedAgeGroups: "All ages; piglets and pregnant sows most severely affected",
  },
  {
    name: "Johne's Disease (Paratuberculosis)", species: "Cattle, Sheep, Goats", risk: "low",
    keySymptoms: ["Chronic watery diarrhea", "Progressive weight loss", "Bottle jaw (submandibular edema)", "Reduced milk production"],
    riskLevel: "Low risk of spread", detectionTimeline: "Clinical signs appear 2–10 years after infection",
    earlyWarningSigns: ["Gradual weight loss", "Intermittent diarrhea", "Reduced body condition score"],
    recommendedActions: ["Test and cull positive animals", "Prevent calves from exposure to manure", "Implement control program"],
    preventionTips: ["Test herd annually", "Separate calves from adult feces", "Vaccinate in endemic herds"],
    transmission: "Mycobacterium avium paratuberculosis via fecal-oral route; calves infected in first months of life",
    mortalityRate: "100% once clinical signs appear; slow progressive death",
    treatment: "No effective treatment; infected animals are culled",
    zoonotic: false,
    affectedAgeGroups: "Infection in calves; clinical signs in adults 2–10 years old",
  },
  {
    name: "Cryptosporidiosis", species: "Cattle, Sheep, Goats", risk: "low",
    keySymptoms: ["Profuse watery diarrhea", "Dehydration", "Reduced weight gain", "Lethargy"],
    riskLevel: "Low risk of spread", detectionTimeline: "Symptoms become evident within 3–7 days",
    earlyWarningSigns: ["Diarrhea with mucous", "Loss of appetite", "Rapid dehydration"],
    recommendedActions: ["Oral rehydration therapy", "Isolate affected animals", "Improve sanitation"],
    preventionTips: ["Good hygiene practices", "Regular veterinary checks", "Ensure clean drinking water"],
    transmission: "Cryptosporidium parvum oocysts via fecal-oral route, contaminated water",
    mortalityRate: "High in untreated neonates; low with supportive care",
    treatment: "Oral electrolyte rehydration; halofuginone in calves. No fully effective drug available.",
    zoonotic: true,
    affectedAgeGroups: "Neonates 1–3 weeks old most severely affected",
  },
  {
    name: "All Animal Influenza", species: "All Animals", risk: "medium",
    keySymptoms: ["Coughing and sneezing", "Fever", "Loss of appetite", "Tiredness"],
    riskLevel: "Medium risk of spread", detectionTimeline: "Symptoms appear 2–4 days post exposure",
    earlyWarningSigns: ["Respiratory distress", "Lethargy"],
    recommendedActions: ["Quarantine sick animals", "Notify authorities and consult a vet", "Provide supportive care"],
    preventionTips: ["Ensure proper hygiene", "Minimize animal contact with infected populations", "Provide vaccines where available"],
    transmission: "Airborne droplets, direct contact with infected animals or fomites",
    mortalityRate: "Variable by strain; generally low with supportive care",
    treatment: "Supportive care; antivirals in some species. Rest and hydration essential.",
    zoonotic: true,
    affectedAgeGroups: "All ages; immunocompromised and very young animals most at risk",
  },
];

const Disease = () => {
  const [searchTerm, setSearchTerm]         = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("all");
  const [selectedRisk, setSelectedRisk]     = useState("all");
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);

  const filtered = DISEASES.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.keySymptoms.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchSpecies = selectedSpecies === "all" || d.species.toLowerCase().includes(selectedSpecies.toLowerCase());
    const matchRisk    = selectedRisk === "all" || d.risk === selectedRisk;
    return matchSearch && matchSpecies && matchRisk;
  });

  const counts = {
    high:   DISEASES.filter(d => d.risk === "high").length,
    medium: DISEASES.filter(d => d.risk === "medium").length,
    low:    DISEASES.filter(d => d.risk === "low").length,
  };

  return (
    <div className="disease-page">
      <div className="disease-page-header">
        <h1>🦠 Disease Guide</h1>
        <p>Browse, search and learn about common livestock diseases, symptoms and prevention.</p>
      </div>

      <div className="disease-toolbar">
        <div className="disease-search-wrap">
          <span className="disease-search-icon">🔍</span>
          <input
            className="disease-search-input"
            type="text"
            placeholder="Search diseases, symptoms, or animals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="disease-filter-select" value={selectedSpecies} onChange={(e) => setSelectedSpecies(e.target.value)}>
          <option value="all">All Animals</option>
          <option value="Cattle">Cattle</option>
          <option value="Pig">Pig</option>
          <option value="Sheep">Sheep</option>
          <option value="Goat">Goat</option>
          <option value="Poultry">Poultry</option>
          <option value="Horse">Horse</option>
        </select>
        <select className="disease-filter-select" value={selectedRisk} onChange={(e) => setSelectedRisk(e.target.value)}>
          <option value="all">All Risk Levels</option>
          <option value="high">High Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="low">Low Risk</option>
        </select>
      </div>

      <div className="disease-stats">
        <span className="disease-stat-pill total">📋 {DISEASES.length} Total Diseases</span>
        <span className="disease-stat-pill high">🔴 {counts.high} High Risk</span>
        <span className="disease-stat-pill medium">🟡 {counts.medium} Medium Risk</span>
        <span className="disease-stat-pill low">🟢 {counts.low} Low Risk</span>
        <span className="disease-stat-pill zoonotic">⚠️ {DISEASES.filter(d => d.zoonotic).length} Zoonotic</span>
      </div>

      <div className="disease-grid">
        {filtered.length === 0 ? (
          <div className="disease-empty">No diseases match your search. Try different keywords.</div>
        ) : (
          filtered.map((disease, i) => (
            <DiseaseCard key={i} disease={disease} onLearnMore={() => { setSelectedDisease(disease); setIsModalOpen(true); }} />
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedDisease(null); }} disease={selectedDisease} />
    </div>
  );
};

export default Disease;
