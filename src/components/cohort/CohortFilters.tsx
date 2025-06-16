
import { useState } from 'react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  Slider
} from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, Filter, MapPin, Calendar, Flag, Tags } from 'lucide-react';
import { ReferralPriority } from '@/types/referral';

interface CohortFiltersProps {
  filters: {
    referralAge: {
      min: number;
      max: number;
    };
    priority: string[];
    patientAge: {
      min: number;
      max: number;
    };
    location: string;
    tags: string[];
  };
  setFilters: (filters: any) => void;
}

const CohortFilters = ({ filters, setFilters }: CohortFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const availablePriorities: ReferralPriority[] = ['routine', 'urgent', 'emergency'];

  // Enhanced available tags with clinical categories
  const availableTags = [
    // Status tags
    'Follow-up needed', 
    'Awaiting test results', 
    'Incomplete referral', 
    'Requires additional info',
    'Ready for assessment',
    // Priority tags
    'Urgent review',
    'Priority case', 
    'Routine follow-up',
    'Non-urgent',
    // Clinical tags
    'Complex case',
    'Multi-specialty',
    'Second opinion required', 
    'Specialist equipment needed',
    'Pre-operative assessment',
    // Administrative tags
    'Insurance verification needed',
    'Consent required',
    'Transport arranged',
    'Interpreter required',
    'Special accommodation'
  ];

  const handleReset = () => {
    const resetFilters = {
      referralAge: { min: 0, max: 365 },
      priority: [],
      patientAge: { min: 0, max: 120 },
      location: '',
      tags: []
    };
    setLocalFilters(resetFilters);
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    setIsOpen(false);
  };

  const togglePriority = (priority: string) => {
    setLocalFilters(prev => {
      const newPriorities = prev.priority.includes(priority)
        ? prev.priority.filter(p => p !== priority)
        : [...prev.priority, priority];
      
      return { ...prev, priority: newPriorities };
    });
  };

  const toggleTag = (tag: string) => {
    setLocalFilters(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      
      return { ...prev, tags: newTags };
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    
    if (filters.referralAge.min > 0 || filters.referralAge.max < 365) count++;
    if (filters.priority.length > 0) count++;
    if (filters.patientAge.min > 0 || filters.patientAge.max < 120) count++;
    if (filters.location) count++;
    if (filters.tags.length > 0) count++;
    
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 px-1.5">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Cohort Filters</h3>
            <Button variant="ghost" size="sm" onClick={handleReset}>Reset</Button>
          </div>

          <Accordion type="multiple" defaultValue={['referral-age', 'priority', 'patient-age']}>
            <AccordionItem value="referral-age">
              <AccordionTrigger className="py-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Referral Age</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-6">
                      <Slider 
                        defaultValue={[localFilters.referralAge.min, localFilters.referralAge.max]} 
                        min={0} 
                        max={365} 
                        step={1}
                        onValueChange={(values) => {
                          setLocalFilters(prev => ({
                            ...prev,
                            referralAge: { min: values[0], max: values[1] }
                          }));
                        }}
                      />
                      <div className="flex justify-between text-sm">
                        <span>
                          Min: {localFilters.referralAge.min} days
                        </span>
                        <span>
                          Max: {localFilters.referralAge.max} days
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="priority">
              <AccordionTrigger className="py-2">
                <div className="flex items-center">
                  <Flag className="h-4 w-4 mr-2" />
                  <span>Priority</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {availablePriorities.map(priority => (
                        <Button 
                          key={priority} 
                          variant={localFilters.priority.includes(priority) ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => togglePriority(priority)}
                          className="capitalize"
                        >
                          {localFilters.priority.includes(priority) && (
                            <Check className="mr-2 h-3 w-3" />
                          )}
                          {priority}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="patient-age">
              <AccordionTrigger className="py-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Patient Age</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-6">
                      <Slider 
                        defaultValue={[localFilters.patientAge.min, localFilters.patientAge.max]} 
                        min={0} 
                        max={120} 
                        step={1}
                        onValueChange={(values) => {
                          setLocalFilters(prev => ({
                            ...prev,
                            patientAge: { min: values[0], max: values[1] }
                          }));
                        }}
                      />
                      <div className="flex justify-between text-sm">
                        <span>
                          Min: {localFilters.patientAge.min} years
                        </span>
                        <span>
                          Max: {localFilters.patientAge.max} years
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="location">
              <AccordionTrigger className="py-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Location</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-4">
                    <Input
                      placeholder="Enter location"
                      value={localFilters.location}
                      onChange={(e) => setLocalFilters(prev => ({
                        ...prev,
                        location: e.target.value
                      }))}
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tags">
              <AccordionTrigger className="py-2">
                <div className="flex items-center">
                  <Tags className="h-4 w-4 mr-2" />
                  <span>Clinical Tags</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-4 max-h-60 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map(tag => (
                        <Button 
                          key={tag} 
                          variant={localFilters.tags.includes(tag) ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => toggleTag(tag)}
                          className="text-xs"
                        >
                          {localFilters.tags.includes(tag) && (
                            <Check className="mr-1 h-3 w-3" />
                          )}
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end">
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CohortFilters;
