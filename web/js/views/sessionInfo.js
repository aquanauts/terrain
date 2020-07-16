export default function(sessionID){
    let view = template('sessionInfoView');
    const table = view.find('.sessionInfoTable').get(0);
    const container = view.find('.container').get(0);
    $.get("/get_session?sessionID=" + sessionID).then((errorArray) => {  
        $(container).prepend($('<h1>').text("Session "+ sessionID.toString() + " Error Details"))
        const headingRow = $('<tr>')
        headingRow.append($('<th>').text("Entry No."));
        headingRow.append($('<th>').text("Error Event Message"));
        headingRow.append($('<th>').text("Error Name"));
        headingRow.append($('<th>').text("Error Message"));
        headingRow.append($('<th>').text("Error Stack"));
        headingRow.append($('<th>').text("URL"));
        headingRow.append($('<th>').text("Host"));
        headingRow.append($('<th>').text("JS Heap Size Limit"));
        headingRow.append($('<th>').text("Total JS Heap Size"));
        headingRow.append($('<th>').text("Used JS Heap Size"));
        headingRow.append($('<th>').text("Network Type"));
        headingRow.append($('<th>').text("RT Delay"));
        headingRow.append($('<th>').text("Bandwidth (Mbps)"));
        headingRow.append($('<th>').text("Logical Processors"));
        headingRow.append($('<th>').text("Broswer"));
        headingRow.append($('<th>').text("Broswer Version"));
        headingRow.append($('<th>').text("OS Platform"));
        headingRow.append($('<th>').text("Cookies Enabled"));
        
        $(table).append(headingRow);
        
        const keyArray = ["errorEventMessage", "errorName", "errorMessage", "errorStack", "url", "host", "jsHeapSizeLimit", "totalJSHeapSize", "usedJSHeapSize", "networkType", "rtDelayTime", "bandwidthMbps", "logicalProcessors", "browser", "browserVersion", "platform", "cookiesEnabled"]

        for (var entry in errorArray) {
            const infoRow = $('<tr>');
            infoRow.append($('<td>').text(entry.toString()));
            for(var key in keyArray){
                infoRow.append($('<td>').text(errorArray[entry][keyArray[key]]));;
            }

            $(table).append(infoRow);
        }
    });
    return view;
}

            
