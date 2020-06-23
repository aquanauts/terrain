window.addEventListener('load', function() {  
    console.log("Terrain is active!");
});

function undefinedVariableError() {
    foo.bar.baz();
}

function record_error(msg, url, line, col, error) {
    console.log("An error was found!");

    var errorInfo = {
        message: msg,
        url: url,
        lineNo: line,
        colNo: col,
        error: error //TODO stacktrace info
    };
    console.log(errorInfo);

    $.post({
        url: '/error',
        data: JSON.stringify(errorInfo),
        contentType: 'application/json'
    } );
}

window.addEventListener('error', record_error);

undefinedVariableError();
