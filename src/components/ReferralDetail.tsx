
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
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <CardTitle>Referral Details</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={getPriorityVariant(referral.priority)}>
              {referral.priority.toUpperCase()}
            </Badge>
            <Badge variant="outline">
              {`Ref: ${referral.id}`}
            </Badge>
            <Badge variant="outline" className="font-mono">
              {`UBRN: ${referral.ubrn}`}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="patient">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="clinical">Clinical</TabsTrigger>
            <TabsTrigger value="referrer">Referrer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patient" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <div className="info-label">Full Name</div>
                <div className="info-value">{referral.patient.name}</div>
              </div>
              
              <div>
                <div className="info-label">NHS Number</div>
                <div className="info-value font-mono">{referral.patient.nhsNumber}</div>
              </div>
              
              <div>
                <div className="info-label">Date of Birth</div>
                <div className="info-value">
                  {format(new Date(referral.patient.birthDate), 'dd MMM yyyy')}
                  {' '}
                  ({new Date().getFullYear() - new Date(referral.patient.birthDate).getFullYear()} years)
                </div>
              </div>
              
              <div>
                <div className="info-label">Gender</div>
                <div className="info-value">{referral.patient.gender.charAt(0).toUpperCase() + referral.patient.gender.slice(1)}</div>
              </div>
              
              {referral.patient.address && (
                <div className="col-span-1 md:col-span-2">
                  <div className="info-label">Address</div>
                  <div className="info-value">{referral.patient.address}</div>
                </div>
              )}
              
              {referral.patient.phone && (
                <div>
                  <div className="info-label">Contact Number</div>
                  <div className="info-value">{referral.patient.phone}</div>
                </div>
              )}
              
              <div className="col-span-1 md:col-span-2">
                <div className="flex flex-col gap-4 p-3 bg-muted rounded-lg mt-2">
                  <div className="flex gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Other referrals to {referral.specialty}</div>
                      <div className="text-2xl font-bold">{relatedReferrals.serviceTotal}</div>
                    </div>
                    <Separator orientation="vertical" className="h-auto" />
                    <div>
                      <div className="text-sm text-muted-foreground">Active referrals</div>
                      <div className="text-2xl font-bold">{relatedReferrals.activeTotal}</div>
                    </div>
                  </div>
                  {relatedReferrals.activeSpecialties && relatedReferrals.activeSpecialties.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Active referral specialties:</div>
                        <div className="flex flex-wrap gap-2">
                          {relatedReferrals.activeSpecialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary">{specialty}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="clinical" className="space-y-4">
            <div>
              <div className="info-label">Specialty</div>
              <div className="info-value">{referral.specialty}</div>
            </div>
            
            {referral.service && (
              <div>
                <div className="info-label">Service</div>
                <div className="info-value">{referral.service}</div>
              </div>
            )}
            
            <Separator />
            
            <div>
              <div className="info-label">Reason for Referral</div>
              <div className="mt-1">{referral.clinicalInfo.reason}</div>
            </div>
            
            {referral.clinicalInfo.history && (
              <div>
                <div className="info-label">Clinical History</div>
                <div className="mt-1 whitespace-pre-line">{referral.clinicalInfo.history}</div>
              </div>
            )}
            
            {referral.clinicalInfo.diagnosis && (
              <div>
                <div className="info-label">Provisional Diagnosis</div>
                <div className="mt-1">{referral.clinicalInfo.diagnosis}</div>
              </div>
            )}
            
            {referral.clinicalInfo.medications && referral.clinicalInfo.medications.length > 0 && (
              <div>
                <div className="info-label">Current Medications</div>
                <ul className="list-disc pl-5 mt-1">
                  {referral.clinicalInfo.medications.map((med, index) => (
                    <li key={index}>{med}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {referral.clinicalInfo.allergies && referral.clinicalInfo.allergies.length > 0 && (
              <div>
                <div className="info-label">Allergies</div>
                <ul className="list-disc pl-5 mt-1">
                  {referral.clinicalInfo.allergies.map((allergy, index) => (
                    <li key={index}>{allergy}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {referral.clinicalInfo.notes && (
              <div>
                <div className="info-label">Additional Notes</div>
                <div className="mt-1 whitespace-pre-line">{referral.clinicalInfo.notes}</div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="referrer" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <div className="info-label">Referrer Name</div>
                <div className="info-value">{referral.referrer.name}</div>
              </div>
              
              {referral.referrer.role && (
                <div>
                  <div className="info-label">Role</div>
                  <div className="info-value">{referral.referrer.role}</div>
                </div>
              )}
              
              {referral.referrer.organization && (
                <div>
                  <div className="info-label">Organization</div>
                  <div className="info-value">{referral.referrer.organization}</div>
                </div>
              )}
              
              {referral.referrer.contact && (
                <div>
                  <div className="info-label">Contact</div>
                  <div className="info-value">{referral.referrer.contact}</div>
                </div>
              )}
              
              <div>
                <div className="info-label">Date Referred</div>
                <div className="info-value">{format(new Date(referral.created), 'dd MMM yyyy, HH:mm')}</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReferralDetail;
