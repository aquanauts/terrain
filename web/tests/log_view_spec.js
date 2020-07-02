import logView,{errorTable} from '/js/views/log.js';

describe('Log View', () => {
    it('Has a friendly greeting', async () => {
        const view = logView();
        expect(view.find('p').text()).toEqual("Hello World!");
    });

    describe('error table', () => {
        let errorLogTable;
        beforeEach(() => {
            errorLogTable = errorTable([]);
        });

        it('adds an errorEventMessageColumn', async () => {
            const columnHeaders = errorLogTable.find('th')
            expect(columnHeaders.get(1).innerText).toEqual("errorEventMessage");
        });
    });
});
