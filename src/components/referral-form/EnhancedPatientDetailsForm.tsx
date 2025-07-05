
import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Patient } from "@/types/patient";
import PatientAutocomplete from "@/components/ui/patient-autocomplete";
import PatientMedicalSummaryCard from "./PatientMedicalSummaryCard";
import { fetchPatientDemographics } from "@/services/patientDemographics";
import { Loader2, User, RefreshCw } from "lucide-react";

interface EnhancedPatientDetailsFormProps {
  patientName: string;
  setPatientName: (value: string) => void;
  birthDate: string;
  setBirthDate: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  nhsNumber: string;
  setNhsNumber: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  selectedPatient?: Patient;
  onPatientSelect: (patient: Patient | undefined) => void;
  onCreateNewPatient?: () => void;
  isCreatingPatient?: boolean;
}

const EnhancedPatientDetailsForm = ({
  patientName,
  setPatientName,
  birthDate,
  setBirthDate,
  gender,
  setGender,
  nhsNumber,
  setNhsNumber,
  address,
  setAddress,
  phone,
  setPhone,
  selectedPatient,
  onPatientSelect,
  onCreateNewPatient,
  isCreatingPatient = false,
}: EnhancedPatientDetailsFormProps) => {
  const [fullPatientData, setFullPatientData] = useState<Patient | null>(null);
  const [isLoadingFullData, setIsLoadingFullData] = useState(false);

  // Load full patient data when a patient is selected
  useEffect(() => {
    const loadFullPatientData = async () => {
      if (selectedPatient?.id && !fullPatientData) {
        setIsLoadingFullData(true);
        try {
          const fullData = await fetchPatientDemographics(selectedPatient.id);
          if (fullData) {
            setFullPatientData(fullData);
          }
        } catch (error) {
          console.error('Error loading full patient data:', error);
        } finally {
          setIsLoadingFullData(false);
        }
      }
    };

    loadFullPatientData();
  }, [selectedPatient?.id, fullPatientData]);

  // Reset full data when patient is deselected
  useEffect(() => {
    if (!selectedPatient) {
      setFullPatientData(null);
    }
  }, [selectedPatient]);

  const refreshPatientData = async () => {
    if (selectedPatient?.id) {
      setIsLoadingFullData(true);
      try {
        const fullData = await fetchPatientDemographics(selectedPatient.id);
        if (fullData) {
          setFullPatientData(fullData);
        }
      } catch (error) {
        console.error('Error refreshing patient data:', error);
      } finally {
        setIsLoadingFullData(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Search Existing Patient</Label>
        <PatientAutocomplete
          value={selectedPatient}
          onSelect={onPatientSelect}
          onCreateNew={onCreateNewPatient}
          placeholder="Search by name, NHS number, or phone..."
        />
        {selectedPatient && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Patient found! Fields below have been auto-filled.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={refreshPatientData}
              disabled={isLoadingFullData || isCreatingPatient}
            >
              {isLoadingFullData || isCreatingPatient ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isCreatingPatient ? 'Creating...' : 'Refresh Data'}
            </Button>
          </div>
        )}
      </div>

      {/* Medical Summary Card - Enhanced patient data */}
      {isLoadingFullData && (
        <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Loading comprehensive patient data...</span>
        </div>
      )}

      {fullPatientData && !isLoadingFullData && (
        <PatientMedicalSummaryCard patient={fullPatientData} />
      )}

      {/* Basic Patient Details Form */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patientName" className="flex items-center gap-1">
            Patient Name <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate" className="flex items-center gap-1">
            Date of Birth <span className="text-red-500">*</span>
          </Label>
          <Input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="nhsNumber" className="flex items-center gap-1">
            NHS Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nhsNumber"
            value={nhsNumber}
            onChange={(e) => setNhsNumber(e.target.value)}
            placeholder="000 000 0000"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Patient's current address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="01234 567890"
        />
      </div>
    </div>
  );
};

export default EnhancedPatientDetailsForm;
