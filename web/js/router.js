"use strict";
let routes = {};

function activateNavbar(hash) {
    $('.navbar .nav-link').removeClass('active');
    if (hash) {
        $(`.navbar .nav-link[href='${hash}']`).addClass('active');
    } else {
        $(`.navbar .nav-link[href='#home']`).addClass('active');
    }
}

// To rebuild the curren view, call:
// showView(window.location.hash)
function showView(hash) {
    const hashParts = hash.split('-');
    const viewName = hashParts[0];
    const viewFn = window.routes[viewName];
    if (viewFn) {
        triggerEvent('router.addView', viewName);
        $('.view-container').empty().append(viewFn(hashParts[1]));
        activateNavbar(hash);
    }
}

function routerOnReady(customRoutes) {
    window.routes = customRoutes;
    window.onhashchange = function() {
        showView(window.location.hash);
    };
    showView(window.location.hash);
}
