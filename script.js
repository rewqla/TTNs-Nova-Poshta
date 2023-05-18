const API_URL = "https://api.novaposhta.ua/v2.0/json/";
const API_KEY = "82553fd1d61bd7d87d24d3a51fa6c0c9";

async function GetResponse(model, method, properties) {
    return await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            apiKey: API_KEY,
            modelName: model,
            calledMethod: method,
            methodProperties: properties
        }),
    });
}

async function GetResponseResult(model, method, properties) {
    const response = await GetResponse(model, method, properties);
    let result = await response.json();

    // console.log(method)
    if (!result.success)
        result = await RepeatFetch(model, method, properties);

    // console.log(result)
    return result;
}
async function RepeatFetch(model, method, properties) {
    // console.log(1222)
    await new Promise(resolve => setTimeout(resolve, 800));
    return await (await GetResponse(model, method, properties)).json();
}

function GetByIdValue(Id) {
    return document.getElementById(Id).value;
}

//bootstrap
$('#datepicker').datepicker({ language: 'uk', dateFormat: 'dd, mm, yy' }).datepicker().datepicker("setDate", 'now');

document.getElementById("TTN-link").addEventListener("click", (e) => {
    e.preventDefault();
    HideAll();
    document.getElementById("generator").classList.remove("d-none");
});

async function Tracking(number) {
    const trackingData = await GetResponseResult("TrackingDocument", "getStatusDocuments", {
        Documents: [
            {
                DocumentNumber: number
            }
        ]
    });
    return trackingData.data[0];
}


document.getElementById("TTN-number-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    await LoadTrackingInfo();
});

async function LoadTrackingInfo(number = null) {
    HideAll();

    if (number === null) {
        number = GetByIdValue("tracking-numebr");
    }

    if (number.length == 14 && Number.isFinite(+number)) {

        let tracking_data = await Tracking(number);
        if (tracking_data) {
            console.log(tracking_data)
            document.getElementById("tracking-info").classList.remove("d-none");

            document.getElementById("package-number").innerText = number;
            document.getElementById("package-status").innerText = tracking_data.Status;
            document.getElementById("package-price").innerText = tracking_data.DocumentCost;
            document.getElementById("package-creation").innerText = tracking_data.DateCreated.split(' ')[0];
            document.getElementById("package-receiving").innerText = tracking_data.ActualDeliveryDate.split(' ')[0] ? tracking_data.RecipientDateTime.split(' ')[0].replace(/\./g, "-") : "Товар в дорозі";
        }
        else {
            document.getElementById("error-block").classList.remove("d-none");
            document.getElementById("error-text").innerText = "Не знайдено такого замовлення";
            document.getElementById("error-img").setAttribute("src", "ufo.jpg");
        }
    }
    else {
        document.getElementById("error-block").classList.remove("d-none");
        document.getElementById("error-text").innerText = "Не правильний формат номеру замовлення";
        document.getElementById("error-img").setAttribute("src", "No-Message.svg");
    }
}

function HideAll() {
    document.getElementById("generator").classList.add("d-none");
    document.getElementById("tracking-info").classList.add("d-none");
    document.getElementById("error-block").classList.add("d-none");
}

function PrintExpressPdf() {
    const num = document.getElementById("package-number").innerText;
    const url = `https://my.novaposhta.ua/orders/printDocument/orders[]/${num}/type/pdf/apiKey/${API_KEY}`;
    window.open(url, '_blank').focus();
}

function PrintExpressHtml() {
    const num = document.getElementById("package-number").textContent;
    const url = `https://my.novaposhta.ua/orders/printDocument/orders[]/${num}/type/html/apiKey/${API_KEY}`;
    window.open(url, '_blank').focus();
}

function PrintMarkingPdf() {
    const num = document.getElementById("package-number").innerText;
    const url = `https://my.novaposhta.ua/orders/printMarking85x85/orders[]/${num}/type/pdf8/apiKey/${API_KEY}`;
    window.open(url, '_blank').focus();
}

function PrintMarkingHtml() {
    const num = document.getElementById("package-number").textContent;
    const url = `https://my.novaposhta.ua/orders/printMarking85x85/orders[]/${num}/type/html/apiKey/${API_KEY}`;
    window.open(url, '_blank').focus();
}

async function GetCities(FindByString = "") {
    const cities = await GetResponseResult("Address", "getCities", {
        "FindByString": FindByString
    });
    console.log(cities)

    return cities.data;
}

async function GetCounterpartyRef(type) {
    const counterparty = await GetResponseResult("Counterparty", "getCounterparties", {
        CounterpartyProperty: type,
        Page: 1
    });

    return counterparty.data[0].Ref;
}

async function GetSender(ref) {
    const sender = await GetResponseResult("Counterparty", "getCounterpartyContactPersons", {
        "Ref": ref,
    });
    // console.log(sender)

    return sender.data[0];
}

async function GetWarehouses(CityName) {
    const warehouses = await GetResponseResult("Address", "getWarehouses", {
        "CityName": CityName
    });
    // console.log(warehouses)

    return warehouses.data;
}

async function LoadSender() {
    const sender = await GetSender(await GetCounterpartyRef("Sender"));

    document.getElementById("sender-first-name").value = sender.FirstName;
    document.getElementById("sender-middle-name").value = sender.LastName;
    document.getElementById("sender-last-name").value = sender.MiddleName;
    document.getElementById("sender-phone").value = sender.Phones;
}


document.addEventListener('DOMContentLoaded', async () => {
    await FillSelectByWarehouses("recipient");
    LoadSender();
    await FillSelectByWarehouses("sender");
});

document.getElementById("sender-city").addEventListener('input', async () => {
    await FillSelectByWarehouses("sender");
});

document.getElementById("recipient-city").addEventListener('input', async () => {
    await FillSelectByWarehouses("recipient");
});


document.getElementById("recipient-address").addEventListener('change', (e) => {
    if (e.target.options[e.target.selectedIndex].text.includes("Поштомат")) {
        document.getElementById("doors-section").classList.remove("d-none");
        document.getElementById("warehouse-section").classList.add("d-none")
    }
    else {
        document.getElementById("doors-section").classList.add("d-none");
        document.getElementById("warehouse-section").classList.remove("d-none")
    }
});


async function FillSelectByWarehouses(type) {
    let city = GetByIdValue(`${type}-city`);
    if (city.length < 3)
        return;

    let warehouses = await GetWarehouses(city);
    if (warehouses.length > 0) {
        const address = document.getElementById(`${type}-address`);
        address.innerHTML = '';

        if (type === "sender") {
            warehouses = warehouses.filter(element => !element.Description.includes("Поштомат"))
        }

        warehouses.forEach((warehouse) => {
            const option = document.createElement('option');
            option.text = `${warehouse.Description}`;
            option.value = warehouse.Ref;
            address.appendChild(option);
        });
    }
}

const poshta_form = document.getElementById("nova-poshta-form");
poshta_form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (CheckIfFieldsEmpty() && await CheckPersonData("recipient") && await CheckPersonData("sender") && CheckAdditionalData()) {
        console.log("za za za")
        //     let params = await CreateContactPersonRecipient(GetByIdValue("recipient-name"), GetByIdValue("recipient-middle-name"), GetByIdValue("recipient-last-name"), GetByIdValue("recipient-phone"));;

        //     Object.assign(params, await GetWarehouse(GetByIdValue("recipient-city"), GetByIdValue("recipient-address"), "Recipient"));
        //     Object.assign(params, await GetContactPersons(await GetCounterpartyRef("Sender"), "Sender"));
        //     Object.assign(params, await GetWarehouse(GetByIdValue("sender-city"), GetByIdValue("sender-address"), "Sender"));
        //     Object.assign(params, GetPageData());
        //     Object.assign(params, BackwardDelivery());

        //     params.CargoType = "Parcel";
        //     params.ServiceType = "WarehouseWarehouse";

        //     LoadTrackingInfo(await NewInternetDocument(params))
    }
});

async function CheckPersonData(personType) {
    return CheckInitials(personType) && CheckPhone(personType) && await CheckAddress(personType);
}

async function CheckAddress(typeOfPerson) {
    const city = GetByIdValue(typeOfPerson + "-city");
    const address = GetByIdValue(typeOfPerson + "-address");
    let errorSpan = document.querySelector(`span[for=${typeOfPerson}-city]`);
    const warehouses = await GetResponseResult("Address", "getWarehouses", {
        CityName: city
    });

    if (warehouses.data.length > 0) {
        errorSpan.innerHTML = "";
        errorSpan = document.querySelector(`span[for=${typeOfPerson}-address]`);

        const warehouse = warehouses.data.find((w) => w.Ref === address);

        if (warehouse) {
            errorSpan.innerHTML = "";
            return true;
        }

        errorSpan.innerHTML = "Проблеми з адрессою відділення";
        return false;
    }

    errorSpan.innerHTML = "Введіть правильне місто";
    return false;
}

function CheckPhone(typeOfPerson) {
    const regexPhone = new RegExp("^([+]?(38))?(0[0-9]{9})$");
    const phone = GetByIdValue(typeOfPerson + "-phone");
    const errorSpan = document.querySelector(`span[for=${typeOfPerson}-phone]`);

    if (regexPhone.test(phone)) {
        errorSpan.innerText = "";
        return true;
    }

    errorSpan.innerText = "Не правильний формат телефону";
    return false;
}

function CheckInitials(typeOfPerson) {
    const regexUkrainian = /^[А-ЩЬЮЯЄІЇҐа-щьюяєіїґ]+$/;
    const initials = document.getElementById(typeOfPerson + "-form").querySelectorAll(".form-control");
    let isValid = true;

    for (let i = 0; i < 3; i++) {
        const errorSpan = document.querySelector(`span[for=${initials[i].id}]`);

        if (regexUkrainian.test(initials[i].value.trim())) {
            errorSpan.innerText = "";
        }
        else {
            errorSpan.innerText = "Дані мають містити лише українські букви";
        }
    }

    return isValid;
}

function CheckIfFieldsEmpty() {
    const inputs = Array.from(poshta_form.querySelectorAll("form input"));
    let isValid = true;

    if (poshta_form.querySelector("#doors-section").classList.contains('d-none')) {
        inputs.splice(13, 4);
    }
    else {
        inputs.splice(11, 2);
    }
    inputs.splice(-1, 1);

    inputs.forEach(element => {
        const errorSpan = document.querySelector(`span[for=${element.id}]`);

        if (element.value.trim() === '') {
            errorSpan.innerText = "Поле має бути не пустим";
            isValid = false;
        }
        else {
            errorSpan.innerText = "";
        }
    });

    return isValid;
}

function GetCurrentDate() {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = String(currentDate.getFullYear());

    return `${day}.${month}.${year}`;
}

function CheckAdditionalData() {
    let isValid = true;

    let elem = GetByIdValue("description");
    let errorSpan = document.querySelector("span[for=description]");

    if (elem.trim().length <= 0) {
        errorSpan.innerHTML = "Опис відправлення має бути не пустим";
        isValid = false;
    }
    else
        errorSpan.innerHTML = "";

    elem = GetByIdValue("cost");
    errorSpan = document.querySelector("span[for=cost]");

    if (+elem <= 0 || +elem > 10000 || !Number.isInteger(+elem)) {
        errorSpan.innerHTML = "Ціна має бути цілим числом більшим за 0 і меншим за 10 000";
        isValid = false;
    }
    else
        errorSpan.innerHTML = "";

    elem = GetByIdValue("DateTime");
    errorSpan = document.querySelector("span[for=DateTime]");

    if (elem < GetCurrentDate()) {
        errorSpan.innerHTML = "Дата не може бути меншою за сьогоднішній день";
        isValid = false;
    }
    else
        errorSpan.innerHTML = "";

    if (document.getElementById("warehouse-section").classList.contains("d-none")) {
        elem = +GetByIdValue("doors-weight");
        errorSpan = document.querySelector("span[for=doors-weight]");

        if (elem <= 0 || elem > 20 || !Number.isFinite(elem)) {
            errorSpan.innerHTML = "Вага має бути числом більшим за 0 і меншим за 20";
            isValid = false;
        }
        else
            errorSpan.innerHTML = "";

        elem = +GetByIdValue("volumetric-width");
        errorSpan = document.querySelector("span[for=volumetric-width]");

        if (elem <= 0 || elem > 40 || !Number.isFinite(elem)) {
            errorSpan.innerHTML = "Ширина одного місця має бути числом більшим за 0 і меншим за 40";
            isValid = false;
        }
        else
            errorSpan.innerHTML = "";

        elem = +GetByIdValue("volumetric-length");
        errorSpan = document.querySelector("span[for=volumetric-length]");

        if (elem <= 0 || elem > 60 || !Number.isFinite(elem)) {
            errorSpan.innerHTML = "Довжина одного місця має бути число більшим за 0 і меншим за 60";
            isValid = false;
        }
        else
            errorSpan.innerHTML = "";

        elem = +GetByIdValue("volumetric-height");
        errorSpan = document.querySelector("span[for=volumetric-height]");

        if (elem <= 0 || elem > 30 || !Number.isFinite(elem)) {
            errorSpan.innerHTML = "Висота одного місця має бути числом більшим за 0 і меншим за 30";
            isValid = false;
        }
        else
            errorSpan.innerHTML = "";
    }
    else {
        elem = +GetByIdValue("weight");
        errorSpan = document.querySelector("span[for=weight]");

        if (elem <= 0 || !Number.isFinite(elem)) {
            errorSpan.innerHTML = "Вага має бути числом більшим за 0";
            isValid = false;
        }
        else
            errorSpan.innerHTML = "";

        elem = +GetByIdValue("seats-amount");
        errorSpan = document.querySelector("span[for=seats-amount]");

        if (elem <= 0 || !Number.isInteger(elem)) {
            errorSpan.innerHTML = "Кількість місць має бути цілим числом більшим за 0";
            isValid = false;
        }
        else
            errorSpan.innerHTML = "";
    }

    return isValid;
}



// //Створення отримувача, якщо вже такий існує то отримує його дані
// async function CreateContactPersonRecipient(firstName, middleName, lastName, phone) {
//     const recipient = await GetResponseResult("Counterparty", "save", {
//         FirstName: firstName,
//         MiddleName: middleName,
//         LastName: lastName,
//         Phone: phone,
//         CounterpartyType: "PrivatePerson",
//         CounterpartyProperty: "Recipient"
//     });

//     return {
//         "Recipient": recipient.data[0].Ref,
//         "ContactRecipient": recipient.data[0].ContactPerson.data[0].Ref,
//         "RecipientsPhone": phone
//     }
// }

// //Отримання WarehouseId, city ref, warehouse ref
// async function GetWarehouse(city, address, type) {
//     const warehouses = await GetResponseResult("Address", "getWarehouses", {
//         CityName: city,
//     });

//     const warehouse = warehouses.data.find((w) => w.Description === address);

//     return {
//         [type + "WarehouseIndex"]: warehouse.WarehouseIndex,
//         [type + "Address"]: warehouse.Ref,
//         ["City" + type]: warehouse.CityRef
//     };
// }

// //Отримання контрагента
// async function GetCounterpartyRef(type) {
//     const counterparty = await GetResponseResult("Counterparty", "getCounterparties", {
//         CounterpartyProperty: type,
//         Page: 1
//     });

//     return counterparty.data[0].Ref;
// }

// //Отримання даних контактних осіб контрагента
// async function GetContactPersons(ref, type) {
//     const contacts = await GetResponseResult("Counterparty", "getCounterpartyContactPersons", {
//         Ref: ref,
//     });

//     return {
//         [type]: ref,
//         ["Contact" + type]: contacts.data[0].Ref,
//         [type + "sPhone"]: GetByIdValue(type.charAt(0).toLowerCase() + type.slice(1) + "-phone")
//     }
// }

// //Отримання даних з additional-information-form
// function GetPageData() {
//     return {
//         Description: GetByIdValue("description"),
//         PayerType: GetByIdValue("payer-type"),
//         PaymentMethod: GetByIdValue("payment-method"),
//         Weight: GetByIdValue("weight"),
//         SeatsAmount: GetByIdValue("seats-amount"),
//         Cost: GetByIdValue("cost"),
//         DateTime: GetByIdValue("DateTime"),
//     };
// }

// //Зворотня доставка
// function BackwardDelivery() {
//     const label = document.getElementById("backward-label");
//     const isPaymentOnDelivery = document.getElementById("order-payment-method").textContent === "Оплата при отриманні";
//     label.style.visibility = isPaymentOnDelivery ? "visible" : "hidden";

//     if (isPaymentOnDelivery) {
//         return {
//             "BackwardDeliveryData": [{
//                 "PayerType": "Recipient",
//                 "CargoType": "Money",
//                 "RedeliveryString": GetByIdValue("cost")
//             }]
//         };
//     }
// }
// // BackwardDelivery();



// async function NewInternetDocument(params) {
//     const internetDocument = await GetResponseResult("InternetDocument", "save", params);
//     return internetDocument.data[0].IntDocNumber;
// }