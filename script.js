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

    console.log(result.success)
    if (!result.success)
        result = await RepeatFetch(model, method, properties);

    console.log(result)
    return result;
}
async function RepeatFetch(model, method, properties) {
    console.log(1222)
    new Promise(resolve => setTimeout(resolve, 500)).then(async () => {
        return await GetResponse(model, method, properties);
    });
}

// //Отримання значення елементу 
// function GetByIdValue(Id) {
//     return document.getElementById(Id).value;
// }

// //Перевірка чи поля пусті 
// function CheckIfFieldsEmpty() {
//     const inputs = document.querySelectorAll("form input");
//     let isValid = true;

//     inputs.forEach(element => {
//         const errorSpan = document.querySelector(`span[for=${element.id}]`);

//         if (element.value.trim() === '') {
//             errorSpan.innerText = "Поле має бути не пустим";
//             isValid = false;
//         }
//         else {
//             errorSpan.innerText = "";
//         }
//     });

//     return isValid;
// }

// //Перевірка адреси 
// async function CheckAddress(typeOfPerson) {
//     const city = GetByIdValue(typeOfPerson + "-city");
//     const address = GetByIdValue(typeOfPerson + "-address");
//     let errorSpan = document.querySelector(`span[for=${typeOfPerson}-city]`);
//     const warehouses = await GetResponseResult("Address", "getWarehouses", {
//         CityName: city
//     });

//     if (warehouses.data.length > 0) {
//         errorSpan.innerHTML = "";
//         errorSpan = document.querySelector(`span[for=${typeOfPerson}-address]`);

//         const warehouse = warehouses.data.find((w) => w.Description === address);

//         if (warehouse) {
//             errorSpan.innerHTML = "";
//             return true;
//         }

//         errorSpan.innerHTML = "Введіть правильну адрессу відділення";
//         return false;
//     }

//     errorSpan.innerHTML = "Введіть правильне місто";
//     return false;
// }

// //Перевірка телефону 
// function CheckPhone(typeOfPerson) {
//     const regexPhone = new RegExp("^([+]?(38))?(0[0-9]{9})$");
//     const phone = GetByIdValue(typeOfPerson + "-phone");
//     const errorSpan = document.querySelector(`span[for=${typeOfPerson}-phone]`);

//     if (regexPhone.test(phone)) {
//         errorSpan.innerText = "";
//         return true;
//     }

//     errorSpan.innerText = "Не правильний формат телефону";
//     return false;
// }

// //Перевірка телефону та адреси вказаного типу особи 
// async function CheckPersonData(personType) {
//     return CheckPhone(personType) && await CheckAddress(personType);
// }

// //Перевірка полів additional-information-form 
// function CheckAdditionalData() {
//     const ids = ["weight", "volume-general", "seats-amount", "cost"];
//     let isValid = true;

//     ids.forEach(element => {
//         const errorSpan = document.querySelector(`span[for=${element}]`);
//         const inputData = +GetByIdValue(element);

//         if (typeof inputData === 'number' && !Number.isNaN(inputData)) {
//             if (inputData <= 0) {
//                 errorSpan.innerText = "Поле має бути більшим за 0";
//                 isValid = false;
//             }
//             else {
//                 errorSpan.innerText = "";
//             }
//         }
//         else {
//             errorSpan.innerText = "Поле має бути числового типу";
//             isValid = false;
//         }
//     })

//     return isValid;
// }

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

// //Створення ттн 
// async function NewInternetDocument(params) {
//     const internetDocument = await GetResponseResult("InternetDocument", "save", params);
//     return internetDocument.data[0].IntDocNumber;
// }

// let novaPoshtaForm = document.getElementById("nova-poshta-form");
// novaPoshtaForm.addEventListener("submit", async function (e) {
//     e.preventDefault();

//     if (CheckIfFieldsEmpty() && await CheckPersonData("recipient") && await CheckPersonData("sender") && CheckAdditionalData()) {
//         let params = await CreateContactPersonRecipient(GetByIdValue("recipient-name"), GetByIdValue("recipient-middle-name"), GetByIdValue("recipient-last-name"), GetByIdValue("recipient-phone"));;

//         Object.assign(params, await GetWarehouse(GetByIdValue("recipient-city"), GetByIdValue("recipient-address"), "Recipient"));
//         Object.assign(params, await GetContactPersons(await GetCounterpartyRef("Sender"), "Sender"));
//         Object.assign(params, await GetWarehouse(GetByIdValue("sender-city"), GetByIdValue("sender-address"), "Sender"));
//         Object.assign(params, GetPageData());
//         Object.assign(params, BackwardDelivery());

//         params.CargoType = "Parcel";
//         params.ServiceType = "WarehouseWarehouse";

//         LoadTrackingInfo(await NewInternetDocument(params))
//     }
// });

// //Відслідкування посилки 
// async function Tracking(number) {
//     const trackingData = await GetResponseResult("TrackingDocument", "getStatusDocuments", {
//         Documents: [
//             {
//                 DocumentNumber: number
//             }
//         ]
//     });
//     console.log(trackingData)
//     return trackingData.data[0];
// }


// // LoadTrackingInfo("59000923175689")
// async function LoadTrackingInfo(number) {
//     const packageNumber = document.getElementById("package-number");
//     document.getElementById("tracking-info").classList.remove("d-none");
//     document.getElementById("accordion").classList.add("d-none");

//     number ? packageNumber.innerText = number : number = packageNumber.innerText;
//     tracking_data = await Tracking(number);

//     document.getElementById("package-status").innerText = tracking_data.Status;
//     document.getElementById("package-sent-date").innerText = tracking_data.DateCreated.split(' ')[0];
//     document.getElementById("package-received-date").innerText = tracking_data.RecipientDateTime.split(' ')[0] ? tracking_data.RecipientDateTime.split(' ')[0] : "Товар в дорозі";
// }


//bootstrap
$('#datepicker').datepicker({ language: 'uk', dateFormat: 'dd, mm, yy' }).datepicker().datepicker("setDate", 'now');

document.getElementById("TTN-link").addEventListener("click", (e) => {
    e.preventDefault();
    HideAll();
    document.getElementById("generator").classList.remove("d-none");

});

//59000923175689
document.getElementById("TTN-number-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    await LoadTrackingInfo();
});

async function LoadTrackingInfo(number = null) {
    HideAll();

    if (number === null) {
        number = document.getElementById("tracking-numebr").value;
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
    // console.log(sender)
    document.getElementById("sender-first-name").value = sender.FirstName;
    document.getElementById("sender-middle-name").value = sender.LastName;
    document.getElementById("sender-last-name").value = sender.MiddleName;
    document.getElementById("sender-phone").value = sender.Phones;
}

async function fdgg() {
}
fdgg()

document.addEventListener('DOMContentLoaded', async () => {
    LoadSender();
    await FillSelectByWarehouses("sender");
    await FillSelectByWarehouses("recipient");
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
    let warehouses = await GetWarehouses(document.getElementById(`${type}-city`).value);
    // console.log(warehouses)
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