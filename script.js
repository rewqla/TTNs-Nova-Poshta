const url = "https://api.novaposhta.ua/v2.0/json/";
const configKEY = "8927155094ab3dbc66bcc1dfee991a94";
let validResponse = true;
let recipientPhoneAvailable = true;
// DocumentNumber: "59000923176535",
// DocumentNumber: "59000923177130",
// DocumentNumber: "59000923175689",
// DocumentNumber: "59000923176082",
// DocumentNumber: "20400048729901",
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

    // console.log(await response);

    return await response.json();
}

function CheckResponse(response) {
    // console.log(response);
    if (response.errors.length == 0) {
        if (response.data[0].PhoneRecipient == "" && response.data[0].PhoneSender == "") {
            showError(senderPhone, `Not valid phone number`)
            validResponse = false;
        }
        else {
            validResponse = true;
        }
    }
    else {
        showError(documentNumber, `Document number is not correct`)
        validResponse = false;
    }
}

function FillDocumnetsFromPage() {
    requestBody.methodProperties.Documents = [];
    requestBody.methodProperties.Documents.push(GetPageData());
}

async function FillDocumnetsWithFinalData() {
    let result = await GetResponseResult();
    CheckResponse(result);
    if (validResponse) {
        if (result.data[0].PhoneSender == "")
            requestBody.methodProperties.Documents[0].Phone = await GetRecipientPhone();
    }
}

function GetPageData() {
    return {
        DocumentNumber: document.getElementById("documentNumber").value,
        Phone: document.getElementById("senderPhone").value
    }
}

async function GetRecipientPhone() {
    let response = await GetResponseResult();
    CheckResponse(response);
    if (validResponse) {
        return response.data[0].PhoneRecipient;
    }
}



async function FillDocumnets() {
    FillDocumnetsFromPage();
    await FillDocumnetsWithFinalData();
}

async function LoadTTNData() {
    await FillDocumnets();
    if (validResponse) {
        return (await GetResponseResult()).data[0];
    }
}

async function CreateTTNs() {
    // let data2 = await GetResponseResultTest();
    // let data = data2.data[0];

    let data = await LoadTTNData();
    // console.log(data);
    console.log("-------------------------------------------")
    if (validResponse) {
        data.PhoneRecipient=requestBody.methodProperties.Documents[0].Phone;
        console.log("number of send " + data.Number);
        console.log("creation date " + data.DateCreated);
        console.log("estimated date of arrival of the cargo " + data.ScheduledDeliveryDate);
        console.log("city sender " + data.CitySender);
        console.log("address of the department sender " + data.WarehouseSenderAddress);
        console.log("phone of sender " + data.PhoneSender);
        console.log("name of sender " + data.SenderFullNameEW);
        console.log("description of sender " + data.CounterpartySenderDescription);
        console.log("city recipient " + data.CityRecipient);
        console.log("physical person " + data.CounterpartyType);
        console.log("address of the department sender " + data.WarehouseRecipientAddress);
        console.log("phone of recipient " + data.PhoneRecipient);
        console.log("name of recipient " + data.RecipientFullName);
        console.log("Number of places " + data.SeatsAmount);
        console.log("Cargo weight " + data.DocumentWeight);
        console.log("Type of cargo " + data.CargoType);
        console.log("who pays for the cargo " + data.PayerType);
        console.log("Price of delivery " + data.DocumentCost);
        console.log("Payment Method " + data.PaymentMethod);
        console.log("Storage " + data.VolumeWeight);
        console.log("Description " + data.CargoDescriptionString);
        console.log("Near price " + data.AnnouncedPrice);
    }
}

const documentNumber = document.querySelector('#documentNumber');
const senderPhone = document.querySelector('#senderPhone');

const isRequired = value => value === '' ? false : true;

const form = document.querySelector('#trackingForm');


const checkDocumentNumber = () => {
    let valid = false;

    let regexNumber = new RegExp("^[0-9]{14}$");

    const number = documentNumber.value.trim();

    if (!isRequired(number)) {
        showError(documentNumber, 'TTN number cannot be blank.');
    } else if (!regexNumber.test(number)) {
        showError(documentNumber, `TTN number must have 14 digits and contain only numbers`)
    } else {
        showSuccess(documentNumber);
        valid = true;
    }
    return valid;
};


const checkPhoneNum = () => {
    let valid = false;

    let regexPhone = new RegExp("^([+]?(38))?(0[0-9]{9})$");

    const phone = senderPhone.value.trim();

    if (!isRequired(phone)) {
        showError(senderPhone, 'Phone number cannot be blank.');
    } else if (!regexPhone.test(phone)) {
        showError(senderPhone, `Wrong format of phone number`)
    } else {
        showSuccess(senderPhone);
        valid = true;
    }
    return valid;
};

const showError = (input, message) => {
    const formField = input.parentElement;

    formField.classList.remove('success');
    formField.classList.add('error');

    const error = formField.querySelector('small');
    error.textContent = message;
};

const showSuccess = (input) => {
    const formField = input.parentElement;

    formField.classList.remove('error');
    formField.classList.add('success');

    const error = formField.querySelector('small');
    error.textContent = '';
}



form.addEventListener('submit', function (e) {
    e.preventDefault();

    let isDocumentNumberValid = checkDocumentNumber(),
        isPhoneNumberValid = checkPhoneNum();

    let isFormValid = isDocumentNumberValid &&
        isPhoneNumberValid;

    if (isFormValid) {
        CreateTTNs();
    }
});


const debounce = (fn, delay = 500) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn.apply(null, args)
        }, delay);
    };
};

form.addEventListener('input', debounce(function (e) {
    switch (e.target.id) {
        case 'documentNumber':
            checkDocumentNumber();
            break;
        case 'senderPhone':
            checkPhoneNum();
            break;
    }
}));


//----------------------------------
// test section

const url2 = "https://api.novaposhta.ua/v2.0/json/";
const configKEY2 = "8927155094ab3dbc66bcc1dfee991a94";

let requestBodyTest = {
    apiKey: configKEY2,
    modelName: "TrackingDocument",
    calledMethod: "getStatusDocuments",
    methodProperties: {
        //all good
        // Documents: [{
        //     DocumentNumber: "59000923176082",
        ////sender
        //     Phone: "0676733781"
        // }]
        Documents: [{
            DocumentNumber: "59000923176535",
            //recipient
            // Phone: "0974550376"
            Phone: "0676733781"

        }]
        //AnnouncedPrice

        //no phone number
        // Documents: [{
        //     DocumentNumber: "59000923176082",
        //     Phone: ""
        // }]

        //Document number is not correct        
        // Documents: [204000487299001]
    }
};

async function GetResponseResultTest() {
    let response2 = await fetch(url2, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBodyTest),
    });

    console.log(await response2);

    return await response2.json();

}

const documentNumber2 = document.querySelector('#documentNumber');
const senderPhone2 = document.querySelector('#senderPhone');

async function lr() {
    let mm = await GetResponseResultTest();
    console.log(mm);
    if (mm.errors.length == 0) {
        if (mm.data[0].PhoneRecipient == "" && mm.data[0].PhoneSende == "") {
            showError(senderPhone2, `Not valid phone number`)
        }
        else {
            console.log("You entered good number")
        }
    }
    else {
        showError(documentNumber2, `Document number is not correct`)
    }
}

// lr();
