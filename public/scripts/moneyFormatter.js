module.exports = (value, isFloat = false) => {
    if (isFloat) {
        return `R$${parseFloat(value).toFixed(2).replace('.', ',')}`
    }
    return `R$${parseFloat(value).toFixed(2).replace('.', ',')}`
}