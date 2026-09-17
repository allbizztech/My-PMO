import React from 'react';

export const Badge = ({ text, type = 'default' }) => {
    const statusText = text && text.trim() ? text : 'Lewat';
    const styles = {
        'Aktif': 'bg-indigo-50/80 text-indigo-700 border-indigo-100',
        'Tertunda': 'bg-amber-50/80 text-amber-700 border-amber-100',
        'Lewat': 'bg-rose-50/80 text-rose-700 border-rose-100',
        'Berisiko': 'bg-red-50/80 text-red-700 border-red-100',
        'Selesai': 'bg-emerald-50/80 text-emerald-700 border-emerald-100',
        'Baik': 'bg-emerald-50/80 text-emerald-700 border-emerald-100',
        'Amaran': 'bg-amber-50/80 text-amber-700 border-amber-100',
        'Cemerlang': 'bg-blue-50/80 text-blue-700 border-blue-100',
        'Tinggi': 'bg-orange-50/80 text-orange-700 border-orange-100',
        'Segera': 'bg-red-50/80 text-red-700 border-red-100',
        'Sederhana': 'bg-slate-100 text-slate-700 border-slate-200',
        'Ditolak': 'bg-rose-50/80 text-rose-700 border-rose-100',
        'Menunggu Kelulusan': 'bg-amber-50/80 text-amber-700 border-amber-100',
        'Menunggu': 'bg-amber-50/80 text-amber-700 border-amber-100',
        'Dalam Tindakan': 'bg-blue-50/80 text-blue-700 border-blue-100',
        'default': 'bg-slate-100 text-slate-700 border-slate-200'
    };
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[statusText] || styles.default}`}>
            {statusText}
        </span>
    );
};

export default Badge;
