describe('Client Library', function () {
    
    it('has integer sessionID', async function () {
        const receivedID = window.__terrainSessionID;
        expect(receivedID).toEqual(jasmine.any(Number));
    });



    it('can handle error events', function () {
        const errorEvent = new ErrorEvent("", {
                error: new Error("Error name"),
                message: "Error message",
            }
        );
        var browserInfo = extractBrowserInfo(window.navigator.userAgent);
         
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
        const browser = browserInfo["name"];
        const browserVersion =  browserInfo["version"];
        const platform = extractPlatformInfo(window.navigator.userAgent);
        const cookiesEnabled = window.navigator.cookieEnabled

        const expectedPostBody = {
            session: window.__terrainSessionID.toString(),
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
            browser: browser,
            browserVersion: browserVersion,
            platform: platform,
            cookiesEnabled: cookiesEnabled,
            sessionHistory: sessionStorage.getItem('history'),
            visibility: document.visibilityState
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
