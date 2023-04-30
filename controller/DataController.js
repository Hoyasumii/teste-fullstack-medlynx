const express = require('express');
const router = express.Router();

const api = require(`../model/api`);

router.get(`/`, (req, res) => {
    res.render(`data/index`, {
        title: "Consultar dados"
    });
});

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

/*
1. Instanciar o axios
2. Fazer a requisição para a API
3. Pegar o resultado da requisição
4. Contar a quantidade de propriedades do objeto
5. Renderizar a view, enviando: {
    model: Array,
    data: JSON
}  
*/

module.exports = router;