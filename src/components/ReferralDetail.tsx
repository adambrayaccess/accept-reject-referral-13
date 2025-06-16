
import { Referral } from '@/types/referral';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface ReferralDetailProps {
  referral: Referral;
  relatedReferrals: {
    serviceTotal: number;
    activeTotal: number;
    activeSpecialties: string[];
  };
}

const getPriorityVariant = (priority: Referral['priority']) => {
  switch (priority) {
    case 'emergency':
      return 'destructive';
    case 'urgent':
      return 'secondary';
    default:
      return 'outline';
  }
};

const ReferralDetail = ({ referral, relatedReferrals }: ReferralDetailProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2">
          <CardTitle className="text-lg">Referral Details</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={getPriorityVariant(referral.priority)} className="text-xs">
              {referral.priority.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {`Ref: ${referral.id}`}
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              {`UBRN: ${referral.ubrn}`}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="patient">
          <TabsList className="grid grid-cols-3 mb-3 h-8">
            <TabsTrigger value="patient" className="text-xs">Patient</TabsTrigger>
            <TabsTrigger value="clinical" className="text-xs">Clinical</TabsTrigger>
            <TabsTrigger value="referrer" className="text-xs">Referrer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patient" className="space-y-3 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <div className="text-xs font-medium text-muted-foreground">Full Name</div>
                <div className="font-medium">{referral.patient.name}</div>
              </div>
              
              <div>
                <div className="text-xs font-medium text-muted-foreground">NHS Number</div>
                <div className="font-mono font-medium">{referral.patient.nhsNumber}</div>
              </div>
              
              <div>
                <div className="text-xs font-medium text-muted-foreground">Date of Birth</div>
                <div className="font-medium">
                  {format(new Date(referral.patient.birthDate), 'dd MMM yyyy')}
                  {' '}
                  ({new Date().getFullYear() - new Date(referral.patient.birthDate).getFullYear()} years)
                </div>
              </div>
              
              <div>
                <div className="text-xs font-medium text-muted-foreground">Gender</div>
                <div className="font-medium">{referral.patient.gender.charAt(0).toUpperCase() + referral.patient.gender.slice(1)}</div>
              </div>
              
              {referral.patient.address && (
                <div className="col-span-1 lg:col-span-2">
                  <div className="text-xs font-medium text-muted-foreground">Address</div>
                  <div className="font-medium">{referral.patient.address}</div>
                </div>
              )}
              
              {referral.patient.phone && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Contact Number</div>
                  <div className="font-medium">{referral.patient.phone}</div>
                </div>
              )}
              
              <div className="col-span-1 lg:col-span-2">
                <div className="flex flex-col gap-3 p-3 bg-muted rounded-lg mt-2">
                  <div className="flex gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Other referrals to {referral.specialty}</div>
                      <div className="text-xl font-bold">{relatedReferrals.serviceTotal}</div>
                    </div>
                    <Separator orientation="vertical" className="h-auto" />
                    <div>
                      <div className="text-xs text-muted-foreground">Active referrals</div>
                      <div className="text-xl font-bold">{relatedReferrals.activeTotal}</div>
                    </div>
                  </div>
                  {relatedReferrals.activeSpecialties && relatedReferrals.activeSpecialties.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Active referral specialties:</div>
                        <div className="flex flex-wrap gap-1">
                          {relatedReferrals.activeSpecialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">{specialty}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="clinical" className="space-y-3 mt-0">
            <div className="text-sm space-y-3">
              <div>
                <div className="text-xs font-medium text-muted-foreground">Specialty</div>
                <div className="font-medium">{referral.specialty}</div>
              </div>
              
              {referral.service && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Service</div>
                  <div className="font-medium">{referral.service}</div>
                </div>
              )}
              
              <Separator />
              
              <div>
                <div className="text-xs font-medium text-muted-foreground">Reason for Referral</div>
                <div className="mt-1 text-sm">{referral.clinicalInfo.reason}</div>
              </div>
              
              {referral.clinicalInfo.history && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Clinical History</div>
                  <div className="mt-1 text-sm whitespace-pre-line">{referral.clinicalInfo.history}</div>
                </div>
              )}
              
              {referral.clinicalInfo.diagnosis && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Provisional Diagnosis</div>
                  <div className="mt-1 text-sm">{referral.clinicalInfo.diagnosis}</div>
                </div>
              )}
              
              {referral.clinicalInfo.medications && referral.clinicalInfo.medications.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Current Medications</div>
                  <ul className="list-disc pl-4 mt-1 text-sm space-y-1">
                    {referral.clinicalInfo.medications.map((med, index) => (
                      <li key={index}>{med}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {referral.clinicalInfo.allergies && referral.clinicalInfo.allergies.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Allergies</div>
                  <ul className="list-disc pl-4 mt-1 text-sm space-y-1">
                    {referral.clinicalInfo.allergies.map((allergy, index) => (
                      <li key={index}>{allergy}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {referral.clinicalInfo.notes && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Additional Notes</div>
                  <div className="mt-1 text-sm whitespace-pre-line">{referral.clinicalInfo.notes}</div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="referrer" className="space-y-3 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <div className="text-xs font-medium text-muted-foreground">Referrer Name</div>
                <div className="font-medium">{referral.referrer.name}</div>
              </div>
              
              {referral.referrer.role && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Role</div>
                  <div className="font-medium">{referral.referrer.role}</div>
                </div>
              )}
              
              {referral.referrer.organization && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Organization</div>
                  <div className="font-medium">{referral.referrer.organization}</div>
                </div>
              )}
              
              {referral.referrer.contact && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Contact</div>
                  <div className="font-medium">{referral.referrer.contact}</div>
                </div>
              )}
              
              <div>
                <div className="text-xs font-medium text-muted-foreground">Date Referred</div>
                <div className="font-medium">{format(new Date(referral.created), 'dd MMM yyyy, HH:mm')}</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReferralDetail;
