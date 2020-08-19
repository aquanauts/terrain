function reverseOrder(){ 
    var tableBody = $("table").find($("tbody")); //function is used already within the scope of said table
    var rowArray = $.makeArray((tableBody.find($("tr"))).detach());
    tableBody.append(rowArray.reverse());
}
//TODO make version that accounts for rowspan > 1
//TODO include icon for sorting

function reverseOrder2(){
    var tableBody = $("table").find($("tbody")); //function is used already within the scope of said table
    var rowArray = $.makeArray(tableBody.find($("tr")).detach());
    //console.log(rowArray);
    var entriesInRows = rowArray.map(x => $.makeArray(x.getElementsByTagName("td")));
    var numRows = rowArray.length;
    let reversedArray = [];
    //console.log(entriesInRows);
    var i = 0;
    while(i<numRows){
        var rowContentArray = entriesInRows[i];
        //console.log(entriesInRows[i]);
        //console.log(entriesInRows[i][0]);
        var rowSpan = rowContentArray[0].rowSpan;
        console.log(rowSpan);
        if(rowSpan == 1){
            reversedArray.unshift(rowContentArray);
        }
        else {
            var shift = rowSpan - 1;
            console.log(entriesInRows[i+shift]);
            entriesInRows[i+shift].unshift(rowContentArray[1]);
            entriesInRows[i+shift].unshift(rowContentArray[0]);
            console.log(rowContentArray);
            reversedArray.unshift(rowContentArray.slice(2,));
            for(var delta=1; delta<=shift; delta++) {
                reversedArray.unshift(entriesInRows[i+delta]);
            }
        }
        i = i+rowSpan;
    }
    
    for(var rowNum in reversedArray){
        const newRow = $("tr");
        newRow.appendTo(tableBody);
        for(var entry in reversedArray[rowNum]){
            $(reversedArray[rowNum][entry]).appendTo(newRow);
        }
    }
}
