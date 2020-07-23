
const keysAndHeadings = {
    "session":"Session",
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

export default function(no) { 

    let view = template('extraInfoView');
    const table = view.find("#extraInfoTable");
    const heading = view.find('h1');
    $(heading).text(`Log Entry ${no} Error Details`);
    
    const tableHeader = $('<thead>').appendTo(table);
    const tableBody = table.append($('<tbody>'));
    const headingRow = $("<tr>")
    headingRow.appendTo(tableHeader);
    headingRow.append($("<th>").text("Key"));
    headingRow.append($("<th>").text("Value"));
    
    $.get("/get_error?id=" + no).then((errorInfo) => {  //TODO test new link stuff
        for(var key in errorInfo){
            const infoRow = $('<tr>');
            const boldHeading = $('<b>').append(keysAndHeadings[key]);
            
            infoRow.append($('<td>').append(boldHeading));
            
            if(key == 'session'){
                const sessionLink = $("<a>");
                sessionLink.attr('href', `#sessionID-${errorInfo[key]}`);
                sessionLink.text(errorInfo[key]);
                infoRow.append($('<td>').append(sessionLink));

            }
            
            else if(key =='url'){
                const urlLink = $("<a>");
                urlLink.attr('href', `${errorInfo[key]}`);
                urlLink.text(errorInfo[key]);
                infoRow.append($('<td>').append(urlLink));
            }

            else if(key =='sessionHistory'){
                const historyDisplayList = $('<ol>');
                const history = errorInfo[key];
                let historyArray;
                if(history.search('\n\n') != -1){
                    historyArray = history.split('\n\n');
                }
                else {
                    historyArray = history.split(',');
                }
                //console.log(historyArray);
                for(var entry = 0; entry < historyArray.length-1; entry++){ // len-1 because last is blank because of \n
                    const url = $("<a>");
                    url.attr('href', `${historyArray[entry]}`);
                    url.text(historyArray[entry]);
                    historyDisplayList.append($('<li>').append(url));
                }
                infoRow.append($('<td>').append(historyDisplayList));
            }
            
            else {infoRow.append($('<td>').text(errorInfo[key]));};
            
            tableBody.append(infoRow);
         }
    table.bootstrapTable();    
    });

    return view;
}

