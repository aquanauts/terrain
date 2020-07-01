window.addEventListener('load', function() {  
    console.log("Terrain is active!");
    currentURL = window.location["href"];
});

windowHistory = [];

function appendToHistory(currentURL) {
    windowHistory.push(currentURL);
};

async function postTerrainError(errorInfo) {
    //jQuery alternative 1: with XMLHttpRequest:

    /*postRequestObject = new XMLHttpRequest();
    postRequestObject.open("POST", '/receive_error', true);
    postRequestObject.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    postRequestObject.send(JSON.stringify(errorInfo));
    
    const rawResponse = await postRequestObject.response;
    const response = await rawResponse.json();
    console.log(response);
    */

    //jQuery alternative 2: with fetch

    const rawResponse = await fetch('/receive_error', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(errorInfo)
    });
//    const response = await rawResponse.json(); //TODO https://stackoverflow.com/questions/59728992/fetch-api-can-await-res-json-fail-after-a-completed-request
    console.log(rawResponse);      
//    console.log(response);

};

function recordError(errorEvent) {
    console.log("An error was found!");
    console.log(arguments);
    
    var environmentInfo = { 
        url: window.location["href"],
        host: window.location["host"],
        history: windowHistory
    };

    translatedErrorEvent = {
        errorEventMessage: errorEvent.type,
        errorName: errorEvent.error.toString(),
        errorMessage: errorEvent.message
        //environmentInfo: environmentInfo
    };
    

    console.log(environmentInfo);
    postTerrainError(translatedErrorEvent);
};

window.addEventListener('error', recordError);
window.addEventListener('popstate', appendToHistory()); //TODO find a more accurate event
