
import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Patient } from '@/types/patient';
import PatientDemographicsContent from './PatientDemographicsContent';

interface PatientDemographicsSheetProps {
  patient: Patient;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PatientDemographicsSheet = ({ patient, isOpen, onOpenChange }: PatientDemographicsSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-xl">Patient Demographics</SheetTitle>
          <SheetDescription>
            Comprehensive demographic and clinical information for {patient.name}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <PatientDemographicsContent patient={patient} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default PatientDemographicsSheet;
