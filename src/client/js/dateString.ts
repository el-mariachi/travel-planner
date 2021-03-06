// returns standard ISO string for Date object
const dateString = (date: Date): string => {
    if (!(date instanceof Date)) {
        return date;
    }
    return date.toISOString().substr(0, 10);
};

export { dateString };