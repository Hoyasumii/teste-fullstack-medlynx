const express = require('express');
const router = express.Router();

const api = require(`../services/api`);

const dateFormatter = require(`../public/scripts/formatters/dateFormatter`);
const moneyFormatter = require(`../public/scripts/formatters/moneyFormatter`);
const getNumberFromMoney = require(`../public/scripts/getNumberFromMoney`);
const cpfFormatter = require(`../public/scripts/formatters/cpfFormatter`);
const rgFormatter = require(`../public/scripts/formatters/rgFormatter`);
const cepFormatter = require(`../public/scripts/formatters/cepFormatter`);

router.get(`/`, (req, res) => {

    let id_atendimento = req.query.id_atendimento ?? null;

    if (id_atendimento) {
        api.get(`/atendimentos/${id_atendimento}`).then(response => {
            
            let data = response.data;
            if (!data) throw new Error(`Atendimento não encontrado`);

            data.data_atendimento = dateFormatter(data.data_atendimento, true, true);

            res.render(`reports/index`, {
                title: `Relatório`,
                data: [data],
                columns: Object.keys(data)
            })
        }).catch(err => {
            res.send(`Atendimento não encontrado`)
        });
    }

    // TODO: Quando for aberto o relatório geral ou o por período, colocar um botão que vai calcular o valor total de todos os atendimentos e mostrar em um modal

    else {
        res.send(`Aqui vai ser um relatório geral de todos os atendimentos`)
    }
});

router.get(`/pessoas/:id_pessoa`, (req, res) => {
    api.get(`/pessoas/${req.params.id_pessoa}`).then(response => {

        let data = response.data;
        if (!data) throw new Error(`Pessoa não encontrada`);

        data.cpf = cpfFormatter(data.cpf);
        data.rg = rgFormatter(data.rg);
        data.cep = cepFormatter(data.cep);

        res.send(response.data);

    }).catch(err => {
        res.send(`Pessoa não encontrada`)
    })
});

router.get(`/lancamentos/:id_atendimento`, (req, res) => {

    let id_atendimento = req.params.id_atendimento;

    let lancamentos = api.get(`/lancamentos`);
    let itens = api.get(`/itens`);

    Promise.all([lancamentos, itens]).then(response => {
        let lancamentos = response[0].data;
        let itens = response[1].data;

        let data = lancamentos.filter(lancamento => lancamento.id_atendimento == id_atendimento);
        
        let itensFiltrados = []

        data.forEach(lancamento => {
            let item = itens.find(item => item.id_item == lancamento.id_item);
            itensFiltrados.push(item);
        });

        data.forEach(lancamento => {
            let item = itens.find(item => item.id_item == lancamento.id_item);
            lancamento.descricao = item.descricao;
            lancamento.valor = moneyFormatter(parseFloat(item.valor));
            lancamento.valor_total = moneyFormatter(parseFloat(item.valor) * parseInt(lancamento.quantidade));
        })

        let valorTotal = 0;

        data.forEach(lancamento => {
            valorTotal += getNumberFromMoney(lancamento.valor_total);
        });
    
        res.send({
            data,
            valorTotal: moneyFormatter(valorTotal)
        });
    });
});

router.get(`/evolucoes/:id_atendimento`, (req, res) => {

    let id_atendimento = req.params.id_atendimento;

    let evolucoes = api.get(`/evolucao`);

    evolucoes.then(response => {
        let data = response.data;

        let evolucoesFiltradas = data.filter(evolucao => evolucao.id_atendimento == id_atendimento);

        data = evolucoesFiltradas.map(evolucao => {
            return {
                id_atendimento: evolucao.id_atendimento,
                data: dateFormatter(evolucao.data, true, true),
                descricao: evolucao.descricao
            }
        });

        res.send(data);
    })
});

module.exports = router;