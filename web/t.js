// TODO Can we run a linter on this without adding a bunch of silliness to our project
// Try to avoid jquery here!

// TODO Make these functions more unique, or scope them to a wrapper function
// to avoid collisions in host applications

window.__terrainSessionID = "replace with actual session id";
var sessionHistory = [];

window.addEventListener('load', function() { 
    if (sessionStorage.getItem('sessionID') == null){
        sessionStorage.setItem('sessionID', window.__terrainSessionID);
    }
    else {
        sessionHistory = sessionStorage.getItem('history').split(',');
    } 

    sessionHistory.push(window.location["href"]+"");
    sessionStorage.setItem('history', sessionHistory);
        
    const allScripts = document.querySelectorAll('script');
    terrainLibrarySource = findTerrainLibrarySource(allScripts); //global
    
});


function findTerrainLibrarySource(scriptNodeList){
    let librarySource;
    for(node in scriptNodeList){
        if (scriptNodeList[node]["src"].includes("/t.js")){
            librarySource = scriptNodeList[node]["src"].replace("/t.js",""); 
            break;
        };
    }
    return librarySource
};

window.addEventListener('hashchange', function() { 
    sessionHistory.push(window.location["href"]);
    sessionStorage.setItem('history', sessionHistory);
    // TODO when happens when sessionStorage is full?
});

async function postTerrainError(errorInfo) {

    const rawResponse = await fetch(terrainLibrarySource+'/receive_error', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(errorInfo)
    });

};


// https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
function extractBrowserInfoForTerrain(userAgent){
    let versionMatch;
    var browserMatch = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
    if(/trident/i.test(browserMatch[1])){
        versionMatch=/\brv[ :]+(\d+)/g.exec(userAgent) || []; 
        return {name:'IE',version:(versionMatch[1]||'')};
    }   
     if(browserMatch[1]==='Chrome'){
        versionMatch=userAgent.match(/\bOPR|Edge\/(\d+)/)
        if(versionMatch!=null)   {return {name:'Opera', version:versionMatch[1]};}
    }   
       
    browserMatch=browserMatch[2]? [browserMatch[1], browserMatch[2]]: [navigator.appName, navigator.appVersion, '-?'];
    
    if((versionMatch=userAgent.match(/version\/(\d+)/i))!=null) {browserMatch.splice(1,1,versionMatch[1]);}
        
    return {
            name: browserMatch[0],
            version: browserMatch[1]
    };
 };



function extractPlatformInfoForTerrain(userAgent){ //https://developers.whatismybrowser.com/api/docs/v2/integration-guide/;
    var match = userAgent.match(/[(][\s\S]*[windows|mac os|android|iphone os|macos|ubuntu|linux][\s\S]*[)]/i) || [];
    var platform = match[0].split(')')[0].substring(1,);
    return platform;
};



function recordTerrainError(errorEvent) {
    var today = new Date();
    var dateTime = today.getTime(); //store as integer timestamp, can display with Date constructor   
    
    var browserInfo = extractBrowserInfoForTerrain(window.navigator.userAgent);
    
    var translatedErrorEvent = {
        session: sessionStorage.getItem('sessionID').toString(),
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
        browser: browserInfo["name"], 
        browserVersion: browserInfo["version"],
        platform: extractPlatformInfoForTerrain(window.navigator.userAgent),
        cookiesEnabled: window.navigator.cookieEnabled,
        visibility: document.visibilityState,
        dateTime: dateTime,
        sessionHistory: sessionStorage.getItem('history') // comma separated list of strings
    };
    
    postTerrainError(translatedErrorEvent);
};

window.addEventListener('error', recordTerrainError);

