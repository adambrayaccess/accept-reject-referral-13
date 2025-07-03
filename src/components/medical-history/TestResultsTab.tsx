
import { format } from 'date-fns';
import { TestResult } from '@/types/medical';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, Calendar, User, Building2, TestTube, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TestResultsTabProps {
  testResults: TestResult[] | undefined;
}

const TestResultsTab = ({ testResults }: TestResultsTabProps) => {
  if (!testResults || testResults.length === 0) {
    return (
      <p className="text-muted-foreground">No test results available for this patient.</p>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFlagIcon = (flag?: string) => {
    switch (flag) {
      case 'high':
      case 'critical':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'low':
        return <TrendingDown className="h-4 w-4 text-blue-500" />;
      case 'normal':
        return <Minus className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getFlagColor = (flag?: string) => {
    switch (flag) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'normal':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {testResults.map((test) => (
          <AccordionItem key={test.id} value={test.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  <TestTube className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">{test.testName}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(test.reportDate), 'dd MMM yyyy')}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(test.status)}>
                  {test.status.replace('-', ' ').charAt(0).toUpperCase() + test.status.replace('-', ' ').slice(1)}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Requested:</span>
                    <span>{format(new Date(test.requestedDate), 'dd MMM yyyy')}</span>
                  </div>

                  {test.sampleDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Sample Date:</span>
                      <span>{format(new Date(test.sampleDate), 'dd MMM yyyy')}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Requested by:</span>
                    <span>{test.requestedBy}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Performed by:</span>
                    <span>{test.performedBy}</span>
                  </div>
                </div>

                {test.results.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Results:</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-3">Parameter</th>
                            <th className="text-left p-3">Value</th>
                            <th className="text-left p-3">Reference Range</th>
                            <th className="text-left p-3">Flag</th>
                          </tr>
                        </thead>
                        <tbody>
                          {test.results.map((result, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-3 font-medium">{result.parameter}</td>
                              <td className="p-3">
                                {result.value} {result.unit && <span className="text-muted-foreground">{result.unit}</span>}
                              </td>
                              <td className="p-3 text-muted-foreground">{result.referenceRange || '-'}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  {getFlagIcon(result.flag)}
                                  {result.flag && (
                                    <Badge className={getFlagColor(result.flag)} variant="outline">
                                      {result.flag.charAt(0).toUpperCase() + result.flag.slice(1)}
                                    </Badge>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {test.interpretation && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Clinical Interpretation:</span>
                    <p className="text-sm mt-1">{test.interpretation}</p>
                  </div>
                )}

                {test.notes && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Additional Notes:</span>
                    <p className="text-sm mt-1">{test.notes}</p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default TestResultsTab;
