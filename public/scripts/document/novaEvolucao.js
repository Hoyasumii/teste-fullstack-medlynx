let now = new Date(Date.now());
let date = `${now.getFullYear()}-${addZero(now.getMonth() + 1)}-${addZero(now.getDate())}`;

function addZero(number) {
    if (number < 10 && number >= 0) {
        return `0${number}`;
    }
    return number;
}

appointment_date.min = date;
appointment_date.value = date;

appointment_time.value = `${addZero(now.getHours())}:${addZero(now.getMinutes())}`;

let form = document.getElementById(`form`);

form.addEventListener(`submit`, (event) => {
    
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }

    form.classList.add(`was-validated`);

}, false);