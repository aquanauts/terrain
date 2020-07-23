
export function generateErrorTable(data, view){ //data is a string of json objects/dicts separated by \n
          const errorArray = data.split("\n");            
          const table = view.find("#errorTable");
          const tableHeader = $("<thead>");
          const headingRow = $("<tr>");
    
          tableHeader.append(headingRow);

          $(headingRow).append($('<th data-sortable="true">').text("No."));
          $(headingRow).append($('<th data-sortable="true">').text("Session ID"));
          $(headingRow).append($('<th data-sortable="true">').text("Error Event Message"));
          $(headingRow).append($('<th data-sortable="true">').text("Error Message"));
          $(headingRow).append($('<th data-sortable="true">').text("URL"));
        
          $(table).append(tableHeader);
          
          
          if(errorArray.length > 0) { 
                console.log(errorArray.length);
                const latest = errorArray.length - 2;
                const tableBody = $("<tbody>");
                var endPoint = latest - 200;
                if (endPoint < 0 ) { endPoint = 0 };

                for(var i = latest; i >= endPoint; i--) {
                    var jsonEntry = JSON.parse(errorArray[i]); // Cannot deal with empty strings
                    const infoRow = $("<tr>");
                    tableBody.append(infoRow);
                    var extraInfoLink = $("<a>");
                    var sessionIDLink = $("<a>");
                    var urlLink = $("<a>");

                    extraInfoLink.attr('href', `#extraInfo-${i}`);
                    extraInfoLink.text(i.toString());

                    sessionIDLink.attr('href', `#sessionID-${jsonEntry["session"]}`);
                    sessionIDLink.text(jsonEntry["session"]);
                  
                    urlLink.attr('href', `${jsonEntry["url"]}`);
                    urlLink.text(jsonEntry["url"])
                  
                    $(infoRow).append($("<td>").append(extraInfoLink));
                    $(infoRow).append($("<td>").append(sessionIDLink));
                    $(infoRow).append($("<td>").text(jsonEntry["errorEventMessage"]));
                    $(infoRow).append($("<td>").text(jsonEntry["errorMessage"]));
                    $(infoRow).append($("<td>").append(urlLink));

                    $(table).append(tableBody);
                }
        table.bootstrapTable()
        }
}

export default function logViewFn() {
    let view = template('logView');
    
    $.get('/show_errors').then(function(data) {
        generateErrorTable(data, view)
        });
        return view;
}
