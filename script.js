const config = {
    NP_KEY: "8927155094ab3dbc66bcc1dfee991a94"
}

const requestBody = {
    apiKey: config.NP_KEY,
    modelName: "Common",
    calledMethod: "getCargoTypes",
    methodProperties: {

    },
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

    let data = await response.json();
    console.log(data);
}

StartWork();

