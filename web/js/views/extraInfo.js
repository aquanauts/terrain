
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
    "cookiesEnabled":"Cookies Enabled"
};

export default function(no) { 

    let view = template('extraInfoView');
    const table = view.find(".extraInfoTable").get(0);
    const heading = view.find('h1');
    $(heading).text(`Log Entry ${no} Error Details`);
    
    $.get("/get_error?id=" + no).then((errorInfo) => {  
        for(var key in errorInfo){
            const infoRow = $('<tr>');
            const boldHeading = $('<b>').append(keysAndHeadings[key]);
            infoRow.append($('<td>').append(boldHeading));
            infoRow.append($('<td>').text(errorInfo[key]));
            $(table).append(infoRow)
        }
    });

    return view;
}

