
// Main export file for all FHIR services
export * from './fhirResourceService';
export * from './fhirPatientService';
export * from './fhirServiceRequestService';
export * from './fhirPractitionerService';
export * from './fhirSyncService';
export * from './fhirDataPopulationService';
export * from './fhirResourceGenerationService';

// Export mappers
export * from './mappers';

// Export individual services for direct access
export { FhirResourceService } from './fhirResourceService';
export { FhirPatientService } from './fhirPatientService';
export { FhirServiceRequestService } from './fhirServiceRequestService';
export { FhirPractitionerService } from './fhirPractitionerService';
export { FhirSyncService } from './fhirSyncService';
export { FhirDataPopulationService } from './fhirDataPopulationService';
export { FhirResourceGenerationService } from './fhirResourceGenerationService';
