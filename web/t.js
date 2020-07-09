// Try to avoid jquery here!
// localStorage.removeItem("sessionID");

// window.__terrainSesssionId = "replace with actual session id";

window.addEventListener('load', function() {
    id = generateSessionID("sessionID");
    console.log("Terrain is active! sessionID = ", id);

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

function generateSessionID(idName){ // TODO get sessionID from server

    if(localStorage.getItem(idName) != null){
        var id = localStorage.getItem(idName);
        localStorage.setItem(idName, Number(id)+1);
    }
    else{
        localStorage.setItem(idName, 1);
    }
    id = localStorage.getItem(idName);
    return id;
};


// https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
function extractBrowserInfo(userAgent){  

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

function extractPlatformInfo(userAgent){ // TODO https://developers.whatismybrowser.com/api/docs/v2/integration-guide/

    var ua = userAgent
    var m = ua.match(/[(][\s\S]*[windows|mac os|android|iphone os|macos|ubuntu|linux][\s\S]*[)]/i) || [];
    var platform = m[0].split(')')[0].substring(1,);
    return platform;
};

        
function recordError(errorEvent) {
    console.log("An error was found!");
    console.log(arguments);
    console.log("Session: " + localStorage.getItem("sessionID"));
    
    var browserInfo = extractBrowserInfo(window.navigator.userAgent);
    var translatedErrorEvent = {
        session: localStorage.getItem("sessionID"),
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
        browser: browserInfo["name"], // TODO use regex to get specific OS/browserinfo
        browserVersion: browserInfo["version"],
        platform: extractPlatformInfo(window.navigator.userAgent),
        cookiesEnabled: window.navigator.cookieEnabled

    };
    

    console.log(translatedErrorEvent);
    postTerrainError(translatedErrorEvent);
};

window.addEventListener('error', recordError);

