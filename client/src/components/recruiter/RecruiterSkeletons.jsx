import React from "react";

export const RecruiterSkeletonJobCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-4 xl:mb-0 h-full flex flex-col animate-pulse shadow-sm">
    <div className="flex items-start gap-4 sm:gap-5 flex-col sm:flex-row">
      {/* Avatar Placeholder */}
      <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
        <div className="shrink-0 w-14 h-14 rounded-2xl bg-gray-200" />
      </div>
      
      {/* Info Placeholder */}
      <div className="flex-1 min-w-0 mt-3 sm:mt-0 w-full">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-5 p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-4">
           <div className="grid grid-cols-2 gap-3">
             <div className="h-4 bg-gray-200 rounded-md w-full"></div>
             <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
             <div className="h-4 bg-gray-200 rounded-md w-full"></div>
             <div className="h-4 bg-gray-200 rounded-md w-4/5"></div>
           </div>
           
           <div className="pt-2 space-y-2">
             <div className="h-3 bg-gray-200 rounded-md w-full"></div>
             <div className="h-3 bg-gray-200 rounded-md w-2/3"></div>
           </div>
        </div>

        {/* Actions Placeholder */}
        <div className="flex items-center gap-2 mt-5">
           <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
           <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  </div>
);

export const RecruiterSkeletonCandidateCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-4 animate-pulse shadow-sm">
    <div className="flex items-start gap-4 sm:gap-5">
      <div className="shrink-0 w-14 h-14 rounded-2xl bg-gray-200"></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="h-5 bg-gray-200 rounded-md w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded-md w-1/3"></div>
            <div className="mt-2 flex flex-wrap gap-2">
              <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
              <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-center gap-2">
             <div className="w-14 h-14 rounded-full bg-gray-200"></div>
          </div>
        </div>
        
        <div className="mt-5 p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
           <div className="h-3 bg-gray-200 rounded-md w-full"></div>
           <div className="h-3 bg-gray-200 rounded-md w-full"></div>
           <div className="h-3 bg-gray-200 rounded-md w-4/5"></div>
        </div>

        <div className="flex items-center gap-2 mt-5">
           <div className="h-10 w-28 bg-gray-200 rounded-xl"></div>
           <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
           <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
           <div className="h-10 w-20 bg-gray-200 rounded-xl ml-auto"></div>
        </div>
      </div>
    </div>
  </div>
);

export const RecruiterSkeletonStatCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between animate-pulse shadow-sm">
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
      <div className="h-8 bg-gray-200 rounded w-16"></div>
      <div className="h-3 bg-gray-200 rounded w-20"></div>
    </div>
    <div className="w-14 h-14 rounded-2xl bg-gray-200"></div>
  </div>
);

const SkeletonShell = ({ children, className = "" }) => (
  <div className={`min-h-screen bg-gradient-to-br from-violet-50/70 via-white to-purple-50/60 ${className}`}>
    {children}
  </div>
);

export const RecruiterSkeletonHistoryPage = () => (
  <SkeletonShell>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="w-56 h-28 rounded-2xl bg-white border border-gray-100 shadow-sm animate-pulse" />
      <div className="flex items-center justify-center py-16">
        <div className="w-72 h-6 rounded-full bg-white/80 border border-gray-100 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <RecruiterSkeletonJobCard />
        <RecruiterSkeletonJobCard />
        <RecruiterSkeletonJobCard />
      </div>
    </div>
  </SkeletonShell>
);

export const RecruiterSkeletonCandidatesPage = () => (
  <SkeletonShell>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <RecruiterSkeletonStatCard />
        <RecruiterSkeletonStatCard />
        <RecruiterSkeletonStatCard />
        <RecruiterSkeletonStatCard />
      </div>
      <div className="space-y-4">
        <div className="h-14 rounded-2xl bg-white border border-gray-100 animate-pulse" />
        <div className="flex flex-wrap gap-2">
          <div className="h-10 w-28 rounded-full bg-white border border-gray-100 animate-pulse" />
          <div className="h-10 w-32 rounded-full bg-white border border-gray-100 animate-pulse" />
          <div className="h-10 w-24 rounded-full bg-white border border-gray-100 animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <RecruiterSkeletonJobCard />
        <RecruiterSkeletonJobCard />
        <RecruiterSkeletonJobCard />
      </div>
    </div>
  </SkeletonShell>
);

export const RecruiterSkeletonPostedJobsPage = () => (
  <SkeletonShell>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-sm animate-pulse">
        <div className="h-8 w-40 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-64 bg-gray-200 rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <RecruiterSkeletonStatCard />
        <RecruiterSkeletonStatCard />
        <RecruiterSkeletonStatCard />
        <RecruiterSkeletonStatCard />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <RecruiterSkeletonJobCard />
        <RecruiterSkeletonJobCard />
        <RecruiterSkeletonJobCard />
      </div>
    </div>
  </SkeletonShell>
);

export const RecruiterSkeletonAnalyticsPage = () => (
  <SkeletonShell>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-white rounded-xl border border-gray-100 animate-pulse" />
          <div className="h-4 w-80 bg-white rounded-xl border border-gray-100 animate-pulse" />
        </div>
        <div className="h-8 w-28 bg-white rounded-full border border-gray-100 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <RecruiterSkeletonStatCard />
        <RecruiterSkeletonStatCard />
        <RecruiterSkeletonStatCard />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-4">
          <div className="h-5 w-56 bg-gray-200 rounded" />
          <div className="h-80 rounded-2xl bg-gray-100" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-4">
          <div className="h-5 w-40 bg-gray-200 rounded" />
          <div className="space-y-3">
            <div className="h-12 bg-gray-100 rounded-xl" />
            <div className="h-12 bg-gray-100 rounded-xl" />
            <div className="h-12 bg-gray-100 rounded-xl" />
            <div className="h-12 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </SkeletonShell>
);

export const RecruiterSkeletonProfilePage = () => (
  <SkeletonShell>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex items-center gap-5 animate-pulse">
        <div className="w-24 h-24 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-3">
          <div className="h-7 w-64 bg-gray-200 rounded" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-72 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4">
            <div className="h-6 w-36 bg-gray-200 rounded" />
            <div className="space-y-3">
              <div className="h-16 bg-gray-100 rounded-xl" />
              <div className="h-16 bg-gray-100 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="h-28 bg-gray-100 rounded-2xl" />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-100 rounded-xl" />
            <div className="h-12 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </SkeletonShell>
);
