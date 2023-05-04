/* 
    Eu vou pegar todos os .botao-paciente, .botao-lancamentos e .botao-evolucoes e adicionar um evento de click neles. Esse botão vai fazer uma requisição na api, a depender do tipo, e vai retornar os dados para gerar um modal com os dados do paciente, dos lancamentos ou das evoluções.
*/

let modal = new bootstrap.Modal(`#display-data`);

let modalDialog = document.querySelector(`#modal-dialog`);
let modalTitle = document.querySelector(`#modal-title`);
let modalBody = document.querySelector(`#modal-body`);

function createDiv(...props) {
    let div = document.createElement(`div`);
    div.classList.add(...props);
    return div;
}

function setLoading() {
    let loadingDiv = createDiv(`d-flex`, `justify-content-center`, `align-items-center`, `h-100`, `w-100`);
    let loading = createDiv(`spinner-border`);
    loadingDiv.appendChild(loading);
    modalBody.appendChild(loadingDiv);
}

function clearModalContent() {
    modalTitle.innerHTML = ``;
    modalBody.innerHTML = ``;
}

document.getElementById(`display-data`).addEventListener(`hidden.bs.modal`, () => {
    modalDialog.classList.remove(`modal-lg`, `modal-xl`)
    clearModalContent();
});

let botaoPacientes = document.querySelectorAll(`.botao-paciente`);

botaoPacientes.forEach(botao => {
    botao.addEventListener(`click`, async () => {
        setLoading();
        modal.show();
        fetch(`reports/pessoas/${botao.value}`).then(response => response.json()).then(data => {
            clearModalContent();

            let keys = Object.keys(data);
            let values = Object.values(data);

            modalTitle.innerHTML = `Dados de ${data.nome}`;

            let table = document.createElement(`table`);
            table.classList.add(`table`, `table-hover`);

            let tableBody = document.createElement(`tbody`);
            tableBody.classList.add(`table-body`);

            keys.forEach((key, index) => {
                let tr = document.createElement(`tr`);

                let keyItem = document.createElement(`th`);
                keyItem.innerHTML = key;

                let value = document.createElement(`td`);
                value.innerHTML = values[index];

                tr.append(keyItem, value);

                tableBody.appendChild(tr);
            });

            table.append(tableBody);

            modalBody.appendChild(table);
        })
    });
});

let botaoLancamentos = document.querySelectorAll(`.botao-lancamentos`);

botaoLancamentos.forEach(botao => {
    botao.addEventListener(`click`, async () => {
        setLoading();
        modal.show();
        fetch(`reports/lancamentos/${botao.value}`).then(response => response.json()).then(data => {
            
            let values = data.data;

            if (values.length > 0) {
                let keys = Object.keys(values[0]);
                let total = data.valorTotal;
    
                clearModalContent();
                modalDialog.classList.add(`modal-lg`);
                modalTitle.innerHTML = `Lançamentos do atendimento ${values[0].id_atendimento}`;

                let table = document.createElement(`table`);
                table.classList.add(`table`, `table-hover`);

                let caption = document.createElement(`caption`);
                caption.innerHTML = `Valor total: ${total}`;

                let tableHead = document.createElement(`thead`);
                tableHead.classList.add(`table-head`);

                let headRow = document.createElement(`tr`);

                keys.forEach(key => {
                    let th = document.createElement(`th`);
                    th.innerHTML = key;

                    headRow.appendChild(th);
                });

                tableHead.appendChild(headRow);
                
                let tableBody = document.createElement(`tbody`);
                tableBody.classList.add(`table-body`);
                
                values.forEach(value => {
                    let tr = document.createElement(`tr`);

                    keys.forEach(key => {
                        let td = document.createElement(`td`);
                        td.innerHTML = value[key];

                        tr.appendChild(td);
                    });

                    tableBody.appendChild(tr);
                });

                table.append(caption, tableHead, tableBody);
                modalBody.appendChild(table);

            } else {
                clearModalContent();
                modalTitle.innerHTML = `Aviso`;

                let emptyValue = createDiv(`bg-body-tertiary`, `border`, `rounded`, `p-3`)
                emptyValue.innerHTML = `Não há lançamentos para esse atendimento.`;

                modalBody.appendChild(emptyValue);

            }
        })
    });
});

let botaoEvolucoes = document.querySelectorAll(`.botao-evolucoes`);

botaoEvolucoes.forEach(botao => {
    botao.addEventListener(`click`, async () => {
        setLoading();
        modal.show();
        fetch(`reports/evolucoes/${botao.value}`).then(response => response.json()).then(data => {
            let values = data;

            if (values.length > 0) {
                let keys = Object.keys(values[0]);
    
                clearModalContent();
                modalDialog.classList.add(`modal-xl`);
                modalTitle.innerHTML = `Evoluções do atendimento ${values[0].id_atendimento}`;

                let table = document.createElement(`table`);
                table.classList.add(`table`, `table-hover`);

                let tableHead = document.createElement(`thead`);
                tableHead.classList.add(`table-head`);

                let headRow = document.createElement(`tr`);

                keys.forEach(key => {
                    let th = document.createElement(`th`);
                    th.innerHTML = key;

                    headRow.appendChild(th);
                });

                tableHead.appendChild(headRow);
                
                let tableBody = document.createElement(`tbody`);
                tableBody.classList.add(`table-body`);
                
                values.forEach(value => {
                    let tr = document.createElement(`tr`);

                    keys.forEach(key => {
                        let td = document.createElement(`td`);
                        td.innerHTML = value[key];

                        tr.appendChild(td);
                    });

                    tableBody.appendChild(tr);
                });

                table.append(tableHead, tableBody);
                modalBody.appendChild(table);

            } else {
                clearModalContent();
                modalTitle.innerHTML = `Aviso`;

                let emptyValue = createDiv(`bg-body-tertiary`, `border`, `rounded`, `p-3`)
                emptyValue.innerHTML = `Não há lançamentos para esse atendimento.`;

                modalBody.appendChild(emptyValue);
            }
        })
    });
});
