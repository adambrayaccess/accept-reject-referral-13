
import { TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { format } from 'date-fns';
import { Tag } from 'lucide-react';
import { Referral } from '@/types/referral';
import { getTagStyle } from '@/utils/tagCategoryUtils';

interface PatientReferralDetailsProps {
  referral: Referral;
}

const PatientReferralDetails = ({ referral }: PatientReferralDetailsProps) => {
  const tags = referral.tags || [];

  return (
    <>
      <TableCell className="p-2 text-sm">
        <div className="font-medium">{referral.referrer.name}</div>
        <div className="text-sm text-muted-foreground">{referral.referrer.organization}</div>
      </TableCell>
      <TableCell className="p-2 text-sm">
        <div>{format(new Date(referral.created), 'dd MMM yyyy')}</div>
        <div>{format(new Date(referral.created), 'HH:mm')}</div>
      </TableCell>
      <TableCell className="p-2">
        <div className="flex justify-center">
          {tags.length > 0 ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="cursor-pointer">
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
                    aria-label={`${tags.length} clinical tag${tags.length === 1 ? '' : 's'}`}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tags.length}
                  </Badge>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-4" side="top">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Clinical Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className={`text-xs ${getTagStyle(tag)}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
      </TableCell>
    </>
  );
};

export default PatientReferralDetails;
