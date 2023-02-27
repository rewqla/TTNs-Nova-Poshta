const url = "https://api.novaposhta.ua/v2.0/json/";
const configKEY = "82553fd1d61bd7d87d24d3a51fa6c0c9";

// methodProperties: {
//     SenderWarehouseIndex: "101/102", //getWarehouseCity +
//     RecipientWarehouseIndex: "101/102", //getWarehouseCity +
//     PayerType: "Recipient", /взяти з форми  +
//     PaymentMethod: "NonCash", //взяти з форми + 
//     DateTime: "дд.мм.рррр", // взяти з форми +
//     CargoType: "Parcel",  //тільки так
//     Weight: "0.5",  //взяти з форми +
//     ServiceType: "WarehouseWarehouse", //тільки так
//     SeatsAmount: "2", //взяти з форми + 
//     Description: "Додатковий опис відправлення",  // взяти з форми +
//     Cost: "15000", // взяти з форми +

//     CitySender: "00000000-0000-0000-0000-000000000000", //getWarehouseCity +
//     Sender: "00000000-0000-0000-0000-000000000000", //getContactPersons+
//     SenderAddress: "00000000-0000-0000-0000-000000000000", //getWarehouseCity +
//     ContactSender: "00000000-0000-0000-0000-000000000000", //getContactPersons +
//     SendersPhone: "380660000000", // getContactPersons +

//     CityRecipient: "00000000-0000-0000-0000-000000000000", //getWarehouseCity +
//     Recipient: "00000000-0000-0000-0000-000000000000", //createContactPersonRecipient +
//     RecipientAddress: "00000000-0000-0000-0000-000000000000",//getWarehouseCity +
//     ContactRecipient: "00000000-0000-0000-0000-000000000000", //createContactPersonRecipient +
//     RecipientsPhone: "380660000000" // createContactPersonRecipient +
// }

//4d5d01a7-b132-11ed-a60f-48df37b921db - отримувач ref контрагент
//4d3d25aa-b132-11ed-a60f-48df37b921db - відправник ref контрагент
//"208a60fa-45fc-48ef-98e5-53f0819ebf4f" - контрагент 

//Метод для запитів
async function GetResponseResult(model, method, properties) {
    const requestBody = {
        apiKey: configKEY,
        modelName: model,
        calledMethod: method,
        methodProperties: properties
    };

    // console.log(requestBody);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            apiKey: configKEY,
            modelName: model,
            calledMethod: method,
            methodProperties: properties
        }),
    });

    // console.log(await response);

    return await response.json();
}

//Створення ттн 
async function newInternetDocument(params) {
    console.log(params)
    let internetDocument = await GetResponseResult("InternetDocument", "save", params);
    console.log(internetDocument);
}

//Створення отримувача
async function createContactPersonRecipient(firstName, middleName, lastName, phone) {
    // ++++
    let recipient = await GetResponseResult("Counterparty", "save", {
        FirstName: firstName,
        MiddleName: middleName,
        LastName: lastName,
        Phone: phone,
        CounterpartyType: "PrivatePerson",
        CounterpartyProperty: "Recipient"
    });
    //console.log(recipient);

    return {
        "Recipient": recipient.data[0].Ref,
        "ContactRecipient": recipient.data[0].ContactPerson.data[0].Ref,
        "RecipientsPhone": phone
    }
}

//Отримання WarehouseId, city ref, warehouse ref
async function getWarehouseCity(cityName, address, type) {
    //++++
    let warehous = await GetResponseResult("Address", "getWarehouses", {
        CityName: cityName,
    });
    //console.log(warehous);

    for (let i = 0; i < warehous.data.length; i++) {
        if (warehous.data[i].Description == address) {
            //console.log(warehous.data[i]);

            return {
                [type + "WarehouseIndex"]: warehous.data[i].WarehouseIndex,
                [type + "Address"]: warehous.data[i].Ref,
                ["City" + type]: warehous.data[i].CityRef
            };
        }
    }
}


//Отримання контрагента
async function getCounterpartyRef(type) {
    //++++
    let counterparty = await GetResponseResult("Counterparty", "getCounterparties", {
        CounterpartyProperty: type,
        Page: 1
    });
    // console.log(counterparty);

    return counterparty.data[0].Ref;
}

//Отримання даних контактних осіб контрагента 
async function getContactPersons(ref, type) {
    //++++
    let contacts = await GetResponseResult("Counterparty", "getCounterpartyContactPersons", {
        Ref: ref,
    });
    // console.log(contacts);

    return {
        [type]: ref,
        ["Contact" + type]: contacts.data[0].Ref,
        [type + "sPhone"]: contacts.data[0].Phones
    }
}

function GetPageData() {
    return {
        PayerType: getByIdValue("payerType"),
        PaymentMethod: getByIdValue("paymentMethod"),
        DateTime: getByIdValue("dateTime"),
        Weight: getByIdValue("weight"),
        SeatsAmount: getByIdValue("seatsAmount"),
        Cost: getByIdValue("cost"),
        Description: getByIdValue("description")
    };
}

let novaPoshtaForm = document.getElementById("novaPoshtaForm");
novaPoshtaForm.addEventListener("submit", async function (e) {
    let params = await createContactPersonRecipient(getByIdValue("recipientName"), getByIdValue("recipientMiddleName"), getByIdValue("recipientLastName"), getByIdValue("recipientPhone"));;
    Object.assign(params, await getWarehouseCity(getByIdValue("recipientCity"), getByIdValue("recipientAddress"), "Recipient"));
    Object.assign(params, await getContactPersons(await getCounterpartyRef("Sender"), "Sender"));
    Object.assign(params, await getWarehouseCity(getByIdValue("senderCity"), getByIdValue("senderAddress"), "Sender"));
    Object.assign(params, await GetPageData());

    params.CargoType = "Parcel";
    params.ServiceType = "WarehouseWarehouse";

    newInternetDocument(params);
});

function printInternetDocument(){
    
}
function getByIdValue(Id) {
    return document.getElementById(Id).value;
}


//bootstrap
$('#datepicker').datepicker({ language: 'uk' }).datepicker("setDate", 'now');;


