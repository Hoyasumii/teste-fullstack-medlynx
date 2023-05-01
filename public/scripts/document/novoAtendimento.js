let now = new Date(Date.now());

function addZero(number) {
    if (number < 10 && number >= 0) {
        return `0${number}`;
    }
    return number;
}

function moneyFormatter(value, isFloat = false) {
    if (isFloat) {
        return `R$${parseFloat(value).toFixed(2).replace('.', ',')}`
    }
    return `R$${parseFloat(value).toFixed(2).replace('.', ',')}`
}

appointment_date.min = now.toISOString().split("T")[0];
appointment_date.value = now.toISOString().split("T")[0];

appointment_time.value = `${addZero(now.getHours())}:${addZero(now.getMinutes())}`;

let itemCounter = 1;

function addItem(itemList) {

    itemList = JSON.parse(itemList)

    let current = itemCounter;

    let container = document.createElement(`div`);
    container.classList.add(`bg-body-tertiary`, `p-3`, `border`, `rounded`, `d-flex`, `align-items-center`, `justify-content-between`, `gap-3`, `added-item`);
    container.id = `item-${itemCounter}`;

    let inputGroup = document.createElement(`div`);
    inputGroup.classList.add(`input-group`, `selected-itens`);

    let itemLabel = document.createElement(`label`);
    itemLabel.classList.add(`input-group-text`);
    itemLabel.setAttribute(`for`, `item-${itemCounter}-name`);
    itemLabel.innerHTML = `<span class="bi bi-capsule"></span>`;

    let itemSelect = document.createElement(`select`);
    itemSelect.classList.add(`form-control`, `w-75`);
    itemSelect.setAttribute(`name`, `item-${itemCounter}-name`);
    itemSelect.setAttribute(`id`, `item-${itemCounter}-name`);

    itemList.forEach(item => {
        itemSelect.innerHTML += `<option value="${item.id_item}">${item.descricao} - ${moneyFormatter(item.valor)}</option>`;
    })

    let amountInput = document.createElement(`input`);
    amountInput.classList.add(`form-control`, `w-min`);
    amountInput.setAttribute(`type`, `number`);
    amountInput.setAttribute(`name`, `item-${itemCounter}-amount`);
    amountInput.setAttribute(`id`, `item-${itemCounter}-amount`);
    amountInput.setAttribute(`placeholder`, `Escolha uma quantidade`);
    amountInput.setAttribute(`min`, `1`);
    amountInput.setAttribute(`value`, `1`);
    amountInput.onkeydown = () => false;

    let deleteButton = document.createElement(`button`);
    deleteButton.classList.add(`btn`, `btn-dark`);
    deleteButton.setAttribute(`type`, `button`);
    deleteButton.innerHTML = `<span class="bi bi-trash"></span>`;
    deleteButton.addEventListener(`click`, () => deleteItem(`item-${current}`));

    inputGroup.appendChild(itemLabel);
    inputGroup.appendChild(itemSelect);
    inputGroup.appendChild(amountInput);

    container.appendChild(inputGroup);
    container.appendChild(deleteButton);

    document.getElementById(`itens-container`).appendChild(container);

    itemCounter++;

}

function deleteItem(id) {
    document.getElementById(id).remove();
}

function loading() {
    let loadingDiv = document.createElement(`div`);
    loadingDiv.classList.add(`d-flex`, `justify-content-center`, `align-items-center`, `gap-1`);
    loadingDiv.id = `loading`;
    
    let loading = document.createElement(`div`);
    loading.classList.add(`spinner-border`, `text-dark`);
    loading.id = `loading`;
    
    loadingDiv.appendChild(loading);
    // Quando ele for aberto, eu vou querer remover TODO e qualquer conteúdo de #modal-body
    document.getElementById(`modal-body`).innerHTML = ``;
    document.getElementById(`modal-body`).appendChild(loadingDiv);
}

async function gettingData() {

    loading();

    let id_pessoa = document.getElementById(`patient-name`).value;

    let appointment_date = document.getElementById(`appointment_date`).value;
    let appointment_time = document.getElementById(`appointment_time`).value;

    let data_atendimento = new Date(`${appointment_date} ${appointment_time}`);
    data_atendimento.setHours(data_atendimento.getHours() - 3); // Horário de Brasília

    let itens = document.getElementsByClassName(`added-item`);
    let selectedItens = [];
    
    for (let index = 0; index < itens.length; index++) {

        let item = itens[index];
        let itemSelect = item.getElementsByTagName(`select`)[0];
        let itemAmount = item.getElementsByTagName(`input`)[0];

        selectedItens.push({
            id_item: itemSelect.value,
            quantidade: itemAmount.value
        });

    }

    let formData = {
        id_pessoa,
        data_atendimento,
        itens: selectedItens
    };

    await fetch(`/form/criando-atendimento`, {
        method: `POST`,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }).then(response => {
        return response.json();
    }).then(data => {
        if (document.getElementById(`loading`)) {
            document.getElementById(`loading`).remove();
        }
        creatingModal(data);
    })

}

// TODO: Não me esquecer de adicionar os input hidden com os valores e o botão de realizar estar dentro de um formulário

function creatingModal(data) {

    if (!document.getElementById(`loading`)) {
        document.getElementById(`modal-body`).innerHTML = ``;
    }

    let patientName = data.dados_documento.usuario.nome;
    let appointmentDate = data.dados_documento.data_atendimento;
    let itens = data.dados_documento.itens;
    
    let container = document.getElementById(`modal-body`);

    let patientNameSpan = document.createElement(`span`);
    let patientNameTitleSpan = document.createElement(`strong`);
    patientNameTitleSpan.innerText = `Nome do paciente: `;
    patientNameSpan.append(patientNameTitleSpan, patientName);

    let appointmentDateSpan = document.createElement(`span`);
    let appointmentDateTitleSpan = document.createElement(`strong`);
    appointmentDateTitleSpan.innerText = `Data do atendimento: `;
    appointmentDateSpan.append(appointmentDateTitleSpan, appointmentDate);

    container.append(patientNameSpan, appointmentDateSpan);

    if (itens.length > 0) {
        let itensTable = document.createElement(`table`);
        itensTable.classList.add(`table`, `table-striped`, `table-hover`, `table-bordered`);
        
        let titleDiv = document.createElement(`div`);

        let title = document.createElement(`span`);
        title.classList.add(`fs-4`, `my-0`)
        title.innerText = `Itens selecionados`;
        let hr = document.createElement(`hr`);
        hr.classList.add(`my-0`)

        titleDiv.append(title, hr);

        let itensTableHead = document.createElement(`thead`);
        let itensTableHeadRow = document.createElement(`tr`);

        let firstItem = itens[0];

        Object.keys(firstItem).forEach(key => {
            let th = document.createElement(`th`);
            th.innerText = key;
            itensTableHeadRow.appendChild(th);
        });

        let itensTableBody = document.createElement(`tbody`);
        
        itens.forEach(item => {
            let tr = document.createElement(`tr`);
            Object.values(item).forEach(value => {
                let td = document.createElement(`td`);
                td.innerText = value;
                tr.appendChild(td);
            });
            itensTableBody.appendChild(tr);
        });

        itensTableHead.appendChild(itensTableHeadRow);

        itensTable.append(itensTableHead, itensTableBody);

        let footerDiv = document.createElement(`div`);
        let hr2 = document.createElement(`hr`);
        hr2.classList.add(`my-0`);
        let totalDiv = document.createElement(`span`);
        totalDiv.innerHTML = `<strong>Total:</strong> ${data.dados_documento.total}`;

        footerDiv.append(totalDiv, hr2);

        container.append(titleDiv, itensTable, footerDiv);

    } else {
        let noItensDiv = document.createElement(`div`);
        noItensDiv.classList.add(`bg-body-tertiary`, `p-3`, `border`, `rounded`);
        noItensDiv.innerText = `Nenhum item foi selecionado`;
        container.append(noItensDiv);
    }

    /* TODO: Adicionar aqui os inputs */

    let form = document.createElement(`form`);
    form.setAttribute(`method`, `POST`);
    form.setAttribute(`action`, `/form/realizando-atendimento`);

    let id_pessoa = document.createElement(`input`);
    id_pessoa.setAttribute(`type`, `hidden`);
    id_pessoa.setAttribute(`name`, `id_pessoa`);
    id_pessoa.setAttribute(`value`, data.dados_formulario.id_pessoa);

    let data_atendimento = document.createElement(`input`);
    data_atendimento.setAttribute(`type`, `hidden`);
    data_atendimento.setAttribute(`name`, `data_atendimento`);
    data_atendimento.setAttribute(`value`, data.dados_formulario.data_atendimento);

    let itensInput = document.createElement(`input`);
    itensInput.setAttribute(`type`, `hidden`);
    itensInput.setAttribute(`name`, `itens`);
    itensInput.setAttribute(`value`, JSON.stringify(data.dados_formulario.itens));

    let submitButton = document.createElement(`button`);
    submitButton.setAttribute(`type`, `submit`);
    submitButton.classList.add(`btn`, `btn-dark`, `w-100`);
    submitButton.innerText = `Realizar atendimento`;

    form.append(id_pessoa, data_atendimento, itensInput, submitButton);
    container.append(form);

}