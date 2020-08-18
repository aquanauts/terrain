
function renderSearchBar(view){
    const container = view.find(".searchBarContainer");
    const searchBar = container.append($('<input type="text" class="searchBar" placeholder="Search" onkeyup="searchEveryColumn()">'));
}

export function generateErrorTable(data, view){ //data is a string of json objects/dicts separated by \n
    const errorArray = data.split("\n");            
    const table = view.find("#errorTable");
    const tableHeader = $("<thead>");
    const headingRow = $("<tr>");


    tableHeader.append(headingRow);
    const firstHeading = $('<th onclick="reverseOrder()">').text("No.");
    $(headingRow).append(firstHeading.append($('<img class="icon" width="16" height="16" src="vendor/sort-solid.svg">')));
    $(headingRow).append($('<th>').text("Session ID"));
    $(headingRow).append($('<th>').text("Error Event Message"));
    $(headingRow).append($('<th>').text("Error Message"));
    $(headingRow).append($('<th>').text("URL"));

    $(table).append(tableHeader);
          
          
          if(errorArray.length > 0) { 
                //console.log(errorArray.length);
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
                    const errorMessageText = $("<p>").text(jsonEntry['errorMessage']);
                    const errorMessage =$('<pre>').append($('<code>').append(errorMessageText));
                    const errorEventMessageText = $("<p>").text(jsonEntry['errorEventMessage']);
                    const errorEventMessage =$('<pre>').append($('<code>').append(errorEventMessageText));
                    
                    extraInfoLink.attr('href', `#extraInfo-${i}`);
                    extraInfoLink.text(i.toString());

                    sessionIDLink.attr('href', `#sessionID-${jsonEntry["session"]}`);
                    sessionIDLink.text(jsonEntry["session"]);
                  
                    urlLink.attr('href', `${jsonEntry["url"]}`);
                    urlLink.text(jsonEntry["url"]);
                    
                
                    $(infoRow).append($("<td>").append(extraInfoLink));
                    $(infoRow).append($("<td>").append(sessionIDLink));
                    $(infoRow).append($("<td>").append(errorEventMessage));
                    $(infoRow).append($("<td>").append(errorMessage));
                    $(infoRow).append($("<td>").append(urlLink));

                    $(table).append(tableBody);
                }
        //table.bootstrapTable()
        }
}

export default function logViewFn() {
    let view = template('logView');
    
    $.get('/show_errors').then(function(data) {
        generateErrorTable(data, view);
        renderSearchBar(view);
        });
        return view;
}
