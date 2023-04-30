const express = require('express');
const router = express.Router();

const api = require(`../model/api`);

router.get(`/novo-atendimento`, (req, res) => {

    let pessoas = api.get(`/pessoas`);
    let itens = api.get(`/itens`);

    Promise.all([pessoas, itens]).then(response => {
        let pessoas = response[0].data;
        let itens = response[1].data;

        res.render(`form/novoAtendimento`, {
            title: `Novo Atendimento`,
            patients: pessoas,
            cpfFormatter: require(`../public/scripts/cpfFormatter`),
            moneyFormatter: require(`../public/scripts/moneyFormatter`),
            itens: itens
        });
    });
});

router.post(`/novo-atendimento`, (req, res) => {

    let data = req.body;

    let dataAtendimento = new Date(`${data.data_atendimento} ${data.horario_atendimento}`);
    dataAtendimento.setHours(dataAtendimento.getHours() - 3); // Horário de Brasília\

    let itens = [];

    // 1. Pegar todas as chave do objeto data
    let keys = Object.keys(data);

    // 2. Filtrar as chaves que começam com "item"
    let itemNames = keys.filter(key => key.startsWith(`item`) && key.endsWith(`-name`));
    let itemAmounts = keys.filter(key => key.startsWith(`item`) && key.endsWith(`-amount`));

    // 3. Percorrer as chaves selecionadas, agrupá-las e adicionar no array de itens
    for (let index = 0; index < itemNames.length; index++) {

        // 4. Vendo se o item já existe no array de itens
        if (itens.find(item => item.id_item == data[itemNames[index]])) {

            // 5. Se existir, somar a quantidade
            let item = itens.find(item => item.id_item == data[itemNames[index]])
            item.quantidade = `${parseInt(item.quantidade) + parseInt(data[itemAmounts[index]])}`;
            continue;

        }

        itens.push({
            id_item: data[itemNames[index]],
            quantidade: data[itemAmounts[index]]
        })

    }

    let json = {
        id_pessoa: data.id_pessoa,
        data_atendimento: dataAtendimento,
        itens: itens
    }

    api.post(`/atendimentos/new`, json).then(response => {
        res.redirect(`/`);
    })

});

module.exports = router;
