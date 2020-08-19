function renderSearchBar(view){
    const container = view.find(".searchBarContainer");
    const searchBar = container.append($('<input type="text" class="searchBar" placeholder="Search" onkeyup="searchEveryColumn()">'));
}


function searchEveryColumn(){
    var input = document.getElementsByClassName("searchBar");
    var filter = input[0].value.toUpperCase();
    var table = document.getElementsByClassName("table");
    var rows = table[0].getElementsByTagName("tr");
    var matchFoundInRow = false;
    const numColumns = rows[0].cells.length;
    
    for (var i = 1; i < rows.length; i++) {
        var entriesInRow = rows[i].getElementsByTagName("td");
        matchFoundInRow = false;
        for(var j = 0; j < numColumns; j++) {
            var column = entriesInRow[j].textContent.toUpperCase();
            if (column.indexOf(filter) > -1){
                rows[i].style.display = "";
                matchFoundInRow = true;
                break;
            }    
        }
        
        if (matchFoundInRow != true) {
            rows[i].style.display = "none";
        }
    }
}
