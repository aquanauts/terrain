import logView from '/js/views/log.js';

describe('Log View', () => {
    
    let errorInfoDeferred, view;   

    beforeEach(() => {
        errorInfoDeferred = $.Deferred();
        spyOn($, 'get').and.returnValue(errorInfoDeferred);
        view = logView(1);
    });

    it('Has a friendly greeting', async () => {
        const view = logView();
        expect(view.find('p').text()).toContain("Welcome to Terrain!");
    });


    it('Retrieves all the error info from the server', async () => {
        expect($.get).toHaveBeenCalledWith("/show_errors")
    });
    
    it('Shows headings specified in the view', async () => {
        errorInfoDeferred.resolve('{} \n');
        const firstHeading = view.find('tr:first th:first');
        const lastHeading = view.find('tr:first th:last');
        expect(firstHeading.find('.th-inner').text()).toEqual("No.");
        expect(lastHeading.find('.th-inner').text()).toEqual("URL");
    });

    it('Renders the error info in a table', async () => {
        let errorInfo = '{"session": "4","errorEventMessage": "Uncaught TypeError"}\n'; 
        errorInfoDeferred.resolve(errorInfo);
        const firstValue = view.find('tbody').find('tr:nth-child(1) td:nth-child(2)');
        const lastValue = view.find('tbody').find('tr:nth-child(1) td:nth-child(3)');
        expect(firstValue.text()).toEqual("4");
        expect(lastValue.text()).toEqual("Uncaught TypeError");
    });

    it('Has a search bar', async () => {
        errorInfoDeferred.resolve('{} \n');
        const searchBar = view.find('input');
        expect(searchBar.prop('placeholder')).toEqual("Search");
    });

});
