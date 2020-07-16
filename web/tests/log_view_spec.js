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
        expect(view.find('p').text()).toEqual("Hello World!");
    });


    it('retrieves all the error info from the server', async () => {
        expect($.get).toHaveBeenCalledWith("/show_errors")
    });
    
    it('shows headings specified in the view', async () => {
        errorInfoDeferred.resolve('{} \n');
        expect(view.find('tr:first th:first').text()).toEqual("No.");
        expect(view.find('tr:first th:last').text()).toEqual("URL");
    });

    it('renders the error info in a table', async () => {
        let errorInfo = '{"session": "4","errorEventMessage": "Uncaught TypeError"}\n'; 
        errorInfoDeferred.resolve(errorInfo);
        expect(view.find('tr:nth-child(2) td:nth-child(2)').text()).toEqual("4");
        expect(view.find('tr:nth-child(2) td:nth-child(3)').text()).toEqual("Uncaught TypeError");
    });
});
