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

async function gettingData() {

    let id_pessoa = document.getElementById(`patient-name`).value;

    let appointment_date = document.getElementById(`appointment_date`).value;
    let appointment_time = document.getElementById(`appointment_time`).value;

    let data_atendimento = new Date(`${appointment_date} ${appointment_time}`);
    data_atendimento.setHours(data_atendimento.getHours() - 3);

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
        console.log(data);
    })

    // TODO: Criar uma rota para pegar os dados necessários e enviar para o modal

}