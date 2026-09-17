import React from 'react';

export const DonutChart = ({ percentage, colorClass = "text-slate-800", label }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                    <circle className="text-slate-50" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="64" cy="64" />
                    <circle className={colorClass} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="64" cy="64" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-slate-800 tracking-tight">{percentage}%</span>
                </div>
            </div>
            {label && <span className="text-sm font-semibold text-slate-500 mt-4 tracking-wide uppercase">{label}</span>}
        </div>
    );
};

export default DonutChart;
