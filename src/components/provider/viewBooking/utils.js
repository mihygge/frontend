export const formatCardDate = (date) => {
    const day = date.toLocaleString('default', { day: '2-digit' });
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.toLocaleString('default', { year: '2-digit' });
    return [day, `${month}’`, year].join(' ');
};

export const getDayFromDate = (date) => {
    return date.toLocaleString('default', { weekday: 'short' });
};
