const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={`animate-pulse bg-gray-700/40 rounded-md ${className}`}
    />
  );
};

export default Skeleton