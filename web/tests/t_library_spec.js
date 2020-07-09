describe('Client Library', function () {
    
    it('can set and update sessionID', function () {
        if(localStorage.getItem("testID") != null){
            localStorage.removeItem("testID");
        }
        const testID1 = generateSessionID("testID");
        const testID2 = generateSessionID("testID");
        expect(testID1).toBe('1');
        expect(testID2).toBe('2');

        localStorage.removeItem("testID");

    });



    it('can handle error events', function () { // TODO update with new info
        const errorEvent = new ErrorEvent("", {
                error: new Error("Error name"),
                message: "Error message",
            }
        );
        var browserInfo = extractBrowserInfo(window.navigator.userAgent);
         
        //session: localStorage.getItem("sessionID"),
        //errorEventMessage: errorEvent.message.split(': ')[0],
        //errorName: errorEvent.error.toString().split(': ')[0],
        //errorMessage: errorEvent.error.toString().split(': ')[1],
        const errorStack = errorEvent.error.stack;
        const url =  window.location["href"];
        const host =  window.location["host"];
        const jsHeapSizeLimit = window.performance.memory.jsHeapSizeLimit;
        const totalJSHeapSize = window.performance.memory.totalJSHeapSize;
        const usedJSHeapSize = window.performance.memory.usedJSHeapSize;
        const networkType = window.navigator.connection.effectiveType;
        const rtDelayTime =  window.navigator.connection.rtt;
        const bandwidthMbps =  window.navigator.connection.downlink; // Browser compatibility questionable
        const logicalProcessors =  window.navigator.hardwareConcurrency;
        const browser = browserInfo["name"]; // TODO use regex to get specific OS/browserinfo
        const browserVersion =  browserInfo["version"];
        const platform = extractPlatformInfo(window.navigator.userAgent);
        const cookiesEnabled = window.navigator.cookieEnabled

        const expectedPostBody = {
            session: localStorage.getItem("sessionID"),
            errorEventMessage: "Error message",
            errorName: "Error",
            errorMessage: "Error name",
            errorStack: errorStack,
            url: url,
            host: host,
            jsHeapSizeLimit: jsHeapSizeLimit,
            totalJSHeapSize: totalJSHeapSize,
            usedJSHeapSize: usedJSHeapSize,
            networkType: networkType,
            rtDelayTime: rtDelayTime,
            bandwidthMbps: bandwidthMbps, // Browser compatibility questionable
            logicalProcessors: logicalProcessors,
            browser: browser, // TODO use regex to get specific OS/browserinfo
            browserVersion: browserVersion,
            platform: platform,
            cookiesEnabled: cookiesEnabled
        };
        spyOn(window, 'postTerrainError');
        recordError(errorEvent);
        expect(postTerrainError).toHaveBeenCalledWith(expectedPostBody);
    });

    it('posts errors back to server', async () => {
        
        spyOn(window, 'fetch');
        const postBody = {"someProperty": true};
        postTerrainError(postBody);

        expect(fetch).toHaveBeenCalledWith(
            '/receive_error', {
             method: 'POST',
             headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                 },
             body: JSON.stringify(postBody)
             }
        );
    });

    
});
