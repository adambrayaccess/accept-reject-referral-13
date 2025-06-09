
const WaitingListLoadingState = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="h-16 rounded-lg border border-border bg-card animate-pulse" />
      ))}
    </div>
  );
};

export default WaitingListLoadingState;
