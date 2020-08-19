import pagerDutyView from '/js/views/pagerDutyView.js';

describe('Pager Duty View', () => {
    
    let errorInfoDeferred, view;   

    beforeEach(() => {
        //errorInfoDeferred = $.Deferred();
        //spyOn($, 'get').and.returnValue(errorInfoDeferred);
        view = pagerDutyView();
        //view = logView(1);
    });

    it('Describes purpose of view', async () => {
        expect(view.find('h1').text()).toEqual("Pager Duty");
        expect(view.find('p').text()).toEqual("If you would like to receive PagerDuty alerts for significant errors on your applications, you can manage your routing keys here.");
    });


    it('Contains a form for adding new routing key information with 3 fields and a submit button', async () => {
        const firstSubHeading = view.find('h3')[0];
        expect(firstSubHeading.textContent).toEqual("Add Routing Key");
        const inputForm = view.find('form');
        const inputBoxes = inputForm.find('input');
        expect(inputBoxes.length).toEqual(3);
        expect(inputBoxes[1].placeholder).toEqual("e.g. http://terrain.aq.tc/");
        expect(inputForm.find("button").text()).toEqual("Submit");
    });
    
    /*it('Submits information, checking for incomplete forms or repeated key name', async () => {
        errorInfoDeferred.resolve('{} \n');
        const firstHeading = view.find('tr:first th:first');
        const lastHeading = view.find('tr:first th:last');
        expect(firstHeading.text()).toEqual("No.");
        expect(lastHeading.text()).toEqual("URL");
    });

    /*it('Renders the current routing information in a table with checkboxes and an option to delete', async () => {
        let errorInfo = '{"session": "4","errorEventMessage": "Uncaught TypeError"}\n'; 
        errorInfoDeferred.resolve(errorInfo);
        const firstValue = view.find('tbody').find('tr:nth-child(1) td:nth-child(2)');
        const lastValue = view.find('tbody').find('tr:nth-child(1) td:nth-child(3)');
        expect(firstValue.text()).toEqual("4");
        expect(lastValue.text()).toEqual("Uncaught TypeError");
    });
    
    it('Deletes selected keys', async () => {
        errorInfoDeferred.resolve('{} \n');
        const firstHeading = view.find('tr:first th:first');
        const lastHeading = view.find('tr:first th:last');
        expect(firstHeading.text()).toEqual("No.");
        expect(lastHeading.text()).toEqual("URL");
    });
    
    it('Shows updated table after submit or delete actions', async () => {
        errorInfoDeferred.resolve('{} \n');
        const firstHeading = view.find('tr:first th:first');
        const lastHeading = view.find('tr:first th:last');
        expect(firstHeading.text()).toEqual("No.");
        expect(lastHeading.text()).toEqual("URL");
    });*/


});
