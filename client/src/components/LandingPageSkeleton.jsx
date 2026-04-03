import React from "react";
import Skeleton from "./Skeleton";

const LandingPageSkeleton = () => {
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div>
                        <Skeleton className="h-10 w-3/4 mb-4" />
                        <Skeleton className="h-6 w-2/3 mb-8" />
                        <div className="flex gap-4">
                            <Skeleton className="h-10 w-32 rounded" />
                            <Skeleton className="h-10 w-32 rounded" />
                        </div>
                    </div>
                    <div className="w-full h-full md:h-80 bg-gray-300 flex items-center justify-center rounded-lg overflow-hidden">
                        <Skeleton className="h-48 w-48 rounded" />
                    </div>
                </div>
            </div>

            {/* Key Features Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 mb-16">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white p-6 rounded-xl shadow-md max-w-sm"
                    >
                        <Skeleton className="h-48 w-full mb-6 rounded-lg" />
                        <Skeleton className="h-6 w-2/3 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6 mb-6" />
                        <Skeleton className="h-10 w-32 mx-auto rounded-lg" />
                    </div>
                ))}
            </div>

            {/* User Reviews Skeleton (Testimonials) */}
            <div className="relative overflow-hidden max-w-5xl mx-auto mb-16">
                <div className="flex gap-8 px-6">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-96 bg-white rounded-xl shadow-md border border-gray-200 px-6 py-4"
                        >
                            <div className="flex items-center mb-4 gap-2">
                                {[...Array(5)].map((_, j) => (
                                    <Skeleton key={j} className="w-5 h-5 rounded" />
                                ))}
                            </div>
                            <Skeleton className="h-4 w-full mb-4" />
                            <Skeleton className="h-4 w-2/3 mb-2" />
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-4 w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
                {[...Array(2)].map((_, colIdx) => (
                    <div key={colIdx} className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg border p-4">
                                <Skeleton className="h-6 w-2/3 mb-2" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Footer Skeleton */}
            <div className="bg-gray-100 border-t border-gray-200 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-32 mb-2" />
                        <Skeleton className="h-6 w-24 mb-2" />
                        <div className="flex space-x-3">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                        </div>
                    </div>
                    {[...Array(3)].map((_, i) => (
                        <div key={i}>
                            <div className="space-y-3">
                                {[...Array(4)].map((_, j) => (
                                    <Skeleton key={j} className="h-4 w-32" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-200 pt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
                    <Skeleton className="h-4 w-48 mb-2" />
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPageSkeleton;
