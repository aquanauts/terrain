import homeView from '/js/views/home.js';

describe('Home View', () => {
    it('Has a friendly greeting', async () => {
        const view = homeView();
        expect(view.find('p').text()).toEqual("Hello World!");
    });
});
