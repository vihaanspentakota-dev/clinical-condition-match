// ============================================================
// ClinicalMatch — Symptom to Condition Matcher
// Built by Vihaan Pentakota & Rayhan Garuthman | ThinkNeuro 2026
// ============================================================

const CONDITIONS = [
  {
    name: "Influenza (Flu)",
    symptoms: ["fever", "chills", "headache", "muscle aches", "fatigue", "cough", "sore throat", "runny nose", "body aches", "weakness", "sweating"],
    description: "A highly contagious viral respiratory illness caused by influenza viruses. Symptoms typically come on suddenly and are more severe than the common cold.",
    specialty: "Primary Care / Infectious Disease",
    urgency: "routine",
    urgencyLabel: "See doctor within 24-48h"
  },
  {
    name: "Common Cold (Rhinovirus)",
    symptoms: ["runny nose", "sneezing", "sore throat", "cough", "congestion", "mild fever", "headache", "fatigue", "watery eyes"],
    description: "A mild viral infection of the upper respiratory tract. Usually resolves on its own within 7-10 days without medical treatment.",
    specialty: "Primary Care",
    urgency: "routine",
    urgencyLabel: "Rest and monitor"
  },
  {
    name: "COVID-19",
    symptoms: ["fever", "cough", "shortness of breath", "fatigue", "loss of taste", "loss of smell", "sore throat", "headache", "muscle aches", "chills", "congestion", "nausea", "diarrhea"],
    description: "A respiratory illness caused by the SARS-CoV-2 coronavirus. Symptoms range from mild to severe and can include loss of taste or smell, which is a distinguishing feature.",
    specialty: "Primary Care / Infectious Disease",
    urgency: "prompt",
    urgencyLabel: "Test and isolate promptly"
  },
  {
    name: "Strep Throat",
    symptoms: ["sore throat", "fever", "swollen lymph nodes", "difficulty swallowing", "headache", "stomach pain", "nausea", "red throat", "white patches throat"],
    description: "A bacterial infection caused by Group A Streptococcus. Unlike viral sore throats, strep requires antibiotic treatment to prevent complications.",
    specialty: "Primary Care / ENT",
    urgency: "prompt",
    urgencyLabel: "See doctor for throat swab"
  },
  {
    name: "Pneumonia",
    symptoms: ["cough", "fever", "chills", "shortness of breath", "chest pain", "fatigue", "sweating", "nausea", "vomiting", "confusion", "rapid breathing"],
    description: "An infection that inflames the air sacs in one or both lungs. Can be caused by bacteria, viruses, or fungi. Can be serious, especially in elderly patients.",
    specialty: "Pulmonology / Primary Care",
    urgency: "prompt",
    urgencyLabel: "Seek care promptly"
  },
  {
    name: "Migraine",
    symptoms: ["headache", "nausea", "vomiting", "light sensitivity", "sound sensitivity", "visual aura", "throbbing pain", "dizziness", "fatigue"],
    description: "A neurological condition characterized by intense, debilitating headaches often accompanied by nausea and sensitivity to light and sound. Can last hours to days.",
    specialty: "Neurology",
    urgency: "routine",
    urgencyLabel: "Neurology consult recommended"
  },
  {
    name: "Appendicitis",
    symptoms: ["stomach pain", "abdominal pain", "nausea", "vomiting", "fever", "loss of appetite", "pain right side", "rebound tenderness"],
    description: "Inflammation of the appendix causing severe abdominal pain. This is a medical emergency — the appendix can rupture if untreated, causing life-threatening infection.",
    specialty: "Emergency Surgery",
    urgency: "emergency",
    urgencyLabel: "Emergency — go to ER now"
  },
  {
    name: "Urinary Tract Infection (UTI)",
    symptoms: ["burning urination", "frequent urination", "pelvic pain", "cloudy urine", "strong odor urine", "blood in urine", "lower back pain", "fever", "chills"],
    description: "A bacterial infection in any part of the urinary system. More common in women. Can progress to a kidney infection if left untreated.",
    specialty: "Primary Care / Urology",
    urgency: "prompt",
    urgencyLabel: "See doctor within 24-48h"
  },
  {
    name: "Asthma Attack",
    symptoms: ["shortness of breath", "wheezing", "chest tightness", "cough", "difficulty breathing", "rapid breathing", "anxiety"],
    description: "A condition where airways narrow and swell, producing extra mucus that makes breathing difficult. Triggers include allergens, exercise, cold air, and respiratory infections.",
    specialty: "Pulmonology / Allergy",
    urgency: "emergency",
    urgencyLabel: "Use inhaler — seek ER if severe"
  },
  {
    name: "Anxiety Disorder",
    symptoms: ["racing heart", "shortness of breath", "chest tightness", "dizziness", "sweating", "trembling", "nausea", "fatigue", "difficulty concentrating", "restlessness", "headache", "muscle tension"],
    description: "A mental health condition characterized by persistent worry, fear, or unease. Physical symptoms like chest tightness and shortness of breath are common and can mimic cardiac issues.",
    specialty: "Psychiatry / Psychology",
    urgency: "routine",
    urgencyLabel: "Schedule mental health consult"
  },
  {
    name: "Gastroenteritis (Stomach Flu)",
    symptoms: ["nausea", "vomiting", "diarrhea", "stomach cramps", "abdominal pain", "fever", "headache", "muscle aches", "fatigue", "loss of appetite"],
    description: "Inflammation of the stomach and intestines, usually caused by a viral or bacterial infection. Usually resolves within a few days with rest and hydration.",
    specialty: "Primary Care / Gastroenterology",
    urgency: "routine",
    urgencyLabel: "Rest, hydrate, monitor"
  },
  {
    name: "Hypertensive Crisis",
    symptoms: ["severe headache", "chest pain", "shortness of breath", "vision changes", "nausea", "vomiting", "confusion", "nosebleed", "anxiety"],
    description: "A sudden, severe increase in blood pressure that can lead to stroke, heart attack, or organ damage. Blood pressure above 180/120 mmHg with symptoms is a medical emergency.",
    specialty: "Emergency Medicine / Cardiology",
    urgency: "emergency",
    urgencyLabel: "Emergency — call 911 immediately"
  },
  {
    name: "Type 2 Diabetes (Uncontrolled)",
    symptoms: ["frequent urination", "excessive thirst", "fatigue", "blurred vision", "slow healing wounds", "frequent infections", "numbness hands", "numbness feet", "unexplained weight loss"],
    description: "A chronic condition affecting how the body processes blood sugar. Uncontrolled diabetes can cause serious complications affecting the heart, kidneys, eyes, and nerves.",
    specialty: "Endocrinology / Primary Care",
    urgency: "prompt",
    urgencyLabel: "Schedule endocrinology consult"
  },
  {
    name: "Heart Attack (Myocardial Infarction)",
    symptoms: ["chest pain", "chest pressure", "shortness of breath", "left arm pain", "jaw pain", "nausea", "sweating", "dizziness", "fatigue", "back pain", "lightheadedness"],
    description: "Occurs when blood flow to part of the heart is blocked. Every minute without treatment increases damage. Women may experience atypical symptoms like nausea and jaw pain.",
    specialty: "Emergency Cardiology",
    urgency: "emergency",
    urgencyLabel: "Emergency — call 911 immediately"
  },
  {
    name: "Anemia (Iron Deficiency)",
    symptoms: ["fatigue", "weakness", "pale skin", "shortness of breath", "dizziness", "headache", "cold hands", "cold feet", "brittle nails", "chest pain", "irregular heartbeat"],
    description: "A condition where there aren't enough healthy red blood cells to carry adequate oxygen to tissues. Iron deficiency is the most common cause worldwide.",
    specialty: "Hematology / Primary Care",
    urgency: "routine",
    urgencyLabel: "Schedule blood work"
  },
  {
    name: "Allergic Reaction",
    symptoms: ["hives", "itching", "rash", "swelling", "runny nose", "watery eyes", "sneezing", "shortness of breath", "wheezing", "nausea", "dizziness"],
    description: "The immune system's overreaction to a substance it identifies as harmful. Range from mild (rash, sneezing) to severe (anaphylaxis). Severe reactions require immediate epinephrine.",
    specialty: "Allergy / Immunology",
    urgency: "prompt",
    urgencyLabel: "Seek care — carry epinephrine if prescribed"
  },
  {
    name: "Depression",
    symptoms: ["persistent sadness", "fatigue", "loss of interest", "sleep changes", "appetite changes", "difficulty concentrating", "feelings of worthlessness", "headache", "body aches", "social withdrawal"],
    description: "A mood disorder causing persistent feelings of sadness and loss of interest. Affects how you feel, think, and behave and can lead to various emotional and physical problems.",
    specialty: "Psychiatry / Psychology",
    urgency: "routine",
    urgencyLabel: "Schedule mental health evaluation"
  },
  {
    name: "Concussion",
    symptoms: ["headache", "confusion", "dizziness", "nausea", "vomiting", "memory problems", "sensitivity to light", "sensitivity to noise", "blurred vision", "fatigue", "sleep disturbance"],
    description: "A traumatic brain injury caused by a blow to the head. Most concussions are not life-threatening but require careful monitoring. Repeated concussions can cause lasting damage.",
    specialty: "Neurology / Sports Medicine",
    urgency: "prompt",
    urgencyLabel: "Neurological evaluation needed"
  },
  {
    name: "Dehydration",
    symptoms: ["thirst", "dark urine", "dizziness", "fatigue", "headache", "dry mouth", "decreased urination", "confusion", "rapid heartbeat", "sunken eyes", "muscle cramps"],
    description: "Occurs when the body loses more fluids than it takes in. Mild dehydration is common and treatable with fluids, but severe dehydration is a medical emergency.",
    specialty: "Primary Care / Emergency Medicine",
    urgency: "routine",
    urgencyLabel: "Rehydrate immediately"
  },
  {
    name: "Sinusitis",
    symptoms: ["facial pain", "nasal congestion", "headache", "runny nose", "postnasal drip", "cough", "fever", "fatigue", "dental pain", "bad breath", "loss of smell"],
    description: "Inflammation of the sinuses, often following a cold or allergic reaction. Can be viral (resolves on its own) or bacterial (requires antibiotics).",
    specialty: "ENT / Primary Care",
    urgency: "routine",
    urgencyLabel: "Monitor — see doctor if persists"
  }
];

// Normalize text for matching
function normalize(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

// Calculate match score between input symptoms and condition
function calculateMatch(inputSymptoms, condition) {
  const condSymptoms = condition.symptoms.map(normalize);
  let matched = [];
  let score = 0;

  for (const input of inputSymptoms) {
    const normInput = normalize(input);
    if (!normInput) continue;

    for (const condSymptom of condSymptoms) {
      if (
        condSymptom.includes(normInput) ||
        normInput.includes(condSymptom) ||
        levenshtein(normInput, condSymptom) <= 2
      ) {
        if (!matched.includes(condSymptom)) {
          matched.push(condSymptom);
          // Weight: exact match scores higher
          score += condSymptom === normInput ? 2 : 1;
        }
        break;
      }
    }
  }

  const matchPercent = Math.round((matched.length / condSymptoms.length) * 100);
  const inputCoverage = Math.round((matched.length / inputSymptoms.length) * 100);
  const finalScore = (matchPercent * 0.6) + (inputCoverage * 0.4);

  return { matched, matchPercent, finalScore };
}

// Simple Levenshtein distance for fuzzy matching
function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b[i-1] === a[j-1]
        ? matrix[i-1][j-1]
        : Math.min(matrix[i-1][j-1] + 1, matrix[i][j-1] + 1, matrix[i-1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
}

function getMatchLevel(score) {
  if (score >= 40) return 'high';
  if (score >= 20) return 'medium';
  return 'low';
}

function addSymptom(symptom) {
  const input = document.getElementById('symptom-input');
  const current = input.value.trim();
  if (current === '') {
    input.value = symptom;
  } else if (!current.toLowerCase().includes(symptom)) {
    input.value = current + ', ' + symptom;
  }
  input.focus();
}

function matchSymptoms() {
  const input = document.getElementById('symptom-input').value.trim();
  if (!input) return;

  const btnText = document.getElementById('btn-text');
  const btnLoader = document.getElementById('btn-loader');
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline';

  setTimeout(() => {
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';

    const inputSymptoms = input.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const results = [];

    for (const condition of CONDITIONS) {
      const { matched, matchPercent, finalScore } = calculateMatch(inputSymptoms, condition);
      if (matched.length > 0 && finalScore >= 10) {
        results.push({ condition, matched, matchPercent, finalScore });
      }
    }

    results.sort((a, b) => b.finalScore - a.finalScore);
    const top = results.slice(0, 5);

    document.getElementById('empty-state').style.display = 'none';

    if (top.length === 0) {
      document.getElementById('results-section').style.display = 'none';
      document.getElementById('no-results').style.display = 'block';
      return;
    }

    document.getElementById('no-results').style.display = 'none';
    document.getElementById('results-section').style.display = 'block';
    document.getElementById('results-sub').textContent =
      `Found ${top.length} possible condition${top.length > 1 ? 's' : ''} matching "${input}"`;

    const grid = document.getElementById('results-grid');
    grid.innerHTML = '';

    for (const result of top) {
      const level = getMatchLevel(result.finalScore);
      const card = document.createElement('div');
      card.className = `result-card ${level}`;

      const urgencyClass = result.condition.urgency;

      card.innerHTML = `
        <div class="card-top">
          <div class="card-name">${result.condition.name}</div>
          <div class="match-badge">
            <div class="match-pct ${level}">${result.matchPercent}%</div>
            <div class="match-label">symptom match</div>
          </div>
        </div>
        <div class="card-description">${result.condition.description}</div>
        <div class="matched-symptoms">
          ${result.matched.map(s => `<span class="matched-tag">✓ ${s}</span>`).join('')}
        </div>
        <div class="card-footer">
          <span class="urgency-tag ${urgencyClass}">${result.condition.urgencyLabel}</span>
          <span class="card-specialty">${result.condition.specialty}</span>
        </div>
      `;

      grid.appendChild(card);
    }

    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 600);
}

// Allow Enter key to trigger search
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('symptom-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') matchSymptoms();
  });
});
