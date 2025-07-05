
import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GPDetails } from "@/types/patient";
import { GPAutocomplete } from "@/components/ui/gp-autocomplete";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FhirPractitioner } from "@/types/referral";
import { fetchPractitioners } from "@/services/practitionerService";

interface GPDetailsFormProps {
  practitionerId: string;
  setPractitionerId: (value: string) => void;
  gpName: string;
  setGpName: (value: string) => void;
  gpPractice: string;
  setGpPractice: (value: string) => void;
  gpAddress: string;
  setGpAddress: (value: string) => void;
  gpPhone: string;
  setGpPhone: (value: string) => void;
  gpEmail: string;
  setGpEmail: (value: string) => void;
  selectedPatientGP?: GPDetails;
  selectedGP?: GPDetails;
  onGPSelect: (gp: GPDetails | undefined) => void;
}

const GPDetailsForm = ({
  practitionerId,
  setPractitionerId,
  gpName,
  setGpName,
  gpPractice,
  setGpPractice,
  gpAddress,
  setGpAddress,
  gpPhone,
  setGpPhone,
  gpEmail,
  setGpEmail,
  selectedPatientGP,
  selectedGP,
  onGPSelect,
}: GPDetailsFormProps) => {
  const [practitioners, setPractitioners] = useState<FhirPractitioner[]>([]);
  const [isLoadingPractitioners, setIsLoadingPractitioners] = useState(true);

  useEffect(() => {
    const loadPractitioners = async () => {
      setIsLoadingPractitioners(true);
      try {
        const practitionerData = await fetchPractitioners();
        setPractitioners(practitionerData);
      } catch (error) {
        console.error('Error loading practitioners:', error);
      } finally {
        setIsLoadingPractitioners(false);
      }
    };

    loadPractitioners();
  }, []);
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="practitioner" className="flex items-center gap-1">
          Referring Practitioner <span className="text-red-500">*</span>
        </Label>
        <Select value={practitionerId} onValueChange={(value: string) => setPractitionerId(value)} required>
          <SelectTrigger>
            <SelectValue placeholder={isLoadingPractitioners ? "Loading practitioners..." : "Select practitioner"} />
          </SelectTrigger>
          <SelectContent>
            {practitioners.map((practitioner) => (
              <SelectItem key={practitioner.id} value={practitioner.id}>
                {practitioner.name} - {practitioner.organization}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedPatientGP && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800 font-medium">
            GP details auto-filled from patient record
          </p>
        </div>
      )}

      {selectedGP && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800 font-medium">
            GP details auto-filled from existing record
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label>Search Existing GP Records</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <GPAutocomplete
              value={selectedGP}
              onSelect={onGPSelect}
              placeholder="Search for an existing GP..."
              disabled={!!selectedPatientGP}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onGPSelect(undefined)}
            disabled={!!selectedPatientGP}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add New
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gpName">GP Name</Label>
          <Input
            id="gpName"
            value={gpName}
            onChange={(e) => setGpName(e.target.value)}
            placeholder="Dr. John Smith"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gpPractice">Practice Name</Label>
          <Input
            id="gpPractice"
            value={gpPractice}
            onChange={(e) => setGpPractice(e.target.value)}
            placeholder="City Medical Centre"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gpAddress">Practice Address</Label>
        <Input
          id="gpAddress"
          value={gpAddress}
          onChange={(e) => setGpAddress(e.target.value)}
          placeholder="123 High Street, City, Postcode"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gpPhone">Practice Phone</Label>
          <Input
            id="gpPhone"
            type="tel"
            value={gpPhone}
            onChange={(e) => setGpPhone(e.target.value)}
            placeholder="01234 567890"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gpEmail">GP Email (Optional)</Label>
          <Input
            id="gpEmail"
            type="email"
            value={gpEmail}
            onChange={(e) => setGpEmail(e.target.value)}
            placeholder="gp@practice.nhs.uk"
          />
        </div>
      </div>
    </div>
  );
};

export default GPDetailsForm;
