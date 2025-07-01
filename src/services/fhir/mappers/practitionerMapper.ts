import { FhirPractitioner } from '@/types/referral';

export class FhirPractitionerMapper {
  /**
   * Create comprehensive FHIR Practitioner resource from FhirPractitioner object
   */
  static createFhirPractitioner(practitioner: FhirPractitioner): any {
    const fhirPractitioner: any = {
      resourceType: 'Practitioner',
      id: practitioner.id,
      meta: {
        versionId: '1',
        lastUpdated: new Date().toISOString(),
        profile: ['https://fhir.hl7.org.uk/StructureDefinition/UKCore-Practitioner']
      },
      active: practitioner.active ?? true,
      identifier: this.mapIdentifiers(practitioner),
      name: this.mapNames(practitioner),
      telecom: this.mapTelecom(practitioner),
      gender: this.mapGender(practitioner.gender),
      birthDate: practitioner.birthDate,
      qualification: this.mapQualifications(practitioner),
      extension: this.mapExtensions(practitioner)
    };

    return this.cleanObject(fhirPractitioner);
  }

  private static mapIdentifiers(practitioner: FhirPractitioner): any[] {
    const identifiers = [];

    // Professional registration number
    identifiers.push({
      use: 'official',
      system: 'https://fhir.hl7.org.uk/Id/gmc-number',
      value: `GMC${practitioner.id}`,
      type: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
            code: 'PRN',
            display: 'Provider number'
          }
        ]
      }
    });

    return identifiers;
  }

  private static mapNames(practitioner: FhirPractitioner): any[] {
    const names = [];
    
    if (practitioner.name) {
      names.push({
        use: 'official',
        text: practitioner.name,
        family: this.extractFamilyName(practitioner.name),
        given: this.extractGivenNames(practitioner.name),
        prefix: this.extractPrefix(practitioner.name)
      });
    }

    return names;
  }

  private static mapTelecom(practitioner: FhirPractitioner): any[] {
    const telecom = [];

    if (practitioner.contact) {
      // Determine if contact is email or phone
      if (practitioner.contact.includes('@')) {
        telecom.push({
          system: 'email',
          value: practitioner.contact,
          use: 'work',
          rank: 1
        });
      } else {
        telecom.push({
          system: 'phone',
          value: practitioner.contact,
          use: 'work',
          rank: 1
        });
      }
    }

    return telecom;
  }

  private static mapGender(gender?: string): string | undefined {
    if (!gender) return undefined;
    
    switch (gender.toLowerCase()) {
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

  private static mapQualifications(practitioner: FhirPractitioner): any[] {
    const qualifications = [];

    if (practitioner.role) {
      qualifications.push({
        identifier: [
          {
            system: 'https://fhir.hl7.org.uk/Id/professional-qualification',
            value: `QUAL-${practitioner.id}`
          }
        ],
        code: {
          coding: [
            {
              system: 'https://fhir.hl7.org.uk/CodeSystem/UKCore-ProfessionalQualification',
              code: this.mapRoleToQualificationCode(practitioner.role),
              display: practitioner.role
            }
          ],
          text: practitioner.role
        },
        period: {
          start: '2000-01-01' // Default qualification start date
        },
        issuer: {
          display: practitioner.organization || 'Professional Body'
        }
      });
    }

    return qualifications;
  }

  private static mapExtensions(practitioner: FhirPractitioner): any[] {
    const extensions = [];

    // Professional role extension
    if (practitioner.role) {
      extensions.push({
        url: 'https://fhir.hl7.org.uk/StructureDefinition/Extension-UKCore-ProfessionalRole',
        valueCodeableConcept: {
          coding: [
            {
              system: 'https://fhir.hl7.org.uk/CodeSystem/UKCore-ProfessionalRole',
              code: this.mapRoleCode(practitioner.role),
              display: practitioner.role
            }
          ]
        }
      });
    }

    return extensions;
  }

  private static mapRoleToQualificationCode(role: string): string {
    const roleMap: { [key: string]: string } = {
      'General Practitioner': 'MBBS',
      'Consultant': 'MRCP',
      'Emergency Medicine': 'MCEM',
      'Specialist Registrar': 'ST',
      'Foundation Doctor': 'FY'
    };

    return roleMap[role] || 'MED';
  }

  private static mapRoleCode(role: string): string {
    const roleCodeMap: { [key: string]: string } = {
      'General Practitioner': 'GP',
      'Consultant': 'CONS',
      'Emergency Medicine': 'EM',
      'Specialist Registrar': 'SR',
      'Foundation Doctor': 'FD'
    };

    return roleCodeMap[role] || 'OTHER';
  }

  private static extractFamilyName(fullName: string): string {
    const nameParts = fullName.trim().split(' ');
    return nameParts[nameParts.length - 1];
  }

  private static extractGivenNames(fullName: string): string[] {
    const nameParts = fullName.trim().split(' ');
    // Remove title and family name, keep given names
    const withoutTitle = nameParts.filter(part => !['Dr.', 'Dr', 'Mr.', 'Mrs.', 'Ms.', 'Miss'].includes(part));
    return withoutTitle.slice(0, -1);
  }

  private static extractPrefix(fullName: string): string[] {
    const nameParts = fullName.trim().split(' ');
    const titles = nameParts.filter(part => ['Dr.', 'Dr', 'Mr.', 'Mrs.', 'Ms.', 'Miss'].includes(part));
    return titles;
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
