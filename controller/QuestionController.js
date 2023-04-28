const express = require('express');
const router = express.Router();

const api = require(`../model/api`);

const groupBy = require(`../src/scripts/groupBy`);

router.get(`/1`, (req, res) => {

    let lancamentos = api.get(`/lancamentos`);
    let itens = api.get(`/itens`);

    Promise.all([lancamentos, itens]).then(response => {
        let lancamentos = response[0].data;
        let itens = response[1].data;

        let itensConsumidos = [];

        lancamentos.forEach(lancamento => {
            let item = itens.find(item => item.id_item == lancamento.id_item);

            if (itensConsumidos.find(itemConsumido => itemConsumido.id_item == lancamento.id_item)) {
                itensConsumidos.find(itemConsumido => itemConsumido.id_item == lancamento.id_item).quantidade += parseInt(lancamento.quantidade);
            } else {
                itensConsumidos.push({
                    id_item: item.id_item,
                    descricao: item.descricao,
                    quantidade: parseInt(lancamento.quantidade),
                    valor_unitario: `R$${item.valor.replace(".", ",")}`
                });
            }
        });

        itensConsumidos.forEach(itemConsumido => {
            itemConsumido.valor_total = `R$${(parseFloat(itemConsumido.valor_unitario.replace("R$", "").replace(",", ".")) * itemConsumido.quantidade).toFixed(2).replace(".", ",")}`;
        });

        itensConsumidos.sort((a, b) => b.quantidade - a.quantidade);

        res.render(`read`, {
            columns: Object.keys(itensConsumidos[0]),
            data: itensConsumidos.slice(0, 5),
            title: "Itens mais consumidos"
        });

    });

});

module.exports = router;