
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Database,
  Shield,
  RefreshCw
} from 'lucide-react';
import { MockDataEliminationService, EliminationResult } from '@/services/mockDataElimination/mockDataEliminationService';

const MockDataEliminationPanel = () => {
  const [isEliminating, setIsEliminating] = useState(false);
  const [eliminationResult, setEliminationResult] = useState<EliminationResult | null>(null);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [selectiveOptions, setSelectiveOptions] = useState({
    patients: false,
    referrals: false,
    medicalHistory: false,
    fhirData: false
  });

  const handleCompleteElimination = async () => {
    if (!confirmationChecked) {
      alert('Please confirm that you understand this action cannot be undone.');
      return;
    }

    setIsEliminating(true);
    setEliminationResult(null);

    try {
      console.log('🧹 Starting complete mock data elimination...');
      const result = await MockDataEliminationService.eliminateAllMockData();
      setEliminationResult(result);
      
      if (result.success) {
        console.log('✅ Mock data elimination completed successfully');
      } else {
        console.error('❌ Mock data elimination failed:', result.error);
      }
    } catch (error) {
      console.error('💥 Exception during elimination:', error);
      setEliminationResult({
        success: false,
        error: error.message,
        tablesCleared: [],
        totalRecordsRemoved: 0,
        duration: 0,
        details: {}
      });
    } finally {
      setIsEliminating(false);
    }
  };

  const handleSelectiveElimination = async () => {
    if (!confirmationChecked) {
      alert('Please confirm that you understand this action cannot be undone.');
      return;
    }

    const hasSelectedOptions = Object.values(selectiveOptions).some(option => option);
    if (!hasSelectedOptions) {
      alert('Please select at least one data type to eliminate.');
      return;
    }

    setIsEliminating(true);
    setEliminationResult(null);

    try {
      console.log('🎯 Starting selective mock data elimination...');
      const result = await MockDataEliminationService.eliminateSpecificData(selectiveOptions);
      setEliminationResult(result);
    } catch (error) {
      console.error('💥 Exception during selective elimination:', error);
      setEliminationResult({
        success: false,
        error: error.message,
        tablesCleared: [],
        totalRecordsRemoved: 0,
        duration: 0,
        details: {}
      });
    } finally {
      setIsEliminating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Phase 4: Mock Data Elimination
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>DANGER:</strong> This action will permanently delete all mock data from the database. 
              This cannot be undone. Only proceed if you are ready to move to production.
            </AlertDescription>
          </Alert>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirmation"
              checked={confirmationChecked}
              onCheckedChange={(checked) => setConfirmationChecked(checked === true)}
            />
            <label
              htmlFor="confirmation"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I understand this action cannot be undone and will permanently delete all mock data
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Complete Elimination */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Complete Elimination
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Remove all mock data from all tables. This includes patients, referrals, 
              medical history, and FHIR data.
            </p>
            
            <Button
              onClick={handleCompleteElimination}
              disabled={!confirmationChecked || isEliminating}
              variant="destructive"
              className="w-full"
            >
              {isEliminating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Eliminating...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Eliminate All Mock Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Selective Elimination */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Selective Elimination
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose specific data types to eliminate while keeping others intact.
            </p>
            
            <div className="space-y-2">
              {Object.entries(selectiveOptions).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                   <Checkbox
                     id={key}
                     checked={value}
                     onCheckedChange={(checked) => 
                       setSelectiveOptions(prev => ({ ...prev, [key]: checked === true }))
                     }
                   />
                  <label htmlFor={key} className="text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                </div>
              ))}
            </div>
            
            <Button
              onClick={handleSelectiveElimination}
              disabled={!confirmationChecked || isEliminating}
              variant="outline"
              className="w-full"
            >
              {isEliminating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Eliminating...
                </>
              ) : (
                'Eliminate Selected Data'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Progress Indicator */}
      {isEliminating && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Eliminating mock data...</span>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {eliminationResult && (
        <Card className={eliminationResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${eliminationResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {eliminationResult.success ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Elimination Successful
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5" />
                  Elimination Failed
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{eliminationResult.totalRecordsRemoved}</div>
                <div className="text-sm text-muted-foreground">Records Removed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{eliminationResult.tablesCleared.length}</div>
                <div className="text-sm text-muted-foreground">Tables Cleared</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4" />
                  {Math.round(eliminationResult.duration / 1000)}s
                </div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {eliminationResult.success ? '✅' : '❌'}
                </div>
                <div className="text-sm text-muted-foreground">Status</div>
              </div>
            </div>

            {eliminationResult.error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{eliminationResult.error}</AlertDescription>
              </Alert>
            )}

            {/* Detailed Results */}
            <div className="space-y-2">
              <h4 className="font-medium">Table Details:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(eliminationResult.details).map(([tableName, details]) => (
                  <div key={tableName} className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-sm">{tableName}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={details.success ? 'secondary' : 'destructive'}>
                        {details.recordsRemoved} records
                      </Badge>
                      {details.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MockDataEliminationPanel;
