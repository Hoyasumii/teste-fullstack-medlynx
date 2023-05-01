let now = new Date(Date.now());

function addZero(number) {
    if (number < 10 && number >= 0) {
        return `0${number}`;
    }
    return number;
}

appointment_date.min = now.toISOString().split("T")[0];
appointment_date.value = now.toISOString().split("T")[0];

appointment_time.value = `${addZero(now.getHours())}:${addZero(now.getMinutes())}`;

let form = document.getElementById(`form`);

form.addEventListener(`submit`, (event) => {
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }

    form.classList.add(`was-validated`);

}, false);