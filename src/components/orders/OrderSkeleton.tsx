import React from 'react';

export function OrderSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-100 rounded"></div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            </div>

            <div className="space-y-4 mb-4">
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                            <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}
