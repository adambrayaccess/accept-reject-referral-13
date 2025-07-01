import { Referral } from '@/types/referral';

export class FhirServiceRequestMapper {
  /**
   * Create comprehensive FHIR ServiceRequest resource from Referral object
   */
  static createFhirServiceRequest(referral: Referral): any {
    const fhirServiceRequest: any = {
      resourceType: 'ServiceRequest',
      id: referral.id,
      meta: {
        versionId: '1',
        lastUpdated: new Date().toISOString(),
        profile: ['https://fhir.hl7.org.uk/StructureDefinition/UKCore-ServiceRequest']
      },
      identifier: this.mapIdentifiers(referral),
      status: this.mapStatus(referral.status),
      intent: referral.intent || 'order',
      category: this.mapCategory(referral.specialty),
      priority: this.mapPriority(referral.priority),
      code: this.mapCode(referral.specialty, referral.service),
      subject: this.mapSubject(referral.patient),
      encounter: this.mapEncounter(),
      occurrence: this.mapOccurrence(referral),
      authoredOn: referral.created,
      requester: this.mapRequester(referral.referrer),
      performer: this.mapPerformer(referral),
      reasonCode: this.mapReasonCode(referral.clinicalInfo.reason),
      reasonReference: this.mapReasonReference(referral),
      supportingInfo: this.mapSupportingInfo(referral),
      note: this.mapNotes(referral),
      extension: this.mapExtensions(referral)
    };

    return this.cleanObject(fhirServiceRequest);
  }

  private static mapIdentifiers(referral: Referral): any[] {
    const identifiers = [];

    // UBRN (Unique Booking Reference Number)
    if (referral.ubrn) {
      identifiers.push({
        use: 'official',
        system: 'https://fhir.nhs.uk/Id/dos-service-id',
        value: referral.ubrn,
        type: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
              code: 'PLAC',
              display: 'Placer Identifier'
            }
          ]
        }
      });
    }

    return identifiers;
  }

  private static mapStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'new': 'active',
      'accepted': 'active',
      'in-progress': 'active',
      'on-hold': 'on-hold',
      'cancelled': 'revoked',
      'completed': 'completed',
      'rejected': 'revoked'
    };

    return statusMap[status] || 'active';
  }

  private static mapCategory(specialty: string): any[] {
    return [
      {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: this.getSpecialtyCode(specialty),
            display: specialty
          }
        ],
        text: specialty
      }
    ];
  }

  private static mapPriority(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'routine': 'routine',
      'urgent': 'urgent',
      'emergency': 'stat',
      'asap': 'asap'
    };

    return priorityMap[priority] || 'routine';
  }

  private static mapCode(specialty: string, service?: string): any {
    return {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: this.getServiceCode(specialty, service),
          display: service || specialty
        }
      ],
      text: service || specialty
    };
  }

  private static mapSubject(patient: any): any {
    return {
      reference: `Patient/${patient.id}`,
      display: patient.name,
      identifier: {
        use: 'official',
        system: 'https://fhir.nhs.uk/Id/nhs-number',
        value: patient.nhsNumber
      }
    };
  }

  private static mapEncounter(): any {
    return {
      reference: 'Encounter/example-encounter',
      display: 'Outpatient Consultation'
    };
  }

  private static mapOccurrence(referral: Referral): any {
    return {
      period: {
        start: referral.created,
        end: this.calculateTargetDate(referral.priority, referral.created)
      }
    };
  }

  private static mapRequester(referrer: any): any {
    return {
      reference: `Practitioner/${referrer.id}`,
      display: referrer.name,
      type: 'Practitioner'
    };
  }

  private static mapPerformer(referral: Referral): any[] {
    const performers = [];

    if (referral.assignedHCPId) {
      performers.push({
        reference: `Practitioner/${referral.assignedHCPId}`,
        display: 'Assigned Healthcare Professional'
      });
    }

    if (referral.teamId) {
      performers.push({
        reference: `CareTeam/${referral.teamId}`,
        display: 'Assigned Care Team'
      });
    }

    return performers;
  }

  private static mapReasonCode(reason: string): any[] {
    return [
      {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '404684003',
            display: 'Clinical finding'
          }
        ],
        text: reason
      }
    ];
  }

  private static mapReasonReference(referral: Referral): any[] {
    const references = [];

    if (referral.clinicalInfo.diagnosis) {
      references.push({
        reference: `Condition/${referral.id}-condition`,
        display: referral.clinicalInfo.diagnosis
      });
    }

    return references;
  }

  private static mapSupportingInfo(referral: Referral): any[] {
    const supportingInfo = [];

    // Add attachments as supporting info
    referral.attachments?.forEach((attachment, index) => {
      supportingInfo.push({
        reference: `DocumentReference/${referral.id}-doc-${index}`,
        display: attachment.title
      });
    });

    // Add medical history if available
    if (referral.clinicalInfo.history) {
      supportingInfo.push({
        reference: `Observation/${referral.id}-history`,
        display: 'Clinical History'
      });
    }

    return supportingInfo;
  }

  private static mapNotes(referral: Referral): any[] {
    const notes = [];

    if (referral.clinicalInfo.notes) {
      notes.push({
        time: referral.created,
        text: referral.clinicalInfo.notes,
        authorReference: {
          reference: `Practitioner/${referral.referrer.id}`,
          display: referral.referrer.name
        }
      });
    }

    // Add collaboration notes
    referral.collaborationNotes?.forEach(note => {
      notes.push({
        time: note.timestamp,
        text: note.content,
        authorString: note.author
      });
    });

    return notes;
  }

  private static mapExtensions(referral: Referral): any[] {
    const extensions = [];

    // RTT Pathway extension - use referral ID since RTTPathway doesn't have its own ID
    if (referral.rttPathway) {
      extensions.push({
        url: 'https://fhir.hl7.org.uk/StructureDefinition/Extension-UKCore-RTTPathway',
        valueReference: {
          reference: `EpisodeOfCare/${referral.id}-rtt`,
          display: 'RTT Pathway'
        }
      });
    }

    // Care Pathway extension - use referral ID since CarePathway doesn't have its own ID
    if (referral.carePathway) {
      extensions.push({
        url: 'https://fhir.hl7.org.uk/StructureDefinition/Extension-UKCore-CarePathway',
        valueReference: {
          reference: `CarePlan/${referral.id}-care-pathway`,
          display: referral.carePathway.name
        }
      });
    }

    // Triage status extension
    if (referral.triageStatus) {
      extensions.push({
        url: 'https://fhir.hl7.org.uk/StructureDefinition/Extension-UKCore-TriageStatus',
        valueCodeableConcept: {
          coding: [
            {
              system: 'https://fhir.hl7.org.uk/CodeSystem/UKCore-TriageStatus',
              code: referral.triageStatus,
              display: this.formatTriageStatus(referral.triageStatus)
            }
          ]
        }
      });
    }

    return extensions;
  }

  private static getSpecialtyCode(specialty: string): string {
    const specialtyCodes: { [key: string]: string } = {
      'Cardiology': '394579002',
      'Dermatology': '394582007',
      'Neurology': '394591006',
      'Psychiatry': '394587001',
      'Mental Health': '722162001',
      'Gastroenterology': '394584008',
      'Rheumatology': '394810000'
    };

    return specialtyCodes[specialty] || '394658006'; // General medicine
  }

  private static getServiceCode(specialty: string, service?: string): string {
    if (service) {
      const serviceCodes: { [key: string]: string } = {
        'Heart Failure': '84114007',
        'Arrhythmia': '698247007',
        'General Dermatology': '394578004',
        'Stroke Clinic': '230690007',
        'ADHD Assessment': '406506008'
      };

      return serviceCodes[service] || this.getSpecialtyCode(specialty);
    }

    return this.getSpecialtyCode(specialty);
  }

  private static calculateTargetDate(priority: string, createdDate: string): string {
    const created = new Date(createdDate);
    let daysToAdd = 84; // Default: 12 weeks for routine

    switch (priority) {
      case 'emergency':
        daysToAdd = 1;
        break;
      case 'urgent':
        daysToAdd = 14; // 2 weeks
        break;
      case 'routine':
        daysToAdd = 84; // 12 weeks
        break;
    }

    const targetDate = new Date(created);
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    return targetDate.toISOString();
  }

  private static formatTriageStatus(status: string): string {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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
