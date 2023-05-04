const zeroFormater = require('./zeroFormatter')

module.exports = (date, complete = true, toConvert = false) => {

    if (toConvert) {
        date = new Date(date)
    }

    let months = [`janeiro`, `fevereiro`, `março`, `abril`, `maio`, `junho`, `julho`, `agosto`, `setembro`, `outubro`, `novembro`, `dezembro`]

    if (complete) {
        return `${zeroFormater(date.getDate())} de ${months[date.getMonth()]} de ${date.getFullYear()} às ${zeroFormater(date.getHours())}:${zeroFormater(date.getMinutes())}`
    }

    return `${zeroFormater(date.getDate())}/${zeroFormater(date.getMonth() + 1)}/${date.getFullYear()} ${zeroFormater(date.getHours())}:${zeroFormater(date.getMinutes())}`

}