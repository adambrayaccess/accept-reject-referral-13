
import { Badge } from '@/components/ui/badge';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { Route, ChevronDown } from 'lucide-react';

interface JourneyHeaderProps {
  specialty: string;
  isOpen: boolean;
}

const JourneyHeader = ({ specialty, isOpen }: JourneyHeaderProps) => {
  return (
    <CollapsibleTrigger asChild>
      <CardHeader className="pb-4 cursor-pointer hover:bg-muted/50 transition-colors">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Route className="h-5 w-5 mr-2" />
            Patient Journey
            <Badge variant="outline" className="text-xs ml-4">
              {specialty}
            </Badge>
          </div>
          <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </CardTitle>
      </CardHeader>
    </CollapsibleTrigger>
  );
};

export default JourneyHeader;
