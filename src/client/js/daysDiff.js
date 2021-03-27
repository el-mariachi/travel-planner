// calculates full day difference between two dates
const daysDiff = (future, now) => {
    return epochFullDays(future) - epochFullDays(now);
};

function epochFullDays(epoch) {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    return Math.floor(epoch / millisecondsPerDay);
}

export { daysDiff };