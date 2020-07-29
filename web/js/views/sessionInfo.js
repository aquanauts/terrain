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
        //console.log(errorArray);
        
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
        //console.log(historyLengthsPerError);
        var errorNumCounter = 0;
        for (var i in historyArray){
            let infoRow = $('<tr>');  
            if (historyLengthsPerError.includes(Number(i)+1)){ // if there was an error at that URL
                const errorNums = getAllErrorsHere(historyLengthsPerError, (Number(i)+1));
                
                ($(`<td rowspan="${errorNums.length}">`).text(Number(i))).appendTo(infoRow); //no.
                
                const urlLink = renderURL(historyArray[i], historyArray[i]);
                $(`<td rowspan="${errorNums.length}">`).append(urlLink).appendTo(infoRow); //history url
                
                let row;
                
                for(var errorNum in errorNums){

                    if(errorNum == 0){
                        row = infoRow.appendTo(tableBody);
                    }
                    
                    else {
                        row  = $('<tr>').appendTo(tableBody);
                    };

                    const infoText = errorArray[errorNumCounter]['errorStack'];
                    const fixedWidthFormat = $('<pre>').append($('<code>').append(infoText));
                    ($('<td>').append(fixedWidthFormat)).appendTo(row);
                
                    const id = errorArray[errorNumCounter]['id']; //log link
                    const logLink = renderURL(`#extraInfo-${id}`, id);        
                    ($('<td>').append(logLink)).appendTo(row);
                
                    if('date' in errorArray[errorNumCounter]){
                        ($('<td>').append(new Date(errorArray[errorNumCounter]['date']))).appendTo(row);
                    }

                    else if('dateTime' in errorArray[errorNum]){
                        ($('<td>').append(new Date(errorArray[errorNumCounter]['dateTime']))).appendTo(row);
                    }
                
                    errorNumCounter++;            
                
                }
            }
            
            
            else {
                infoRow.appendTo(tableBody);
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
        };
        table.bootstrapTable();
    });
    return view;
}
    
