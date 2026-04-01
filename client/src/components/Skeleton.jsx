import React from "react";

const Skeleton = ({ className, variant = "default" }) => {
  const variants = {
    default: "bg-slate-200 rounded",
    card: "bg-slate-200 rounded-2xl",
    circle: "bg-slate-200 rounded-full",
    text: "bg-slate-200 rounded h-4 w-full",
    title: "bg-slate-200 rounded h-6 w-3/4",
    image: "bg-slate-200 rounded-lg",
    button: "bg-slate-200 rounded-lg h-10",
  };

  const baseClass = variants[variant] || variants.default;

  return (
    <div className={`animate-pulse ${baseClass} ${className || ""}`}></div>
  );
};

// Skeleton components for common patterns
export const SkeletonCard = ({ cols = 1 }) => (
  <div className={`grid gap-4 grid-cols-${cols}`}>
    {Array.from({ length: cols }).map((_, i) => (
      <div key={i} className="space-y-4">
        <Skeleton variant="image" className="h-48 w-full" />
        <Skeleton variant="title" className="h-5 w-full" />
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-2/3" />
      </div>
    ))}
  </div>
);

export const SkeletonProfile = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton variant="circle" className="h-20 w-20" />
      <div className="space-y-2 flex-1">
        <Skeleton variant="title" className="h-6 w-1/3" />
        <Skeleton variant="text" className="h-4 w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton variant="title" className="h-5 w-1/4" />
      <Skeleton variant="text" className="h-4 w-full" />
      <Skeleton variant="text" className="h-4 w-full" />
    </div>
  </div>
);

export const SkeletonList = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="border border-slate-200 rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <Skeleton variant="title" className="h-5 w-1/2" />
            <Skeleton variant="text" className="h-4 w-3/4" />
          </div>
          <Skeleton variant="button" className="h-8 w-20" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;