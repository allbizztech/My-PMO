export const formatShortName = (fullName) => {
    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '' || fullName === '-') return '';
    let clean = fullName.replace(/\b(bin|binti|bte|a\/l|a\/p)\b.*/i, '').trim();
    return clean || fullName;
};

export const formatDateMalay = (dateStr) => {
    if (!dateStr) return '';
    try {
        const parts = String(dateStr).split('-');
        if (parts.length === 3 && parts[0].length === 4) {
            const months = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];
            const day = parseInt(parts[2], 10);
            const monthIdx = parseInt(parts[1], 10) - 1;
            const year = parts[0];
            if (months[monthIdx]) {
                return `${day} ${months[monthIdx]} ${year}`;
            }
        }
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const months = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
        return dateStr;
    }
};

export const formatCurrencyMYR = (val) => {
    let amount = Number(val) || 0;
    return 'RM ' + amount.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
