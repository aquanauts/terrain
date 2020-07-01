describe('Client Library', function () {
    it('can handle error events', function () {
        const errorEvent = new ErrorEvent("Error event message", {
                error: new Error("Error name"),
                message: "Error message",
            }
        );

        const expectedPostBody = {
            errorEventMessage: "Error event message",
            errorName: "Error: Error name", //Usual format is Error: stuff
            errorMessage: "Error message" 
        };
        spyOn(window, 'postTerrainError');
        recordError(errorEvent);
        expect(postTerrainError).toHaveBeenCalledWith(expectedPostBody);
    });

    it('posts errors back to server', async () => {
        //spyOn($, 'post');
        
        spyOn(window, 'fetch');
        const postBody = {"someProperty": true};
        postTerrainError(postBody);

        /* expect($.post).toHaveBeenCalledWith({
            url: '/receive_error',
            data: JSON.stringify(postBody),
            contentType: 'application/json'
        }); */
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
