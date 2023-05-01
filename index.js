const express = require('express');
const bodyParser = require('body-parser');

const app = express();

/* TODO: Antes de enviar, adicionar um validador para esses formulários */
/* TODO: Antes de enviar, checar o nome das variáveis e deixá-las apenas no inglês. */

/* TODO:
    Esse requisito 2 dá pra fazer d+:
    1. Cria um formulário com a data e hora inicial do período + a final
    2. No controller, percorre todos os atendimentos e filtra os que estão dentro desse período
    3. Pega os dados da api /lancamentos e depois /itens para pegar os valores de cada atendimento.
    4. Junta tudo e manda pro front
*/

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(`/`, require(`./controller/HomeController`));
app.use(`/data`, require(`./controller/DataController`));
app.use(`/question`, require(`./controller/QuestionController`));
app.use(`/form`, require(`./controller/FormController`));

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
