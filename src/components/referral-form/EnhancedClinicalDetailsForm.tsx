
import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Pill, Plus, X } from "lucide-react";
import { Patient } from "@/types/patient";

interface EnhancedClinicalDetailsFormProps {
  reason: string;
  setReason: (value: string) => void;
  history: string;
  setHistory: (value: string) => void;
  diagnosis: string;
  setDiagnosis: (value: string) => void;
  medications: string;
  setMedications: (value: string) => void;
  allergies: string;
  setAllergies: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  selectedPatient?: Patient;
}

const EnhancedClinicalDetailsForm = ({
  reason,
  setReason,
  history,
  setHistory,
  diagnosis,
  setDiagnosis,
  medications,
  setMedications,
  allergies,
  setAllergies,
  notes,
  setNotes,
  selectedPatient,
}: EnhancedClinicalDetailsFormProps) => {
  const [showPatientData, setShowPatientData] = useState(true);

  // Auto-populate clinical information from patient data
  useEffect(() => {
    if (selectedPatient && showPatientData) {
      // Auto-populate medications from patient data
      const activeMedications = selectedPatient.medications?.filter(med => med.status === 'active') || [];
      if (activeMedications.length > 0 && !medications) {
        const medList = activeMedications.map(med => `${med.name} - ${med.dosage} ${med.frequency}`).join('\n');
        setMedications(medList);
      }

      // Auto-populate allergies from patient data
      const patientAllergies = selectedPatient.medicalHistory?.allergies || [];
      if (patientAllergies.length > 0 && !allergies) {
        const allergyList = patientAllergies.map(allergy => `${allergy.allergen} (${allergy.severity})`).join('\n');
        setAllergies(allergyList);
      }

      // Auto-populate relevant medical history
      if (!history && selectedPatient.medicalHistory) {
        const vitalSigns = selectedPatient.medicalHistory.vitalSigns || [];
        if (vitalSigns.length > 0) {
          const latestVitals = vitalSigns[0];
          const vitalHistory = `Recent vitals (${new Date(latestVitals.timestamp).toLocaleDateString()}): ` +
            `BP ${latestVitals.bloodPressureSystolic}/${latestVitals.bloodPressureDiastolic}, ` +
            `HR ${latestVitals.heartRate}, Temp ${latestVitals.temperature}°C`;
          setHistory(vitalHistory);
        }
      }
    }
  }, [selectedPatient, showPatientData, medications, allergies, history, setMedications, setAllergies, setHistory]);

  const clearAutopopulatedData = () => {
    setMedications('');
    setAllergies('');
    setHistory('');
    setShowPatientData(false);
  };

  return (
    <div className="space-y-4">
      {/* Patient Data Integration Card */}
      {selectedPatient && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-800">
                Clinical Data from Patient Record
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAutopopulatedData}
                  className="text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Auto-filled
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {/* Patient Allergies Alert */}
            {selectedPatient.medicalHistory?.allergies && selectedPatient.medicalHistory.allergies.length > 0 && (
              <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-red-800">Known Allergies:</div>
                  <div className="text-red-700 text-xs">
                    {selectedPatient.medicalHistory.allergies.slice(0, 3).map(allergy => allergy.allergen).join(', ')}
                    {selectedPatient.medicalHistory.allergies.length > 3 && ` and ${selectedPatient.medicalHistory.allergies.length - 3} more`}
                  </div>
                </div>
              </div>
            )}

            {/* Current Medications */}
            {selectedPatient.medications && selectedPatient.medications.filter(med => med.status === 'active').length > 0 && (
              <div className="flex items-start gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
                <Pill className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-blue-800">Current Medications:</div>
                  <div className="text-blue-700 text-xs">
                    {selectedPatient.medications.filter(med => med.status === 'active').slice(0, 2).map(med => med.name).join(', ')}
                    {selectedPatient.medications.filter(med => med.status === 'active').length > 2 && 
                      ` and ${selectedPatient.medications.filter(med => med.status === 'active').length - 2} more`}
                  </div>
                </div>
              </div>
            )}

            {/* MHA Sections Warning */}
            {selectedPatient.mhaSections && selectedPatient.mhaSections.length > 0 && (
              <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-amber-800">Mental Health Act:</div>
                  <div className="text-amber-700 text-xs">
                    Active Section {selectedPatient.mhaSections[0].sectionNumber} - Consider mental health implications
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Clinical Information Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reason" className="flex items-center gap-1">
            Reason for Referral <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe the primary reason for this referral..."
            className="min-h-[80px] border-red-200 focus:border-red-400"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="history">Relevant Medical History</Label>
          <Textarea
            id="history"
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            placeholder="Include relevant past medical history, recent investigations, or clinical findings..."
            className="min-h-[80px]"
          />
          {selectedPatient && (
            <p className="text-xs text-muted-foreground">
              ℹ️ Auto-populated from patient record. Edit as needed.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="diagnosis">Working Diagnosis</Label>
          <Input
            id="diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Current working diagnosis or clinical impression"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medications">Current Medications</Label>
          <Textarea
            id="medications"
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
            placeholder="List current medications, one per line..."
            className="min-h-[100px]"
          />
          {selectedPatient && (
            <p className="text-xs text-muted-foreground">
              ℹ️ Auto-populated from patient record. Edit as needed.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="allergies">Known Allergies</Label>
          <Textarea
            id="allergies"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="List known allergies and reactions, one per line..."
            className="min-h-[80px]"
          />
          {selectedPatient && (
            <p className="text-xs text-muted-foreground">
              ℹ️ Auto-populated from patient record. Edit as needed.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Clinical Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional information that may be relevant to the receiving clinician..."
            className="min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedClinicalDetailsForm;
