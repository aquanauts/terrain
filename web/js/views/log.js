
export function generateErrorTable(data, view){ //data is a string of json objects/dicts separated by \n
          const errorArray = data.split("\n");            
          const table = view.find("#errorTable").get(0);
            
          const headingRow = $("<tr>");
          
          $(headingRow).append($("<th>").text("No."));
          $(headingRow).append($("<th>").text("Session ID"));
          $(headingRow).append($("<th>").text("Error Event Message"));
          $(headingRow).append($("<th>").text("Error Message"));
          $(headingRow).append($("<th>").text("URL"));
        
          $(table).append(headingRow);

          if(errorArray.length > 0) { 
              for(var i = 0; i < errorArray.length-1; i++) { //TODO recent 500
                  var jsonEntry = JSON.parse(errorArray[i]); // Cannot deal with empty strings
                  const infoRow = $("<tr>");
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

                  $(table).append(infoRow);
                }
        }
}

export default function logViewFn() {
    let view = template('logView');
    
    $.get('/show_errors').then(function(data) {
        generateErrorTable(data, view)
        })

        return view;
}
