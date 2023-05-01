const express = require('express');
const router = express.Router();

const api = require(`../model/api`);

const cpfFormatter = require(`../public/scripts/formatters/cpfFormatter`);
const moneyFormatter = require(`../public/scripts/formatters/moneyFormatter`);
const dataFormatter = require(`../public/scripts/formatters/dataFormatter`);

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

router.post(`/novo-atendimento`, (req, res) => {

    let data = req.body;

    let dataAtendimento = new Date(`${data.data_atendimento} ${data.horario_atendimento}`);
    dataAtendimento.setHours(dataAtendimento.getHours() - 3); // Horário de Brasília\

    let itensSelecionados = [];

    // 1. Pegar todas as chave do objeto data
    let keys = Object.keys(data);

    // 2. Filtrar as chaves que começam com "item"
    let itemNames = keys.filter(key => key.startsWith(`item`) && key.endsWith(`-name`));
    let itemAmounts = keys.filter(key => key.startsWith(`item`) && key.endsWith(`-amount`));

    // 3. Percorrer as chaves selecionadas, agrupá-las e adicionar no array de itens
    for (let index = 0; index < itemNames.length; index++) {

        // 4. Vendo se o item já existe no array de itens
        if (itensSelecionados.find(item => item.id_item == data[itemNames[index]])) {

            // 5. Se existir, somar a quantidade
            let item = itensSelecionados.find(item => item.id_item == data[itemNames[index]])
            item.quantidade = `${parseInt(item.quantidade) + parseInt(data[itemAmounts[index]])}`;
            continue;

        }

        itensSelecionados.push({
            id_item: data[itemNames[index]],
            quantidade: data[itemAmounts[index]]
        })

    }

    // let json = {
    //     id_pessoa: data.id_pessoa,
    //     data_atendimento: dataAtendimento,
    //     itens: itensSelecionados
    // }

    /* api.post(`/atendimentos/new`, json).then(response => {
        res.redirect(`/`);
    }) */

    let usuario = api.get(`/pessoas/${data.id_pessoa}`);
    let itens = api.get(`/itens`);

    Promise.all([usuario, itens]).then(response => {
        let usuario = response[0].data;
        let itens = response[1].data;

        let columns = null;
        let data = null;

        if (itensSelecionados.length > 0) {
            itensSelecionados = itensSelecionados.map(item => {
                return {
                    "Descrição": itens.find(i => i.id_item == item.id_item).descricao,
                    "Quantidade": item.quantidade,
                    "Valor unitário": itens.find(i => i.id_item == item.id_item).valor,
                    "Valor a ser pago": item.quantidade * itens.find(i => i.id_item == item.id_item).valor
                }
            });

            columns = Object.keys(itensSelecionados[0]);
            data = itensSelecionados;
            
        }
        
        res.render(`form/confirmacao`, {
            columns: columns,
            data: data,
            title: `Confirmação de atendimento`,
            usuario: usuario,
            dataAtendimento: dataAtendimento,
            dataFormatter: dataFormatter,
            moneyFormatter: moneyFormatter
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
                "Valor unitário": item.valor,
                "Valor a ser pago": newItens[index].quantidade * item.valor
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
                itens: dadosDocumento
            }
        });
    });
    
});

module.exports = router;
