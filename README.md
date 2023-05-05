# Teste Fullstack - Medlynx

## Índice
1. [Sobre](#sobre)
2. [Breve explicação sobre a estrutura de pastas e arquivos](#breve-explicação-sobre-a-estrutura-de-pastas-e-arquivos)
3. [Aonde encontrar as soluções?](#aonde-encontrar-as-soluções)
4. [Como rodar o projeto?](#como-rodar-o-projeto)
5. [Epílogo](#epílogo)

## Sobre
- O projeto foi desenvolvido por **Alan Reis** para o teste de Fullstack da Medlynx entre os dias 27/04/2023 e 04/05/2023.
- O teste cria uma situação imaginária do **dr. Magnovaldo**, que é um médico que precisa de um sistema em que ele possa:
    1. Cadastrar Atendimentos
    2. Atualizar o estado de um atentimento
    3. Além de poder consultar alguns dados do sistema, como: Pacientes, Itens disponíveis, Lançamentos, os atendimentos e essas atualizações.
- O sistema foi desenvolvido utilizando o **NodeJS** com o framework **Express** e a engine de views **EJS**. Além disso, ele também utiliza o **Axios** para fazer as requisições para a API.
- O site foi desenvolvido apenas utilizando o **Bootstrap 5**, com pequenas alterações no **CSS**.

## Breve explicação sobre a estrutura de pastas e arquivos
- O projeto usa o padrão **MVC**, embora não tenha nenhum modelo, apenas as views e os controllers.
- A pasta **public** contém os arquivos estáticos do site, como o **CSS** e o **JS**.
- A pasta **views** contém as views do site, que são renderizadas pelo **EJS**.
- A pasta **controller** contém os controllers do site, que são responsáveis por fazer as requisições para a API e renderizar as views.
- A pasta **services** contém o arquivo da **api.js**, já que não fazia sentido em colocar esse arquivo dentro da pasta **controllers** nem **models**.

## Aonde encontrar as soluções?
1. Doutor precisa de uma lista dos **5 itens** com **maior** consumo nos **atendimentos**,ordenados no **maior para o menor**. colunas (descrição do item,quantidade).'
> Na página inicial do site, é possível encontrar um Card com o título "Clique **aqui** para saber os 5 itens com **maior** consumo nos atendimentos.". Clique no "aqui" e você será redirecionado para a página que contém a solução.
2. Em determinados períodos, o Dr. Magnovaldo precisa **gerar relatórios** com todos atendimentos e valores, pesquisando sempre por um período.
> Ainda na página inicial do site, é possível encontrar um tópico, embaixo dos Cards informativos, com o título **Gerador de Relatórios**, e embaixo dele, haverá uma lista de opções para gerar o relatório: Tanto pode ser por um atendimento em específico, como por mês, trimestre, semestre ou ano.
3. Durante o ano de 2022 vários pacientes foram medicados pelo Dr. Magnovaldo e alguns deles estão internados e ele é o principal suspeito da polícia. Na busca por sua inocência, o doutor desconfia que algum medicamento é o responsável. Todos os pacientes que foram internados tiveram evoluções com o seguinte diagnóstico **reação alérgica grave**. Sendo assim, o doutor precisa de todos os pacientes que possuem esta evolução e o(s) medicamento(s) que tem em comum nos seus atendimentos.
> Ainda na página inicial, embaixo do Card do primeiro requisito, temos o card que irá entregar a solução.
4. Doutor precisa saber **quais itens tem cadatrado no sistema**.
> Para saber quais itens que estão cadastrados no sistema, ainda no menu inicial, embaixo da barra de navegação, temos o botão com o nome **Consultar dados**, que ao ser clicado, irá exibir um Modal com uma lista de opções. Para solucionar esse requisito, basta clicar na opção **Itens disponíveis**.
5. O Doutor precisa **realizar novas evoluções**, sendo assim precisa de uma tela que selecione o atendimento e um campo texto para digitar.
> Para realizar novas evoluções, basta clicar na barra de navegação, na segunda opção depois do ícone do site, aonde diz **Nova Evolução**. Ao clicar, você será redirecionado para a página que contém um formulário que permite a criação de um novo registro.
6. O Doutor precisa **realizar novos atendimentos**, sendo que cada atendimento seleciona o paciente,o(s) iten(s) e suas respectivas quantidades na tela. Antes de finalizar o atendimento, verifica a na tela item a item, sua descrição,valores de cada um e o total antes de gerar o atendimento.
> Para realizar novos atendimentos, basta clicar na barra de navegação, na primeira opção depois do ícone do site, aonde diz **Novo Atendimento**. Ao clicar, você será redirecionado para a página que contém um formulário que permite a criação de um novo registro.

## Como rodar o projeto?
1. Tenha o **Node.js** instalado na sua máquina. Caso não tenha, basta clicar [**aqui**](https://nodejs.org/en/) para baixar.
2. Tenha o **Git** instalado na sua máquina. Caso não tenha, basta clicar [**aqui**](https://git-scm.com/downloads) para baixar.
3. Abra o **Git** e digite: `git clone https://github.com/Hoyasumii/teste-fullstack-medlynx.git`
4. Após clonar o repositório, abra o terminal na pasta do projeto e digite: `npm install`
5. Após instalar as dependências, digite: `npm start`
6. Abra o navegador e digite: `localhost:3000`
7. Pronto! O projeto já está rodando na sua máquina.

## Epílogo
- Para encerrar, gostaria de pedir a você que está lendo esse documento para explorar a aplicação, que embora tenha entregado todos os requisitos, ela também entrega algumas coisas a mais. Alguns recursos mais voltados para a experiência do usuário e coesão visual.
- Agradeço a oportunidade de participar do processo seletivo e espero que gostem do meu trabalho.