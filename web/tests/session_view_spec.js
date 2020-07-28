
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
        let errorInfo = [{"session": "47", "errorEventMessage":"Some error", "sessionHistory":"url1\n\nurl2\n\n"}, {"session":"47", "errorEventMessage":"Another error", "sessionHistory":"url1,url2,url3"}];
        errorInfoDeferred.resolve(errorInfo);
        expect(view.find('tr:nth-child(1) th:nth-child(1)').text()).toEqual("No.");
        expect(view.find('tr:nth-child(3)  td:nth-child(2)').text()).toEqual("url3");
    });
    
    it('Links log number to log view', async() => {
        let errorInfo = [{"id":"227", "sessionHistory":"url1,url2", "errorName":"Name"}];
        errorInfoDeferred.resolve(errorInfo);
        const aLink = view.find('a:last');
        expect(aLink.text()).toEqual("227");
        expect(aLink.prop("href")).toContain("#extraInfo-227");
    });
    
    it('Links URL to URL', async() => { 
        let errorInfo = [{"sessionHistory":"url1", "id":"100", "errorName":"Name"}];
        errorInfoDeferred.resolve(errorInfo);
        const aLink = view.find('a:first');
        expect(aLink.text()).toEqual("url1");
        expect(aLink.prop("href")).toContain("url1");
    });

    it('Displays multiple errors occurring at the same point in history', async() => {
        let errorInfo = [{"sessionID":"1", "sessionHistory":"url1", "id":"100", "errorStack":"Name0", "dateTime":"0"}, {"sessionID":"1", "sessionHistory":"url1", "id":"101", "errorStack":"Name1", "dateTime":"1"}];
        errorInfoDeferred.resolve(errorInfo);
        const firstRow = view.find('tbody').find('tr:first');
        const lastRow = view.find('tbody').find('tr:last');
        console.log(firstRow.find('td:first').text())
        console.log(lastRow.find('td:first').text())
        expect(firstRow.find('td:nth-child(1)').text()).toEqual('0');
        expect(firstRow.find('td:nth-child(2)').text()).toEqual('url1');
        expect(firstRow.find('td:nth-child(3)').text()).toEqual('Name0');
        expect(firstRow.find('td:nth-child(4)').text()).toEqual('100');
        expect(firstRow.find('td:nth-child(5)').text()).toEqual(new Date('0').toString());
        expect(lastRow.find('td:nth-child(1)').text()).toEqual('Name1');
        expect(lastRow.find('td:nth-child(2)').text()).toEqual('101');
        expect(lastRow.find('td:nth-child(3)').text()).toEqual(new Date('1').toString());
    
    });

});
