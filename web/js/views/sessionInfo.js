const keysAndHeadings = {
    "errorEventMessage":"Error Event Message",
    "errorName":"Error Name",
    "errorMessage":"Error Message",
    "errorStack":"Error Stack",
    "url":"URL",
    "host":"Host",
    "jsHeapSizeLimit":"JS Heap Size Limit",
    "totalJSHeapSize":"Total JS Heap Size",
    "usedJSHeapSize":"Used JS Heap Size",
    "networkType":"Network Type",
    "rtDelayTime":"RT Delay",
    "bandwidthMbps":"Bandwidth (Mbps)",
    "logicalProcessors":"Logical Processors",
    "browser":"Browser",
    "browserVersion":"Browser Version",
    "platform":"OS Platform",
    "cookiesEnabled":"Cookies Enabled"
};

const keyArray = Object.keys(keysAndHeadings);

function addPageTitle(view, sessionID) {
        const heading = view.find('h1');
        $(heading).text(`Session ${sessionID.toString()} Error Details`);
        const message = view.find('p');
        $(message).text("Check the boxes to hide columns.");
};

function addColumnHeadings(table){
        const headingRow = $('<tr>')
        headingRow.append($('<th>').text("No."));

        for(var key in keysAndHeadings){
            var columnHeading = keysAndHeadings[key];
            headingRow.append($(`<th class=toggle-${key}>`).text(columnHeading));
        };
        
        $(table).append(headingRow);
};

function addHideColumnsCheckboxes(view){ //TODO Test
    const formContainer = view.find('.sessionInfoHide');

    for(var key in keysAndHeadings) {
        const formCheckDiv = $('<div class="form-check form-check-inline">');
        const input = $('<input class="form-check-input" type="checkbox">');
        const label = $('<label class="form-check-label">');

        input.attr('id', key);
        const className = "toggle-" + key.toString();
        input.attr('onclick',`hideByClass("${className}")`)
        label.attr('for', key);
    
        formCheckDiv.append(input);
        formCheckDiv.append(label.text(keysAndHeadings[key]));

        $(formContainer).append(formCheckDiv);
    
    };
};

export default function(sessionID){
    let view = template('sessionInfoView');
    const table = view.find('.sessionInfoTable').get(0);
    //const container = view.find('.container').get(0);

    $.get("/get_session?sessionID=" + sessionID).then((errorArray) => {  
        
        addPageTitle(view, sessionID);
        addColumnHeadings(table);
        
        
        for (var entry in errorArray) {
            const infoRow = $('<tr>');
            infoRow.append($('<td>').text(entry.toString()));
            for(var key in keysAndHeadings){
                infoRow.append($(`<td class="toggle-${key}">`).text(errorArray[entry][key]));;
            };

            $(table).append(infoRow);
        };
    });

    addHideColumnsCheckboxes(view);

    return view;
}

            
