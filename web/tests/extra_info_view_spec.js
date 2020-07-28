import extraInfoView from '/js/views/extraInfo.js';

describe('Extra Info View', () => {
    let errorInfoDeferred, view;
    beforeEach(() => {
        errorInfoDeferred = $.Deferred();
        spyOn($, 'get').and.returnValue(errorInfoDeferred);
        view = extraInfoView(1);
    });

    it('Fetches the error info from the server', async () => {
        expect($.get).toHaveBeenCalledWith("/get_error?id=1")
    });

    it('Renders the error info in a table', async () => {
        let errorInfo = {"session":"4", "errorEventMessage":"Uncaught TypeError"};
        errorInfoDeferred.resolve(errorInfo)
        expect(view.find('tr:nth-child(1) td:first').text()).toEqual("Session");
        expect(view.find('tr:nth-child(1) td:last').text()).toEqual("4");
    });

    it('Links session number to session view', async() => {
        let errorInfo = {"session":"227", "errorName":"Name"};
        errorInfoDeferred.resolve(errorInfo);
        const aLink = view.find('a');
        expect(aLink.text()).toEqual("227");
        expect(aLink.prop("href")).toContain("#sessionID-227");
    });
    
    it('Links URL to URL', async() => { 
        let errorInfo = {"url":"google.com", "errorName":"Name"};
        errorInfoDeferred.resolve(errorInfo);
        const aLink = view.find('a');
        expect(aLink.text()).toEqual("google.com");
        expect(aLink.prop("href")).toContain("google.com");
    });

    it('Displays error name, message, event message, and stack in fixed-width font', async() => {
        let errorInfo = {"errorName":"Name", "errorEventMessage":"EventMessage", "errorMessage":"Message", "errorStack":"Stack"}
        errorInfoDeferred.resolve(errorInfo);
        expect(view.find('pre:first').find('code').find('p').text()).toEqual("Name");
        expect(view.find('pre:last').text()).toEqual("Stack");
    });
});
