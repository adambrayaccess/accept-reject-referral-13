import EnhancedAuditLog from '@/components/audit/EnhancedAuditLog';

interface TriageHistorySheetContentProps {
  referralId: string;
  auditLog: any[];  // Using any[] to match the current audit log type
}

const TriageHistorySheetContent = ({ referralId, auditLog }: TriageHistorySheetContentProps) => {
  return (
    <div className="space-y-6 pb-6">
      <EnhancedAuditLog entries={auditLog} referralId={referralId} />
    </div>
  );
};

export default TriageHistorySheetContent;