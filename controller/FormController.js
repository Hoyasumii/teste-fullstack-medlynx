const express = require('express');
const router = express.Router();

const api = require(`../model/api`);

router.get(`/nova-consulta`, (req, res) => {

    let pessoas = api.get(`/pessoas`);
    let itens = api.get(`/itens`);

    Promise.all([pessoas, itens]).then(response => {
        let pessoas = response[0].data;
        let itens = response[1].data;

        res.render(`form/novaConsulta`, {
            title: `Novo Atendimento`,
            patients: pessoas,
            cpfFormatter: require(`../public/scripts/cpfFormatter`),
            moneyFormatter: require(`../public/scripts/moneyFormatter`),
            itens: itens
        });
    });

});

module.exports = router;
