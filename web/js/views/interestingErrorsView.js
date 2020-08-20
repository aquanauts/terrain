function renderSearchBar(view){
    const container = view.find(".searchBarContainer");
    const searchBar = container.append($('<input type="text" class="searchBar" placeholder="Search" onkeyup="searchEveryColumn()">'));
}

export function generateUniqueNewErrorTable(data, view){ //data is a string of json objects/dicts separated by \n            
    //renderSearchBar() //TODO Demo example - significant error that should be flagged
    console.log(data)
    console.log(data.length)
    let errorArray = data;
    console.log(errorArray)

    const table = view.find("#uniqueNewErrorTable");
    const tableHeader = $("<thead>");
    const headingRow = $("<tr>");


    tableHeader.append(headingRow);

    $(headingRow).append($('<th>').text("No."));
    $(headingRow).append($('<th>').text("URL"));
    $(headingRow).append($('<th>').text("Error Stack"));
    $(headingRow).append($('<th>').text("Log Entry"));

    $(table).append(tableHeader);
        
/*          if(errorArray.length > 0) { 
                //console.log(errorArray.length);
                const latest = errorArray.length - 2;
                const tableBody = $("<tbody>");
                var endPoint = latest - 200;
                if (endPoint < 0 ) { endPoint = 0 };

                for(var i = latest; i >= endPoint; i--) {
                    var jsonEntry = errorArray[i]; // Cannot deal with empty strings
                    const infoRow = $("<tr>");
                    tableBody.append(infoRow);

                    var extraInfoLink = $("<a>");
                    var urlLink = $("<a>");
                    
                    const errorStackText = $("<p>").text(jsonEntry['errorStack']);
                    const errorStack =$('<pre>').append($('<code>').append(errorStackText));
                    
                    urlLink.attr('href', `${jsonEntry["url"]}`);
                    urlLink.text(jsonEntry["url"]);
                    
                    const id = Number(jsonEntry["id"]) - 1
                    extraInfoLink.attr('href', `#extraInfo-${id}`); //-1 - weird indexing
                    extraInfoLink.text(id.toString());             
                
                    $(infoRow).append($("<td>").append(i.toString()));
                    $(infoRow).append($("<td>").append(urlLink));
                    $(infoRow).append($("<td>").append(errorStack));
                    $(infoRow).append($("<td>").append(extraInfoLink));

                    $(table).append(tableBody); 
                } 
        }*/
}

export function generateRepetitiveErrorTable(data, view){ //data is a string of json objects/dicts separated by \n
    console.log(data)
    if(data.length > 0){
        const errorArray = data.split("\n");
    }
    else {const errorArray = []}
    const table = view.find("#repetitiveErrorTable");
    const tableHeader = $("<thead>");
    const headingRow = $("<tr>");


    tableHeader.append(headingRow);

    $(headingRow).append($('<th>').text("No."));
    $(headingRow).append($('<th>').text("URL"));
    $(headingRow).append($('<th>').text("Error Stack"));
    $(headingRow).append($('<th>').text("Log Entry"));
    //$(headingRow).append($('<th>').text("Similar Errors"));

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
                    var urlLink = $("<a>");
                    
                    const num = $("<p>").text(jsonEntry['id']);
                    const errorStackText = $("<p>").text(jsonEntry['errorStack']);
                    const errorStack =$('<pre>').append($('<code>').append(errorStackText));
                    
                    extraInfoLink.attr('href', `#extraInfo-${jsonEntry["id"]}`);
                    extraInfoLink.text(jsonEntry["id"].toString());

                  
                    urlLink.attr('href', `${jsonEntry["url"]}`);
                    urlLink.text(jsonEntry["url"]);
                    
                
                    $(infoRow).append($("<td>").append(num));
                    $(infoRow).append($("<td>").append(urlLink));
                    $(infoRow).append($("<td>").append(errorStack));
                    $(infoRow).append($("<td>").append(extraInfoLink));
                    //$(infoRow).append($("<td>").append(similarLinksList));

                    $(table).append(tableBody);
                }
        }
}

export default function interestingErrorsViewFn() {
    let view = template('interestingErrorsView');
    
    $.get('/unique_new_errors').then(function(data) {
        generateUniqueNewErrorTable(data, view);
        });

    /*$.get('/repetitive_errors').then(function(data) {
        generateRepetitiveErrorTable(data, view);
        });
*/
        return view;
}
