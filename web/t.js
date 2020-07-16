// Try to avoid jquery here!

window.__terrainSessionID = "replace with actual session id";
let hashHistory = [];

window.addEventListener('load', function() {
    id = window.__terrainSessionID; 
    hashHistory.push(window.location["href"]);
    console.log("Terrain is active! sessionID = ", id);

});

window.addEventListener('hashchange', function() { //TODO test, how to record other URL changes
    hashHistory.push(window.location["href"]);
    console.log("History now reflects: ", hashHistory);
});

async function postTerrainError(errorInfo) {

    const rawResponse = await fetch('/receive_error', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(errorInfo)
    });

};


// https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
function extractBrowserInfo(userAgent){  // TODO How would one test this?

    var ua = userAgent,tem;
    var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
        return {name:'IE',version:(tem[1]||'')};
    }   
     if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR|Edge\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
    }   
       
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
        
    return {
            name: M[0],
            version: M[1]
    };
 };

function extractPlatformInfo(userAgent){ // TODO https://developers.whatismybrowser.com/api/docs/v2/integration-guide/ How would one test this?

    var ua = userAgent
    var m = ua.match(/[(][\s\S]*[windows|mac os|android|iphone os|macos|ubuntu|linux][\s\S]*[)]/i) || [];
    var platform = m[0].split(')')[0].substring(1,);
    return platform;
};

        
function recordError(errorEvent) {
    console.log("An error was found!");
    console.log(arguments);
    console.log("Session: " + window.__terrainSessionID);
    
    var browserInfo = extractBrowserInfo(window.navigator.userAgent);
    
    var translatedErrorEvent = {
        session: window.__terrainSessionID.toString(),
        errorEventMessage: errorEvent.message.split(': ')[0],
        errorName: errorEvent.error.toString().split(': ')[0],
        errorMessage: errorEvent.error.toString().split(': ')[1],
        errorStack: errorEvent.error.stack,
        url: window.location["href"],
        host: window.location["host"],
        jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit,
        totalJSHeapSize: window.performance.memory.totalJSHeapSize,
        usedJSHeapSize: window.performance.memory.usedJSHeapSize,
        networkType: window.navigator.connection.effectiveType,
        rtDelayTime: window.navigator.connection.rtt,
        bandwidthMbps: window.navigator.connection.downlink, // Browser compatibility questionable
        logicalProcessors: window.navigator.hardwareConcurrency,
        browser: browserInfo["name"], // TODO use regex better to get specific OS/browserinfo
        browserVersion: browserInfo["version"],
        platform: extractPlatformInfo(window.navigator.userAgent),
        cookiesEnabled: window.navigator.cookieEnabled,
        hashHistory: hashHistory
    };
    

    console.log(translatedErrorEvent);
    postTerrainError(translatedErrorEvent);
};

window.addEventListener('error', recordError);

