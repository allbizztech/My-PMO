import React from 'react';

export const Card = ({ children, className = "", noPadding = false }) => (
    <div className={`bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden ${noPadding ? '' : 'p-6 lg:p-8'} ${className}`}>
        {children}
    </div>
);

export default Card;
