const url = "https://api.novaposhta.ua/v2.0/json/";
const configKEY = "8927155094ab3dbc66bcc1dfee991a94";

// DocumentNumber: "59000923176535",
// DocumentNumber: "59000923177130",
// DocumentNumber: "59000923175689",
// DocumentNumber: "59000923176082",
//Phone: "0676733781"

let requestBody = {
    apiKey: configKEY,
    modelName: "TrackingDocument",
    calledMethod: "getStatusDocuments",
    methodProperties: {
        Documents: []
    }
};

async function GetResponseResult() {
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    return await response.json();
}

function FillDocumnetsFromPage() {
    requestBody.methodProperties.Documents = [];
    requestBody.methodProperties.Documents.push(GetPageData());
}

async function FillDocumnetsWithFinalData(){
    requestBody.methodProperties.Documents[0].Phone=await GetRecipientPhone();
}

function GetPageData() {   

    return {
        DocumentNumber: document.getElementById("Number").value,
        Phone: document.getElementById("Phone").value   
    }
}

async function GetRecipientPhone() {
    return (await GetResponseResult()).data[0].PhoneRecipient;
}



async function FillDocumnets(){
    FillDocumnetsFromPage();
    await FillDocumnetsWithFinalData();
}

async function LoadTTNData() {
    await FillDocumnets();
    return (await GetResponseResult()).data[0];
}

function CreateTTNs() {
    console.log(1);
    let data = LoadTTNData();
    data.then((a) => {
        console.log(a);
        console.log("number of send " + a.Number);
        console.log("creation date " + a.DateCreated);
        console.log("estimated date of arrival of the cargo " + a.ScheduledDeliveryDate);
        console.log("city sender " + a.CitySender);
        console.log("address of the department sender " + a.WarehouseSenderAddress);
        console.log("?phone of sender " + a.PhoneSender);
        console.log("?name of sender " + a.SenderFullNameEW);
        console.log("?description of sender " + a.CounterpartySenderDescription);
        console.log("city recipient " + a.CityRecipient);
        console.log("physical person " + a.CounterpartyType);
        console.log("address of the department sender " + a.WarehouseRecipientAddress);
        console.log("phone of recipient " + a.PhoneRecipient);
        console.log("name of recipient " + a.RecipientFullName);
        console.log("Number of places " + a.SeatsAmount);
        console.log("Cargo weight " + a.DocumentWeight);
        console.log("Type of cargo " + a.CargoType);
        console.log("who pays for the cargo " + a.PayerType);
        console.log("Price of delivery " + a.DocumentCost);
        console.log("Payment Method " + a.PaymentMethod);
        console.log("Storage " + a.VolumeWeight);
        console.log("Description " + a.CargoDescriptionString);
        console.log("Near price " + a.AnnouncedPrice);
    });
}

let t1="0674325675";
let t2="+380674325675";
let t3="0124325675";
let t4="380674325675";
let t5="59009231f76082";

//0674325675 - correct
// let regexPhone=new RegExp("^0[0-9]{9}$");

//+380674325675 - correct
// let regexPhone=new RegExp("^[+]38(0[0-9]{9})$");

//+380674325675 and 0674325675 - correct when +0674325675 - correct too
// let regexPhone=new RegExp("[+]?^3?8?(0[0-9]{9})$");

// final version
// let regexPhone=new RegExp("^([+]?(38))?(0[0-9]{9})$");

//final version 
//let regexNumber=new RegExp("^[0-9]{14}$");


// if(regexNumber.test(t5)){
//     console.log("correct")
// }
// else{
//     console.log("wrong")
// }
