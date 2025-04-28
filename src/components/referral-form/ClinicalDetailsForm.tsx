
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ClinicalDetailsFormProps {
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
}

const ClinicalDetailsForm = ({
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
}: ClinicalDetailsFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Referral</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="history">Medical History</Label>
        <Textarea
          id="history"
          value={history}
          onChange={(e) => setHistory(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="diagnosis">Diagnosis</Label>
        <Input
          id="diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="medications">Current Medications</Label>
        <Textarea
          id="medications"
          value={medications}
          onChange={(e) => setMedications(e.target.value)}
          placeholder="Enter medications, one per line"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergies">Allergies</Label>
        <Textarea
          id="allergies"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="Enter allergies, one per line"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ClinicalDetailsForm;
