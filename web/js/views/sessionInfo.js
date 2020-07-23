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
    "cookiesEnabled":"Cookies Enabled",
    "visibility":"Visibility",
    "sessionHistory":"Session History"
};

const keyArray = Object.keys(keysAndHeadings);

function addPageTitle(view, sessionID) {
        const heading = view.find('h1');
        $(heading).text(`Session ${sessionID.toString()} Error Details`);
        const message = view.find('p');
        $(message).text("uncheck the boxes to hide columns.");
};

function addColumnHeadings(tableHeader){
        const headingRow = $('<tr>')
        headingRow.append($('<th>').text("No."));

        for(var key in keysAndHeadings){
            var columnHeading = keysAndHeadings[key];
            $(`<th class=toggle-${key}>`).text(columnHeading).appendTo(headingRow);
        };
        
        headingRow.appendTo(tableHeader);
        
};

function addHideColumnsCheckboxes(view){ //TODO Test
    const formContainer = view.find('.sessionInfoHide');

    for(var key in keysAndHeadings) {
        const formCheckDiv = $('<div class="form-check form-check-inline">');
        const input = $('<input class="form-check-input" type="checkbox" checked>');
        const label = $('<label class="form-check-label">');

        input.attr('id', key);
        const className = "toggle-" + key.toString();
        input.click(() => {  
            $('#sessionInfoTable').find(`.${className}`).fadeToggle("hide");
        });
        label.attr('for', key);
        formCheckDiv.append(input);
        formCheckDiv.append(label.text(keysAndHeadings[key]));

        formContainer.append(formCheckDiv);
    };
};

export default function(sessionID){
    let view = template('sessionInfoView');
    const table = view.find('#sessionInfoTable');
    const tableHeader = $('<thead>').appendTo(table);
    const tableBody = $('<tbody>').appendTo(table);

    $.get("/get_session?sessionID=" + sessionID).then((errorArray) => {  
        
        addPageTitle(view, sessionID);
        addColumnHeadings(tableHeader);
        
        
        for (var entry in errorArray) {
            const infoRow = $('<tr>');
            $('<td>').text(entry.toString()).appendTo(infoRow);
            for(var key in keysAndHeadings){
                $(`<td class="toggle-${key}">`).text(errorArray[entry][key]).appendTo(infoRow);;
            };

            tableBody.append(infoRow);
        };
    table.bootstrapTable();
    });
      
    addHideColumnsCheckboxes(view);
    
    return view;
}

            
