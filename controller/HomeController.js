const express = require('express');
const router = express.Router();

const api = require(`../model/api`);

const dataFormatter = require(`../public/scripts/formatters/dataFormatter`);

router.get(`/`, (req, res) => {

    let atendimentos = api.get(`/atendimentos`);
    let pessoas = api.get(`/pessoas`);

    Promise.all([atendimentos, pessoas]).then(response => {
        let atendimentos = response[0].data;
        let pessoas = response[1].data;

        let data = atendimentos.map(atendimento => {

            let data = new Date(atendimento.data_atendimento);
            data.setHours(data.getHours() - 3);

            return {
                id_atendimento: atendimento.id_atendimento,
                id_pessoa: atendimento.id_pessoa,
                data_atendimento: dataFormatter(data, false),
                nome: pessoas.find(pessoa => pessoa.id_pessoa == atendimento.id_pessoa).nome
            }
        });

        res.render(`index`, {
            title: "Página Inicial",
            data: data
        });

    });

});

module.exports = router;