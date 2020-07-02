export function errorTable(errorArray) {
    let table = template('errorLogTable');
    return table;
}

export default function() {
    let view = template('logView');

    fetch('/show_errors').then(function(response) {
          return response.text();
      }).then(function(data) {
          // TODO view.append(errorTable(errorArray));
          const errorArray = data.split("\n");            
          const container = view.find("#errorTable").get(0);

          if(errorArray.length > 0) {
              const exampleEntry = errorArray[0];  //TODO more comprehensive - include all keys and allow blank spaces?
              let jsonEntry = JSON.parse(exampleEntry);
              let headingHTML = ""
              let rowHTML = ""
        
              headingHTML = headingHTML + "<tr class = 'heading'>\n"
              headingHTML = headingHTML + "<th>No.</th>\n"
       
              for(var key in jsonEntry) {
           
                  let heading = "<th>"+key.toString()+"</th>\n";
                  //console.log(heading)
                  headingHTML = headingHTML + heading       
                  //console.log(headingHTML)
               }
              
              headingHTML = headingHTML + "</tr>\n"
              //console.log(headingHTML)
              //container.innerHTML = headingHTML
     
              for(var i = 0; i < errorArray.length - 1; i++) {
                  //console.log(i.toString())
                  //console.log(JSON.parse(errorArray[i]))
                  jsonEntry = JSON.parse(errorArray[i]); //Cannot handle empty strings
                  //console.log(jsonEntry)

                  rowHTML = rowHTML + "<tr>\n"  
                  rowHTML = rowHTML + "<td>"+i.toString()+"</td>\n"
           
                  for(var key in jsonEntry) {
                      rowHTML = rowHTML + "<td>"+jsonEntry[key]+"</td>\n"    
                  }

                  rowHTML = rowHTML + "</tr>\n"
              }
              container.innerHTML = headingHTML + rowHTML
          };
      });



        //Assume table data is in json form
        //Ensure/Assume every line has the same keys (even if no value exists for it)
        //headings function - extract only keys and add
        //content - for all lines add <tr> 



    return view;
}
