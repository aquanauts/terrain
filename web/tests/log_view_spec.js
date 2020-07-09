import logView from '/js/views/log.js';

describe('Log View', () => {
    it('Has a friendly greeting', async () => {
        const view = logView();
        expect(view.find('p').text()).toEqual("Hello World!");
    });
});
