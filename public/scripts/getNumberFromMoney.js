module.exports = (value) => {
    return parseFloat(value.split(`R$`)[1].replace(`,`, `.`))
}