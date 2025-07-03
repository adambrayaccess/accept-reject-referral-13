
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import the patient population execution function to expose it globally
import './services/mock/patients/executePopulation';

// DISABLED: Import the FHIR Phase 4 trigger to expose it globally
// import './services/fhir/fhirPhase4Trigger';

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
