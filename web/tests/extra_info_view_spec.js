import extraInfoView from '/js/views/extraInfo.js';

describe('Extra Info View', () => {
    let errorInfoDeferred, view;
    beforeEach(() => {
        errorInfoDeferred = $.Deferred();
        spyOn($, 'get').and.returnValue(errorInfoDeferred);
        view = extraInfoView(1);
    });

    it('fetches the error info from the server', async () => {
        expect($.get).toHaveBeenCalledWith("/get_error?id=1")
    });

    it('renders the error info in a table', async () => {
        let errorInfo = {"session":"4", "errorEventMessage":"Uncaught TypeError"};
        errorInfoDeferred.resolve(errorInfo)
        expect(view.find('tr:nth-child(1) td:first').text()).toEqual("Session");
        expect(view.find('tr:nth-child(1) td:last').text()).toEqual("4");
    });
});
