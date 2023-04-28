const express = require('express');
const router = express.Router();

const api = require(`../model/api`);

router.get(`/nova-consulta`, (req, res) => {

    api.get(`/pessoas`).then(response => {
        res.render('form/novaConsulta', {
            title: 'Novo Atendimento',
            patients: response.data,
            cpfFormatter: require(`../public/scripts/cpfFormatter`)
        });
    })
})

module.exports = router;
