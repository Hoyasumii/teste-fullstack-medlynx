const express = require('express');
const router = express.Router();

const api = require(`../services/api`);

const dateFormatter = require(`../public/scripts/formatters/dateFormatter`);
const moneyFormatter = require(`../public/scripts/formatters/moneyFormatter`);
const getNumberFromMoney = require(`../public/scripts/getNumberFromMoney`);
const cpfFormatter = require(`../public/scripts/formatters/cpfFormatter`);
const rgFormatter = require(`../public/scripts/formatters/rgFormatter`);
const cepFormatter = require(`../public/scripts/formatters/cepFormatter`);

const detect = (...values) => {
	let current = null;

	for (let index = 0; index < values.length; index++) {
		current = values[index];
		if (current != null) return index;
	}
}

router.get(`/`, async (req, res) => {

    let id_atendimento = req.query.id_atendimento ?? null;

    let mes_desejado = req.query.mes_desejado ?? null;
    let ano_desejado = req.query.ano_desejado ?? null;

    let mode = req.query.mode ?? null;

    let active = detect(id_atendimento, (mes_desejado && ano_desejado), mode);
    let data = null;

    switch (active) {
        case 0:
            await api.get(`/atendimentos/${id_atendimento}`).then(response => {
            
                let responseData = response.data;
                if (!responseData) throw new Error(`Atendimento não encontrado`);
                responseData.data_atendimento = dateFormatter(responseData.data_atendimento, true, true);
                data = [responseData];
            }).catch(err => {
            });
            break;
        case 1:
            await api.get(`/atendimentos`).then(response => {
                let responseData = response.data;
                
                data = responseData.filter(atendimento => {
                    let atendimentoDate = new Date(atendimento.data_atendimento);

                    if (atendimentoDate.getMonth() + 1 == mes_desejado && atendimentoDate.getFullYear() == ano_desejado) {
                        atendimento.data_atendimento = dateFormatter(atendimento.data_atendimento, true, true);
                        return atendimento;
                    }
                });

                data = (data.length == 0) ? null : data;

            }).catch(err => {});
            break;
        case 2:
            await api.get(`/atendimentos`).then(response => {
                let responseData = response.data;
                data = responseData.map(atendimento => {
                    atendimento.data_atendimento = dateFormatter(atendimento.data_atendimento, true, true);
                    return atendimento;
                });
            });

            break;
        default:
            
            break;
    }

    let columns = null;

    try {
        columns = Object.keys(data[0]);
    } catch(err) {
        columns = [];
    }

    res.render(`reports/index`, {
        title: `Relatório`,
        data: data,
        columns: columns
    })

    // TODO: Quando for aberto o relatório geral ou o por período, colocar um botão que vai calcular o valor total de todos os atendimentos e mostrar em um modal

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