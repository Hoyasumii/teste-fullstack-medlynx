const express = require('express');
const router = express.Router();

const api = require(`../services/api`);

const moneyFormatter = require(`../public/scripts/formatters/moneyFormatter`);

router.get(`/pacientes`, (req, res) => {
    api.get(`/pessoas`).then(response => {
        res.render(`read`, {
            columns: Object.keys(response.data[0]),
            data: response.data.sort((a, b) => a.id_pessoa - b.id_pessoa),
            title: "Pacientes"
        });
    });

});

router.get(`/atendimentos`, (req, res) => {
    api.get(`/atendimentos`).then(response => {
        res.render(`read`, {
            columns: Object.keys(response.data[0]),
            data: response.data.sort((a, b) => a.id_atendimento - b.id_atendimento),
            title: "Atendimentos"
        });
    });
});

router.get(`/itens-disponiveis`, (req, res) => {
    api.get(`/itens`).then(response => {

        response.data.forEach(item => {
            item.valor = moneyFormatter(item.valor);
        })

        res.render(`read`, {
            columns: Object.keys(response.data[0]),
            data: response.data.sort((a, b) => a.id_item - b.id_item),
            title: "Itens disponíveis"
        });
    });
});

router.get(`/lancamentos`, (req, res) => {
    api.get(`/lancamentos`).then(response => {
        res.render(`read`, {
            columns: Object.keys(response.data[0]),
            data: response.data.sort((a, b) => a.id_lancamento - b.id_lancamento),
            title: "Lançamentos"
        });
    });
});

router.get(`/evolucoes`, (req, res) => {
    api.get(`/evolucao`).then(response => {
        res.render(`read`, {
            columns: Object.keys(response.data[0]),
            data: response.data.sort((a, b) => a.id_evolucao - b.id_evolucao),
            title: "Evoluções"
        });
    });
});

module.exports = router;