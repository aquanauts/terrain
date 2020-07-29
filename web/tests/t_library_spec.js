describe('Client Library', function () {   

    it('Extracts browser name and version from user agent string', async function () {
        const userAgentString = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36";
        var browserInfo = extractBrowserInfoForTerrain(userAgentString);
        expect(browserInfo["name"]).toEqual("Chrome");
        expect(browserInfo["version"]).toEqual("83");
    });
    
    it('Extracts platform information from user agent string', async function() {   
        const userAgentString = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36";
        var platformInfo = extractPlatformInfoForTerrain(userAgentString);
        expect(platformInfo).toEqual("Macintosh; Intel Mac OS X 10_15_4"); 
    });


    it('Can handle error events', function () {
        const errorEvent = new ErrorEvent("", {
                error: new Error("Error name"),
                message: "Error message",
            }
        );
        
        var browserInfo = extractBrowserInfoForTerrain(window.navigator.userAgent);
         
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
        const platform = extractPlatformInfoForTerrain(window.navigator.userAgent);
        const cookiesEnabled = window.navigator.cookieEnabled;
        const dateConstructor = new Date(2020, 1, 1);
        spyOn(window, 'Date').and.callFake(() => dateConstructor);
        
        spyOn(window, 'postTerrainError');
        
        const dateTime = dateConstructor.getTime(); //Must be called right before recordError (timestamp)
        recordTerrainError(errorEvent);
        
        const expectedPostBody = {
            session: sessionStorage.getItem("sessionID").toString(),
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
            dateTime: dateTime,
            sessionHistory: sessionStorage.getItem('history'),
            visibility: document.visibilityState
        };

        expect(postTerrainError).toHaveBeenCalledWith(expectedPostBody);
    });

    it('Posts errors back to server', async () => {    
        spyOn(window, 'fetch');
        const postBody = {"someProperty": true};
        postTerrainError(postBody);

        expect(fetch).toHaveBeenCalledWith(
            terrainLibrarySource + '/receive_error', {
             method: 'POST',
             headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                 },
             body: JSON.stringify(postBody)
             }
        );
    });

    it('Extracts URL of host from library source', async() => {
        const fakeNodeList = [{"src":"someFakeName/fakeLibrary.js"},{"src":"fakeLibrarySource/t.js"}]
        const fakeSource = findTerrainLibrarySource(fakeNodeList);       
        expect(fakeSource).toEqual('fakeLibrarySource');
    });
    
});
