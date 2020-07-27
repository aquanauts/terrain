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
    "dateTime":"Date and Time",
    "sessionHistory":"Session History"
};

const selectKeysAndHeadings = {
    "sessionHistory":"Session History",
    "errorStack":"Error Stack",
    "id":"Log Entry No.",
    "dateTime":"Date and Time",    
};

const keyArray = Object.keys(keysAndHeadings);
const selectKeyArray = Object.keys(selectKeysAndHeadings);

function addPageTitle(view, sessionID) {
        const heading = view.find('h1');
        $(heading).text(`Session ${sessionID.toString()} Error Details`);
        const message = view.find('p');
       // $(message).text("uncheck the boxes to hide columns.");
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

function addSelectColumnHeadings(tableHeader){
    const headingRow = $('<tr>');
        $('<th>').text("No.").appendTo(headingRow);
        for(var key in selectKeysAndHeadings){
            var columnHeading = selectKeysAndHeadings[key];
            $('<th>').text(columnHeading).appendTo(headingRow);
        };
        
        headingRow.appendTo(tableHeader);
};

function oldDefault(sessionID){
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
                if(key == 'date'){
                    $(`<td class="toggle-${key}">`).text(Date(errorArray[entry][key])).
                        appendTo(infoRow);
                }
            
                else if((key == 'errorName')|(key == 'errorEventMessage')|(key == 'errorMessage')|( key == 'errorStack')){
                    console.log(key);
                    $(`<td class="toggle-${key}">`).append($('<pre>').append($('<code>').append($('<p>').text(errorArray[entry][key])))).appendTo(infoRow); //TODO refactor, renderer fn
                }
                else {
                    $(`<td class="toggle-${key}">`).text(errorArray[entry][key]).appendTo(infoRow);
                }
            };

            tableBody.append(infoRow);
        };
    table.bootstrapTable();
    });
      
    addHideColumnsCheckboxes(view);
    
    return view;
}

function getAllErrorsHere(historyLengthPerError, historyEntryNo){
    var indices = [], i;
    for(i=0; i<historyLengthPerError.length; i++){
        if(historyLengthPerError[i] == historyEntryNo){
            indices.push(i)
        }
    }
    return indices
};

function renderURL(href, linkName){
    const renderedURL = $('<a>');
    renderedURL.attr('href', href);
    renderedURL.text(linkName);
    return renderedURL;
};

export default function(sessionID){
    let view = template('sessionInfoView');
    const table = view.find('#sessionInfoTable');
    const tableHeader = $('<thead>').appendTo(table);
    const tableBody = $('<tbody>').appendTo(table);

    $.get("/get_session?sessionID=" + sessionID).then((errorArray) => {  
        
        addPageTitle(view, sessionID);
        addSelectColumnHeadings(tableHeader);
        const numErrors = errorArray.length;
        const mostRecentError =  errorArray[numErrors-1];
        const fullSessionHistory = mostRecentError["sessionHistory"];
        

        let historyArray;
        let singleHistoryArray;
        let historyLengthsPerError = [];

        if(fullSessionHistory.search('\n\n') != -1){
            historyArray = fullSessionHistory.split('\n\n');
        }
        else {
            historyArray = fullSessionHistory.split(',');
        };
        console.log(errorArray);
        
        for (var entry in errorArray) {
            const singleHistoryString = errorArray[entry]["sessionHistory"];
            if(singleHistoryString.search('\n\n') != -1){
                singleHistoryArray = singleHistoryString.split('\n\n');
            }
            else {
                singleHistoryArray = singleHistoryString.split(',');
            };

            historyLengthsPerError.push(singleHistoryArray.length);
        }
        console.log(historyLengthsPerError);
        
        
        for (var i in historyArray){
            let infoRow = $('<tr>');  
            if (historyLengthsPerError.includes(Number(i)+1)){ // if there was an error at that URL
                const errorNums = getAllErrorsHere(historyLengthsPerError, (Number(i)+1));
                
                ($(`<td rowspan="${errorNums.length}">`).text(i)).appendTo(infoRow);
                for(var key in selectKeysAndHeadings){
                    if(key == "sessionHistory"){
                        const urlLink = renderURL(historyArray[i], historyArray[i]);
                        $(`<td rowspan="${errorNums.length}">`).append(urlLink).appendTo(infoRow);
                     }
                    else{
                        const tableCellEntry = ($('<td>').append($('<ol>'))).appendTo(infoRow);
                        for(var errorNum in errorNums){
                            console.log(errorNum);
                            if(key=='date'| key =='dateTime'){
                                $('<li>').text(Date(errorArray[errorNum][key])).appendTo(tableCellEntry);
                            }
                            else if(key=='id'){
                                const id = errorArray[errorNum][key];
                                const logLink = renderURL(`#extraInfo-${id}`, id);
                                
                                const infoText =$('<li>').append(logLink);
                                infoText.appendTo(tableCellEntry);
                            }
                            else {
                                const infoText =$('<li>').text(errorArray[errorNum][key]);
                                const fixedWidthFormat = $('<pre>').append($('<code>').append(infoText));
                                fixedWidthFormat.appendTo(tableCellEntry);
                            }
                        }
                    }
                };
            }
            
            else {
            
                ($('<td>').text(i)).appendTo(infoRow);
                
                for(var key in selectKeysAndHeadings){
                    if(key == "sessionHistory"){
                        const urlLink = renderURL(historyArray[i], historyArray[i]);
                        infoRow.append($('<td>').append(urlLink));
                    }
                    else {
                        infoRow.append($('<td>'))
                    } // Empty because no error
                };
            }
            tableBody.append(infoRow);
        };
        table.bootstrapTable();
    });
    return view;
}
    
