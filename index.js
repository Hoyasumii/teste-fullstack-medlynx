const express = require('express');
const bodyParser = require('body-parser');

const app = express();

/* TODO: Antes de enviar, adicionar um validador para esses formulários */
/* TODO: Antes de enviar, checar o nome das variáveis e deixá-las apenas no inglês. */

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
