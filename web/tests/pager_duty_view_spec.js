import pagerDutyView from '/js/views/pagerDutyView.js';

describe('Pager Duty View', () => {
    
    let getDeferred, postDeferred, view;   

    beforeEach(() => {
        getDeferred = $.Deferred();
        spyOn($, 'get').and.returnValue(getDeferred);

        postDeferred =  $.Deferred(); //TODO make assertions about the arguments to post
        spyOn($, 'post').and.returnValue(postDeferred);
        view = pagerDutyView(1);
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
        //spyOn($, 'post')
        getDeferred.resolve('{} \n');
        const firstHeading = view.find('tr:first th:first');
        const lastHeading = view.find('tr:first th:last');
        expect(firstHeading.text()).toEqual("No.");
        expect(lastHeading.text()).toEqual("URL");
        expect
    });

    /*it('Renders the current routing information in a table with checkboxes and an option to delete', async () => {
        //generatePagerDutyKeyTable(view.find('table')[1]);
        let currentInfo = '{"name":"Name", "host":"gracious, "key":"12345"}'
        currentKeyInfo.resolve(currentInfo);
        const firstHostName = view.find('tbody')[1].find('tr:nth-child(1) td:nth-child(3)');
        const firstTableCell = view.find('tbody')[1].find('tr:nth-child(1) td:nth-child(1)');
        expect(firstHostName).toEqual('gracious');
        const firstCheckBox =  firstTableCell.find('input').attr('type').toEqual('checkbox');
        expect(view.find('button')[1].textContent).toEqual("Delete Selected Keys");
    });
    
    it('Deletes selected keys', async () => {
        errorInfoDeferred.resolve('{} \n');
        const firstHeading = view.find('tr:first th:first');
        const lastHeading = view.find('tr:first th:last');
        expect($, 'ajax').toHaveBeenCalledWith();
    });
    
    it('Shows updated table after submit or delete actions', async () => {
        errorInfoDeferred.resolve('{} \n');
        const firstHeading = view.find('tr:first th:first');
        const lastHeading = view.find('tr:first th:last');
        expect(firstHeading.text()).toEqual("No.");
        expect(lastHeading.text()).toEqual("URL");
    });
*/

});
