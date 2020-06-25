window.addEventListener('load', function() {  
    console.log("Terrain is active!");
});

function postTerrainError(errorInfo) {
    // TODO Do we really need jquery here
    $.post({
        url: '/error',
        data: JSON.stringify(errorInfo),
        contentType: 'application/json'
    } );
}

function recordError(errorEvent) {
    console.log("An error was found!");
    console.log(arguments);

    //var windowHistory = [];

    //for (let i = 1; i <= window.history.length; ++i) {
    //    url = window.history.go(-1*i).location["href"];    
    //    windowHistory.push(url);
    //};
    
    var environmentInfo = { 
        url: window.location["href"],
        host: window.location["host"],
        //history: windowHistory
    };
    
    //console.log(errorInfo);
    console.log(environmentInfo);
    postTerrainError(errorEvent);
};

window.addEventListener('error', recordError);
