const config = {
    NP_KEY: "8927155094ab3dbc66bcc1dfee991a94"
}

//tracking
const requestBody = {
    apiKey: config.NP_KEY,
    modelName: "TrackingDocument",
    calledMethod: "getStatusDocuments",
    methodProperties: {
        Documents: [
            { 
                DocumentNumber:"59000923176082",
                Phone:"0676733781"
            }          
        ]},
        
        // Documents: ["59000923176535"],
        // Documents: ["59000923177130"],
        // Documents: ["59000923175689"],
        // Documents: ["59000923176082"],
    };


async function StartWork() {
    let url = "https://api.novaposhta.ua/v2.0/json/";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    let result = await response.json();

    return result.data[0];
}

function MakeTTNs() {
    let data = StartWork();
    data.then((a) => {
        console.log(a);
        console.log("number of send " + a.Number);
        console.log("creation date " + a.DateCreated);
        console.log("estimated date of arrival of the cargo " + a.ScheduledDeliveryDate);
        console.log("city sender " + a.CitySender);
        console.log("address of the department sender " + a.WarehouseSenderAddress);
        console.log("?phone of sender "+a.PhoneSender);
        console.log("?name of sender "+a.SenderFullNameEW);
        console.log("?description of sender "+a.CounterpartySenderDescription);
        console.log("city recipient " + a.CityRecipient);
        console.log("physical person " + a.CounterpartyType);
        console.log("address of the department sender " + a.WarehouseRecipientAddress);
        console.log("phone of recipient "+a.PhoneRecipient);
        console.log("name of recipient "+a.RecipientFullName);
        console.log("Number of places " + a.SeatsAmount);
        console.log("Cargo weight " + a.DocumentWeight);
        console.log("Type of cargo " + a.CargoType);
        console.log("who pays for the cargo " + a.PayerType);
        console.log("Price of delivery " + a.DocumentCost);
        console.log("Payment Method " + a.PaymentMethod);
        console.log("Storage " + a.VolumeWeight);
        console.log("Description "+a.CargoDescriptionString);
        console.log("Near price " + a.AnnouncedPrice);
    });
}
MakeTTNs();

