const zeroFormater = require('./zeroFormatter')

module.exports = (data, complete = true) => {

    let months = [`janeiro`, `fevereiro`, `março`, `abril`, `maio`, `junho`, `julho`, `agosto`, `setembro`, `outubro`, `novembro`, `dezembro`]

    if (complete) {
        return `${zeroFormater(data.getUTCDate())} de ${months[data.getUTCMonth()]} de ${data.getUTCFullYear()} às ${zeroFormater(data.getUTCHours())}:${zeroFormater(data.getUTCMinutes())}`
    }

    return `${zeroFormater(data.getUTCDate())}/${zeroFormater(data.getUTCMonth() + 1)}/${data.getUTCFullYear()} ${zeroFormater(data.getUTCHours())}:${zeroFormater(data.getUTCMinutes())}`

}