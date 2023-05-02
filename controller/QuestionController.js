const express = require('express');
const router = express.Router();

const api = require(`../model/api`);

const moneyFormatter = require(`../public/scripts/formatters/moneyFormatter`);
const getNumberFromMoney = require(`../public/scripts/getNumberFromMoney`);
const cpfFormatter = require(`../public/scripts/formatters/cpfFormatter`);

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
                    valor_unitario: moneyFormatter(item.valor)
                });
            }
        });

        itensConsumidos.forEach(itemConsumido => {
            let valorUnitario = getNumberFromMoney(itemConsumido.valor_unitario);
            itemConsumido.valor_total = moneyFormatter(valorUnitario * itemConsumido.quantidade);
        });

        itensConsumidos.sort((a, b) => b.quantidade - a.quantidade);

        res.render(`read`, {
            columns: Object.keys(itensConsumidos[0]),
            data: itensConsumidos.slice(0, 5),
            title: "Itens mais consumidos"
        });

    });

});

router.get(`/3`, (req, res) => {

    let pacientes = api.get(`/pessoas`);
    let atendimentos = api.get(`/atendimentos`);
    let lancamentos = api.get(`/lancamentos`);
    let itens = api.get(`/itens`);
    let evolucao = api.get(`/evolucao`);

    Promise.all([pacientes, atendimentos, lancamentos, itens, evolucao]).then(response => {

        // Por que eu usei os index ao invés de me dirigir ao ../id? Pelo motivo de facilitar os processos, já que, eu procurando os dados a partir de uma única requisição, eu pouparia tempo de execução.

        let pacientes = response[0].data
        let atendimentos = response[1].data
        let lancamentos = response[2].data
        let itens = response[3].data
        let evolucao = response[4].data

        // 1. Ir para evolução e pegar { id_atendimento } dos pacientes que tiveram a descricao "reação alérgica grave" + o id_pessoa
        let atendimentosReacaoAlergicaGrave = evolucao.filter(evolucao => evolucao.descricao.startsWith("reação alérgica grave")).map(evolucao => {
            return {
                id_atendimento: evolucao.id_atendimento,
                id_pessoa: atendimentos.find(atendimento => atendimento.id_atendimento == evolucao.id_atendimento).id_pessoa,
                data_atendimento: atendimentos.find(atendimento => atendimento.id_atendimento == evolucao.id_atendimento).data_atendimento
            }
        })

        // 2. Pegar { id_item } do lançamento que tiver os { id_atendimento } contido no array atendimentoReacaoAlergicaGrave
        let lancamentosReacaoAlergicaGrave = lancamentos.filter(lancamento => atendimentosReacaoAlergicaGrave.find(atendimento => atendimento.id_atendimento == lancamento.id_atendimento)).map(lancamento => {
            return {
                id_atendimento: lancamento.id_atendimento,
                id_item: lancamento.id_item,
                descricao: itens.find(item => item.id_item == lancamento.id_item).descricao
            }
        });

        // Opicional: Pegar { nome, cpf } do id_pessoa que está em atendimentoReacaoAlergicaGrave
        let pessoasReacaoAlergicaGrave = atendimentosReacaoAlergicaGrave.map(atendimento => {
            return {
                id_pessoa: atendimento.id_pessoa,
                nome: pacientes.find(paciente => paciente.id_pessoa == atendimento.id_pessoa).nome,
                cpf: pacientes.find(paciente => paciente.id_pessoa == atendimento.id_pessoa).cpf
            }
        });

        // 3. Agrupar tudo
        atendimentosReacaoAlergicaGrave.forEach(atendimento => {
            atendimento.nome = pessoasReacaoAlergicaGrave.find(pessoa => pessoa.id_pessoa == atendimento.id_pessoa).nome;
            atendimento.cpf = cpfFormatter(pessoasReacaoAlergicaGrave.find(pessoa => pessoa.id_pessoa == atendimento.id_pessoa).cpf);
            atendimento.id_item = lancamentosReacaoAlergicaGrave.filter(lancamento => lancamento.id_atendimento == atendimento.id_atendimento)[0].id_item;
            atendimento.descricao_medicamento = lancamentosReacaoAlergicaGrave.filter(lancamento => lancamento.id_atendimento == atendimento.id_atendimento)[0].descricao;
        });

        // 4. Filtrar para o ano de 2022
        let data = atendimentosReacaoAlergicaGrave.map(atendimento => {
            let dataAtendimento = new Date(atendimento.data_atendimento);

            if (dataAtendimento.getFullYear() == 2022) {
                return {
                    id_atendimento: atendimento.id_atendimento,
                    id_pessoa: atendimento.id_pessoa,
                    data_atendimento: atendimento.data_atendimento,
                    nome: atendimento.nome,
                    cpf: atendimento.cpf,
                    id_item: atendimento.id_item,
                    descricao_medicamento: atendimento.descricao_medicamento
                }
            }
        }).filter(atendimento => atendimento != undefined || atendimento != null);

        res.render(`read`, {
            columns: Object.keys(data[0]),
            data: data,
            title: "Pacientes com reação alérgica grave"
        });

    });

});

module.exports = router;