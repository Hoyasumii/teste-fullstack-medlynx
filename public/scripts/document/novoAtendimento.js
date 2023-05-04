let now = new Date(Date.now());
let date = `${now.getFullYear()}-${addZero(now.getMonth() + 1)}-${addZero(now.getDate())}`;

function createDiv(...classes) {
    let div = document.createElement(`div`);
    div.classList.add(...classes);
    return div;
}

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

appointment_date.min = date;
appointment_date.value = date;

appointment_time.value = `${addZero(now.getHours())}:${addZero(now.getMinutes())}`;

let itemCounter = 1;

function addItem(itemList) {

    itemList = JSON.parse(itemList)

    let current = itemCounter;

    let inputGroup = createDiv(`input-group`, `added-item`);
    inputGroup.id = `item-${itemCounter}`;

    let inputGroupLabel = document.createElement(`label`);
    inputGroupLabel.classList.add(`input-group-text`);
    inputGroupLabel.setAttribute(`for`, `item-${itemCounter}-name`);
    inputGroupLabel.innerHTML = `<span class="bi bi-capsule">`

    let formFloatingItem = createDiv(`form-floating`, `w-50`);

    let itemSelect = document.createElement(`select`);
    itemSelect.classList.add(`form-select`);
    itemSelect.setAttribute(`name`, `item-${itemCounter}-name`);
    itemSelect.setAttribute(`id`, `item-${itemCounter}-name`);

    itemList.forEach(item => {
        itemSelect.innerHTML += `<option value="${item.id_item}">${item.descricao} - ${moneyFormatter(item.valor)}</option>`;
    })

    itemListLabel = document.createElement(`label`);
    itemListLabel.setAttribute(`for`, `item-${itemCounter}-name`);
    itemListLabel.innerHTML = `Escolha a medicação`;

    formFloatingItem.append(itemSelect, itemListLabel);

    let formFloatingAmount = createDiv(`form-floating`, `w-25`);

    let amountInput = document.createElement(`input`);
    amountInput.classList.add(`form-control`, `w-min`);
    amountInput.setAttribute(`type`, `number`);
    amountInput.setAttribute(`name`, `item-${itemCounter}-amount`);
    amountInput.setAttribute(`id`, `item-${itemCounter}-amount`);
    amountInput.setAttribute(`placeholder`, `Escolha uma quantidade`);
    amountInput.setAttribute(`min`, `1`);
    amountInput.setAttribute(`value`, `1`);
    amountInput.onkeydown = () => false;

    let amountLabel = document.createElement(`label`);
    amountLabel.setAttribute(`for`, `item-${itemCounter}-amount`);
    amountLabel.innerHTML = `Quantidade`;

    formFloatingAmount.append(amountInput, amountLabel);

    let deleteButton = document.createElement(`button`);
    deleteButton.classList.add(`btn`, `btn-light`, `border`);
    deleteButton.setAttribute(`type`, `button`);
    deleteButton.innerHTML = `<span class="bi bi-trash"></span>`;
    deleteButton.addEventListener(`click`, () => deleteItem(`item-${current}`));

    inputGroup.append(inputGroupLabel, formFloatingItem, formFloatingAmount, deleteButton);

    if (itemCounter == 1) {
        let hr1 = document.createElement(`hr`);
        hr1.classList.add(`my-0`);

        let hr2 = document.createElement(`hr`);
        hr2.classList.add(`my-0`);

        let itensContainer = document.createElement(`div`);
        itensContainer.id = `itens-container`;
        itensContainer.classList.add(`grid`);

        document.getElementById(`place`).append(hr1, itensContainer, hr2);
    }

    document.getElementById(`itens-container`).appendChild(inputGroup);

    itemCounter++;

}

function deleteItem(id) {
    document.getElementById(id).remove();
}

function loading() {
    let loadingDiv = createDiv(`d-flex`, `justify-content-center`, `align-items-center`, `gap-1`);
    loadingDiv.id = `loading`;
    
    let loading = createDiv(`spinner-border`, `text-dark`);
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

    await fetch(`/form/novo-atendimento/1`, {
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
        itensTable.classList.add(`table`, `table-hover`, `table-bordered`);
        
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
        let noItensDiv = createDiv(`bg-body-tertiary`, `p-3`, `border`, `rounded`);
        noItensDiv.innerText = `Nenhum item foi selecionado`;
        container.append(noItensDiv);
    }

    let form = document.createElement(`form`);
    form.setAttribute(`method`, `POST`);
    form.setAttribute(`action`, `/form/novo-atendimento/2`);

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