module.exports = function cepFormatter(cep) {
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2")
}