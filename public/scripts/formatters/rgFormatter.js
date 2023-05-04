module.exports = function RGFormatter(rg) {
    return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4")
}