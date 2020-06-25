describe('Client Library', function () {
    it('can handle error events', function () {
        const errorEvent = {message:"This is an error"};
        spyOn(window, 'postTerrainError');
        recordError(errorEvent);
        expect(postTerrainError).toHaveBeenCalledWith(errorEvent);
    });
});
