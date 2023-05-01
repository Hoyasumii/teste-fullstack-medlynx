const express = require('express');
const router = express.Router();

const api = require(`../model/api`);

const cpfFormatter = require(`../public/scripts/formatters/cpfFormatter`);
const moneyFormatter = require(`../public/scripts/formatters/moneyFormatter`);
const dataFormatter = require(`../public/scripts/formatters/dataFormatter`);

const getNumberFromMoney = require(`../public/scripts/getNumberFromMoney`);

router.get(`/novo-atendimento`, (req, res) => {

    let pessoas = api.get(`/pessoas`);
    let itens = api.get(`/itens`);

    Promise.all([pessoas, itens]).then(response => {
        let pessoas = response[0].data;
        let itens = response[1].data;

        res.render(`form/novoAtendimento`, {
            title: `Novo Atendimento`,
            patients: pessoas,
            cpfFormatter: cpfFormatter,
            moneyFormatter: moneyFormatter,
            dataFormatter: dataFormatter,
            itens: itens
        });
    });
});

router.post(`/criando-atendimento`, async (req, res) => {
    let body = req.body;

    let itens = body.itens;
    let newItens = [];

    // Caso eu tenha mais de um elemento com o mesmo id_item, eu some as quantidades
    itens.forEach(item => {
        let index = newItens.findIndex(i => i.id_item == item.id_item);
        if (index == -1) {
            newItens.push(item);
        } else {
            newItens[index] = {
                id_item: item.id_item,
                quantidade: `${parseInt(newItens[index].quantidade) + parseInt(item.quantidade)}`
            }
        }
    })

    let usuario = api.get(`/pessoas/${body.id_pessoa}`);
    let itensSelecionados = [...newItens].map(item => {
        return api.get(`/itens/${item.id_item}`)
    });

    Promise.all([usuario, ...itensSelecionados]).then(response => {

        let usuario = response[0].data;
        let itens = response.slice(1).map(item => item.data);

        let dadosDocumento = [];

        itens.forEach(item => {
            let index = newItens.findIndex(i => i.id_item == item.id_item);
            dadosDocumento.push({
                "Descrição": item.descricao,
                "Quantidade": newItens[index].quantidade,
                "Valor unitário": moneyFormatter(item.valor),
                "Valor a ser pago": moneyFormatter(newItens[index].quantidade * item.valor)
            })
        })

        res.status(200).send({
            dados_formulario: {
                id_pessoa: body.id_pessoa,
                data_atendimento: body.data_atendimento,
                itens: newItens,
            },
            dados_documento: {
                usuario: usuario,
                itens: dadosDocumento,
                data_atendimento: dataFormatter(new Date(body.data_atendimento)),
                total: moneyFormatter(dadosDocumento.reduce((acc, cur) => acc + getNumberFromMoney(cur[`Valor a ser pago`]), 0))
            }
        });
    });
});

router.post(`/realizando-atendimento`, (req, res) => {
    let body = req.body;

    let itens = JSON.parse(body.itens);

    api.post(`/atendimentos/new`, {
        id_pessoa: body.id_pessoa,
        data_atendimento: new Date(body.data_atendimento),
        itens: itens
    }).then(response => {
        res.redirect(`/`);
    });

});

module.exports = router;
