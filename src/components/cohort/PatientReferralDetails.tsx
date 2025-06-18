
import { TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
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
        <div className="flex flex-wrap gap-1 max-w-32">
          {tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className={`text-sm ${getTagStyle(tag)}`}>
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant="outline" className="text-sm text-gray-800 bg-gray-100 border-gray-200">
              +{tags.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
    </>
  );
};

export default PatientReferralDetails;
