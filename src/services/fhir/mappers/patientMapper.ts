
import { Patient } from '@/types/patient';

export class FhirPatientMapper {
  /**
   * Create comprehensive FHIR Patient resource from Patient object
   */
  static createFhirPatient(patient: Patient): any {
    const fhirPatient: any = {
      resourceType: 'Patient',
      id: patient.id,
      meta: {
        versionId: '1',
        lastUpdated: new Date().toISOString(),
        profile: ['https://fhir.hl7.org.uk/StructureDefinition/UKCore-Patient']
      },
      active: patient.active ?? true,
      identifier: this.mapIdentifiers(patient),
      name: this.mapNames(patient),
      telecom: this.mapTelecom(patient),
      gender: this.mapGender(patient.gender),
      birthDate: patient.birthDate,
      address: this.mapAddresses(patient),
      maritalStatus: this.mapMaritalStatus(patient.maritalStatus),
      communication: this.mapCommunication(patient),
      generalPractitioner: this.mapGeneralPractitioner(patient.gpDetails),
      managingOrganization: this.mapManagingOrganization(),
      extension: this.mapExtensions(patient)
    };

    // Remove null/undefined fields
    return this.cleanObject(fhirPatient);
  }

  private static mapIdentifiers(patient: Patient): any[] {
    const identifiers = [];

    // NHS Number (primary identifier)
    if (patient.nhsNumber) {
      identifiers.push({
        use: 'official',
        system: 'https://fhir.nhs.uk/Id/nhs-number',
        value: patient.nhsNumber,
        extension: [
          {
            url: 'https://fhir.hl7.org.uk/StructureDefinition/Extension-UKCore-NHSNumberVerificationStatus',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'https://fhir.hl7.org.uk/CodeSystem/UKCore-NHSNumberVerificationStatusEngland',
                  code: 'verified',
                  display: 'Number present and verified'
                }
              ]
            }
          }
        ]
      });
    }

    return identifiers;
  }

  private static mapNames(patient: Patient): any[] {
    const names = [];
    
    if (patient.name) {
      names.push({
        use: 'usual',
        text: patient.name,
        family: this.extractFamilyName(patient.name),
        given: this.extractGivenNames(patient.name)
      });
    }

    return names;
  }

  private static mapTelecom(patient: Patient): any[] {
    const telecom = [];

    if (patient.phone) {
      telecom.push({
        system: 'phone',
        value: patient.phone,
        use: 'home',
        rank: 1
      });
    }

    return telecom;
  }

  private static mapGender(gender?: string): string {
    switch (gender?.toLowerCase()) {
      case 'male':
        return 'male';
      case 'female':
        return 'female';
      case 'other':
        return 'other';
      default:
        return 'unknown';
    }
  }

  private static mapAddresses(patient: Patient): any[] {
    const addresses = [];

    if (patient.address) {
      addresses.push({
        use: 'home',
        type: 'both',
        text: patient.address,
        line: [patient.address],
        period: {
          start: new Date().toISOString().split('T')[0]
        }
      });
    }

    // Add historic addresses if available
    if (patient.historicAddresses) {
      patient.historicAddresses.forEach(historicAddress => {
        addresses.push({
          use: historicAddress.type === 'residential' ? 'old' : 'temp',
          type: 'both',
          text: historicAddress.address,
          line: [historicAddress.address],
          period: {
            start: historicAddress.dateFrom,
            end: historicAddress.dateTo
          }
        });
      });
    }

    return addresses;
  }

  private static mapMaritalStatus(maritalStatus?: string): any | null {
    if (!maritalStatus) return null;

    const maritalStatusMap: { [key: string]: { code: string; display: string } } = {
      'single': { code: 'S', display: 'Never Married' },
      'married': { code: 'M', display: 'Married' },
      'divorced': { code: 'D', display: 'Divorced' },
      'widowed': { code: 'W', display: 'Widowed' },
      'separated': { code: 'L', display: 'Legally Separated' }
    };

    const status = maritalStatusMap[maritalStatus.toLowerCase()];
    if (status) {
      return {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-MaritalStatus',
            code: status.code,
            display: status.display
          }
        ],
        text: maritalStatus
      };
    }

    return null;
  }

  private static mapCommunication(patient: Patient): any[] {
    const communications = [];

    // Default to English if no language specified
    communications.push({
      language: {
        coding: [
          {
            system: 'https://fhir.hl7.org.uk/CodeSystem/UKCore-HumanLanguage',
            code: 'en',
            display: 'English'
          }
        ],
        text: 'English'
      },
      preferred: true
    });

    return communications;
  }

  private static mapGeneralPractitioner(gpDetails?: any): any[] {
    if (!gpDetails) return [];

    return [
      {
        reference: `Practitioner/${gpDetails.id}`,
        display: gpDetails.name
      }
    ];
  }

  private static mapManagingOrganization(): any {
    return {
      reference: 'Organization/NHS-TRUST-001',
      display: 'NHS Foundation Trust'
    };
  }

  private static mapExtensions(patient: Patient): any[] {
    const extensions = [];

    // Ethnicity extension
    if (patient.ethnicity) {
      extensions.push({
        url: 'https://fhir.hl7.org.uk/StructureDefinition/Extension-UKCore-EthnicCategory',
        valueCodeableConcept: {
          coding: [
            {
              system: 'https://fhir.hl7.org.uk/CodeSystem/UKCore-EthnicCategory',
              code: this.mapEthnicityCode(patient.ethnicity),
              display: patient.ethnicity
            }
          ]
        }
      });
    }

    // Accommodation type extension
    if (patient.accommodationType) {
      extensions.push({
        url: 'https://fhir.hl7.org.uk/StructureDefinition/Extension-UKCore-AccommodationType',
        valueCodeableConcept: {
          coding: [
            {
              system: 'https://fhir.hl7.org.uk/CodeSystem/UKCore-AccommodationType',
              code: patient.accommodationType.toLowerCase().replace(' ', '-'),
              display: patient.accommodationType
            }
          ]
        }
      });
    }

    return extensions;
  }

  private static mapEthnicityCode(ethnicity: string): string {
    const ethnicityMap: { [key: string]: string } = {
      'White British': 'A',
      'White Irish': 'B',
      'White Other': 'C',
      'Mixed White and Black Caribbean': 'D',
      'Mixed White and Black African': 'E',
      'Mixed White and Asian': 'F',
      'Mixed Other': 'G',
      'Asian Indian': 'H',
      'Asian Pakistani': 'J',
      'Asian Bangladeshi': 'K',
      'Asian Other': 'L',
      'Black Caribbean': 'M',
      'Black African': 'N',
      'Black Other': 'P',
      'Chinese': 'R',
      'Other': 'S'
    };

    return ethnicityMap[ethnicity] || 'Z';
  }

  private static extractFamilyName(fullName: string): string {
    const nameParts = fullName.trim().split(' ');
    return nameParts[nameParts.length - 1];
  }

  private static extractGivenNames(fullName: string): string[] {
    const nameParts = fullName.trim().split(' ');
    return nameParts.slice(0, -1);
  }

  private static cleanObject(obj: any): any {
    const cleaned: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value) && value.length > 0) {
          cleaned[key] = value;
        } else if (typeof value === 'object' && !Array.isArray(value)) {
          const cleanedNested = this.cleanObject(value);
          if (Object.keys(cleanedNested).length > 0) {
            cleaned[key] = cleanedNested;
          }
        } else if (typeof value !== 'object') {
          cleaned[key] = value;
        }
      }
    }
    
    return cleaned;
  }
}
