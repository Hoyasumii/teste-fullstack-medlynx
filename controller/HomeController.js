const express = require('express');
const router = express.Router();

const api = require(`../services/api`);

const dateFormatter = require(`../public/scripts/formatters/dateFormatter`);

router.get(`/`, (req, res) => {

    let atendimentos = api.get(`/atendimentos`);
    let pessoas = api.get(`/pessoas`);

    Promise.all([atendimentos, pessoas]).then(response => {
        let atendimentos = response[0].data;
        let pessoas = response[1].data;

        let data = atendimentos.map(atendimento => {

            let date = new Date(atendimento.data_atendimento);
            date.setHours(date.getHours() - 3);

            return {
                id_atendimento: atendimento.id_atendimento,
                id_pessoa: atendimento.id_pessoa,
                data_atendimento: dateFormatter(date, false),
                nome: pessoas.find(pessoa => pessoa.id_pessoa == atendimento.id_pessoa).nome
            }
        });

        let months = [`Janeiro`, `Fevereiro`, `Março`, `Abril`, `Maio`, `Junho`, `Julho`, `Agosto`, `Setembro`, `Outubro`, `Novembro`, `Dezembro`];

        res.render(`index`, {
            title: "Página Inicial",
            data: data,
            months
        });

    });

});

module.exports = router;