export function generateExtraInfoView(no, jsonEntry){
    let extraInfoView = template('extraInfoView');            
    const container = view.find("#extraInfoTable").get(0);
    $(container).append("Entry number: "+ no.toString())
    for(var key in jsonEntry){
        $(container).append(
            "<tr>\n" +
            "<td>" + key + "</td>\n" +
            "<td>" + jsonEntry[key] + "</td>\n" +
            "</tr>\n"
        )
    }
    
    return extraInfoView;
}

export function generateSessionView(sessionID){
    let sessionView = template('sessionView');
    return sessionView;
}

export function generateErrorTable(data, view){

          // TODO view.append(errorTable(errorArray));
          const errorArray = data.split("\n");            
          const container = view.find("#errorTable").get(0);
      
          $(container).append(
              "<tr>\n"+
              "<th>No.</th>\n" +
              "<th>SessionID</th>\n" +
              "<th>Error Event Message</th>\n" +
              "<th>Error Message</th>\n" +
              "<th>URL</th>\n"+
              "</tr>\n"
        )

          if(errorArray.length > 0) { 
              for(var i = 0; i < errorArray.length - 1; i++) { //TODO recent 500
                  var jsonEntry = JSON.parse(errorArray[i]); // Cannot deal with empty strings
                  // TODO Replace with jQuery (and write tests!)
                  $(container).append(
                      "<tr>\n" +
                      "<td>\n" + 
                            `<a href='#extraInfo-${i}'>`+
                      i.toString()+
                            "</a>\n"+ 
                      "</td>\n" +
                      "<td>"+jsonEntry["session"]+"</td>\n" +
                      "<td>"+jsonEntry["errorEventMessage"]+"</td>\n" +
                      "<td>"+jsonEntry["errorMessage"]+"</td>\n" +
                      "<td>"+jsonEntry["url"]+"</td>\n"
                    )
                }
        }
}

export default function() {
    let view = template('logView');
    fetch('/show_errors').then(function(response) {
          return response.text();
      }).then(function(data) {
          generateErrorTable(data, view)
      })
    return view;
}
