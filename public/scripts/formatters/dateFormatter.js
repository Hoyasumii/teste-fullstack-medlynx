const zeroFormater = require('./zeroFormatter')

module.exports = (date, complete = true, toConvert = false) => {

    if (toConvert) {
        date = new Date(date)
    }

    let months = [`janeiro`, `fevereiro`, `março`, `abril`, `maio`, `junho`, `julho`, `agosto`, `setembro`, `outubro`, `novembro`, `dezembro`]

    if (complete) {
        return `${zeroFormater(date.getUTCDate())} de ${months[date.getUTCMonth()]} de ${date.getUTCFullYear()} às ${zeroFormater(date.getUTCHours())}:${zeroFormater(date.getUTCMinutes())}`
    }

    return `${zeroFormater(date.getUTCDate())}/${zeroFormater(date.getUTCMonth() + 1)}/${date.getUTCFullYear()} ${zeroFormater(date.getUTCHours())}:${zeroFormater(date.getUTCMinutes())}`

}