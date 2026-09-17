import React from 'react';

export const ProgressBar = ({ progress, colorClass = "bg-slate-800" }) => (
    <div className="w-full bg-slate-100 rounded-full h-2">
        <div className={`${colorClass} h-2 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${progress}%` }}></div>
    </div>
);

export default ProgressBar;
