
import sessionInfoView from '/js/views/sessionInfo.js';

describe('Session Info View', () => {
    
    let errorInfoDeferred, view;   

    beforeEach(() => {
        errorInfoDeferred = $.Deferred();
        spyOn($, 'get').and.returnValue(errorInfoDeferred);
        view = sessionInfoView(47);
    });

    it('retrieves session specific error info from the server', async () => {
        expect($.get).toHaveBeenCalledWith("/get_session?sessionID=47")
    });

    it('renders the error info in a table', async () => {
        let errorInfo = [{"session": "47", "errorEventMessage":"Some error"}, {"session":"47", "errorEventMessage":"Another error"}];
        errorInfoDeferred.resolve(errorInfo);
        expect(view.find('tr:nth-child(1) th:nth-child(1)').text()).toEqual("No.");
        expect(view.find('tr:nth-child(2)  td:nth-child(2)').text()).toEqual("Some error");
    });
});
