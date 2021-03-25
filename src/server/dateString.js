const dateString = date => {
    if (!(date instanceof Date)) {
        return date;
    }
    return date.toISOString().substr(0, 10);
    // const month = date.getMonth() >= 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    // const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();

    // return `${date.getFullYear()}-${month}-${day}`;
};

module.exports = dateString;