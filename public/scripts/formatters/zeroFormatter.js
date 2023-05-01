module.exports = (value) => {
    return `${value}`.length == 1 ? `0${value}` : `${value}`;
};