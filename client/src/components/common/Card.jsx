import React from 'react';

export const Card = ({ children, className = "", noPadding = false }) => (
    <div className={`bg-white rounded-2xl sm:rounded-[20px] shadow-xs hover:shadow-sm border border-slate-100/90 transition-all overflow-hidden ${noPadding ? '' : 'p-4 sm:p-5 lg:p-6'} ${className}`}>
        {children}
    </div>
);

export default Card;
