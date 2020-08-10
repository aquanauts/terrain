function reverseOrder(){ 
    var tableBody = $("table").find($("tbody")); //function is used already within the scope of said table
    var rowArray = $.makeArray((tableBody.find($("tr"))).detach());
    tableBody.append(rowArray.reverse());
}
//TODO make version that accounts for rowspan > 1
//TODO include icon for sorting
