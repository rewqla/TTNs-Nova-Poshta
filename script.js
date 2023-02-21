const url = "https://api.novaposhta.ua/v2.0/json/";
const configKEY = "82553fd1d61bd7d87d24d3a51fa6c0c9";

// methodProperties: {
//     SenderWarehouseIndex: "101/102",
//     RecipientWarehouseIndex: "101/102",
//     PayerType: "Recipient", 
//     PaymentMethod: "NonCash", 
//     DateTime: "дд.мм.рррр", 
//     CargoType: "Cargo",  -
//     Weight: "0.5",  
//     ServiceType: "WarehouseWarehouse",
//     SeatsAmount: "2",  
//     Description: "Додатковий опис відправлення",  
//     Cost: "15000", 
//     CitySender: "00000000-0000-0000-0000-000000000000",  
//     Sender: "00000000-0000-0000-0000-000000000000",
//     SenderAddress: "00000000-0000-0000-0000-000000000000", 
//     ContactSender: "00000000-0000-0000-0000-000000000000", 
//     SendersPhone: "380660000000", 
//     CityRecipient: "00000000-0000-0000-0000-000000000000", 
//     Recipient: "00000000-0000-0000-0000-000000000000",
//     RecipientAddress: "00000000-0000-0000-0000-000000000000",
//     ContactRecipient: "00000000-0000-0000-0000-000000000000",
//     RecipientsPhone: "380660000000" 
// }


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


function GetAllAndRememberAll() {
 
}

async function GetSender() {
    //????
    let sender = await GetResponseResult("Counterparty", "getCounterparties", {
        CounterpartyProperty: "Sender",
        Page: "1"
    });
    console.log(sender);
}


async function getCityRef(cityName){
    //++++
    let city = await GetResponseResult("Address", "getCities", {
        FindByString: cityName,
    });
    console.log(cityName);
    console.log(city.data[0].Ref);

    return city.data[0].Ref;
}
// getCityRef("Київ");
// getCityRef("Рівне");

async function getWarehouseId(cityName){
    //++++
    let warehous = await GetResponseResult("Address", "getWarehouses", {
        CityName: cityName,
    });
    console.log(warehous);

    // return warehous.data[0].WarehouseIndex;
}
getWarehouseId("Рівне");
getWarehouseId("Хмельницький");
