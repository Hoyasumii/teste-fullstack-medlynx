const zeroFormater = require('./zeroFormatter')

module.exports = (data) => {

    let months = [`janeiro`, `fevereiro`, `março`, `abril`, `maio`, `junho`, `julho`, `agosto`, `setembro`, `outubro`, `novembro`, `dezembro`]

    return `${zeroFormater(data.getUTCDate())} de ${months[data.getUTCMonth()]} de ${data.getUTCFullYear()} às ${zeroFormater(data.getUTCHours())}:${zeroFormater(data.getUTCMinutes())}`
    
}