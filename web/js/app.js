import homeView from './views/home.js';
import logView from './views/log.js';

export function routes() {
    return {
        '': homeView,
        '#': homeView,
        '#home': homeView,
        '#errorLog' : logView,
        // #errorDetail: errorDetailView
    }
}
