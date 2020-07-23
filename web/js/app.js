import homeView from './views/home.js';
import logView from './views/log.js';
import extraInfoView from './views/extraInfo.js';
import sessionView from './views/sessionInfo.js';

export function routes() {
    return {
        '': logView,
        '/index.html': logView,
        '#': logView,
        '#home': logView,
        '#errorLog' : logView,
        '#extraInfo': extraInfoView,
        '#sessionID': sessionView
    }
}
