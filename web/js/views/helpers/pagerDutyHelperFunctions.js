function generatePagerDutyKeyTable(table){
        $.get('/pager-duty-keys').then((data) => {
        const tableHeader = $("<thead>");
        const tableBody = $("<tbody>");
        const headingRow = $("<tr>");

        tableHeader.append(headingRow);
        $(headingRow).append($('<th width="5%">').text("Select"))
        $(headingRow).append($('<th>').text("Key Name"));
        $(headingRow).append($('<th>').text("Application Host"));
        $(headingRow).append($('<th>').text("PagerDuty Key"));
        (tableHeader).appendTo(table);


        for(var i in data){
            const checkbox = $('<div class="form-check">').append($('<input class="form-check-input position-static" type="checkbox">'));
            var entry = data[i];
            //console.log(entry);
            const infoRow = $('<tr>')
            infoRow.append($('<td>').append(checkbox));

            for(var key in entry){
                //console.log(key);
                infoRow.append($('<td>').append(entry[key]));
                tableBody.append(infoRow);
            }
        }
    tableBody.appendTo(table);
    })
}

async function deleteSelectedRows(){
    const table = document.getElementById('pagerDutyTable');
    tableBody = table.getElementsByTagName("tbody")[0];
    rows = tableBody.getElementsByTagName("tr");
    for(i = 0; i<rows.length; i++){
        const tds = rows[i].getElementsByTagName("td");
        const checkboxChecked = tds[0].getElementsByTagName("input")[0].checked;
        if (checkboxChecked == true){
            const keyNameToDelete = tds[1].textContent; //TODO Make sure there's no "cors" issue with this.
            $.ajax({
                url: '/pager-duty-keys?keyname='+keyNameToDelete,
                type: 'DELETE',
            });
        }
    }
    table.removeChild(table.getElementsByTagName("tbody")[0]);
    table.removeChild(table.getElementsByTagName("thead")[0]);
    generatePagerDutyKeyTable(table);
}

//TODO Make the alerts have a dismiss option
function displayAlert(alertIDName){
    var alert = document.getElementById(`${alertIDName}`);
    if (alert.style == undefined) {
        return false;
    }

    alert.style.display = "block";
    return true;
}

function hideAlert(alertIDName){
    var alert = document.getElementById(`${alertIDName}`);
    if (alert.style == undefined) {
        return false;
    }

    alert.style.display = "none";
    return true;
}

async function postNewKeyInfo(newKeyInfo){    
    const rawResponse = await fetch("/pager-duty-keys", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(newKeyInfo),
        mode: "no-cors"
    });
}

function appendNewKeyInfoRow(table, newKeyInfo){    
    //console.log(table);
    const tableBody = table.getElementsByTagName("tbody")[0];
    const checkbox = $('<div class="form-check">').append($('<input class="form-check-input position-static" type="checkbox">'));
    const infoRow = $('<tr>');
    infoRow.append($('<td>').append(checkbox));

    for(var dictkey in newKeyInfo){
        infoRow.append($('<td>').append(newKeyInfo[dictkey]));
    }
    //console.log(infoRow);
    (infoRow).appendTo(tableBody);
}

function submitNewKeyForm(){
    hideAlert("uniqueNameAlert");
    hideAlert("missingFormInfoAlert");
    var keyName = document.getElementById('keyName').value;
    var hostName = document.getElementById('hostName').value;
    var keyValue = document.getElementById('key').value;

    var table = document.getElementById("pagerDutyTable");
    const rows = table.getElementsByTagName("tr");
    //console.log(rows);
    for(var i = 1; i<rows.length; i++){
        var existingKeyName = rows[i].getElementsByTagName("td")[1].textContent;
        //console.log(existingKeyName);
        
        if (keyName == existingKeyName){
            displayAlert("uniqueNameAlert")
            return false;
        }
    }
    if (keyName == '' | hostName == '' | keyValue == ''){
        displayAlert("missingFormInfoAlert");
        return false;
    }
    const newKeyInfo = {
        "name":keyName,
        "host":hostName,
        "key":keyValue
    }
    postNewKeyInfo(newKeyInfo);    
    //TODO refactor.
    table.removeChild(table.getElementsByTagName("tbody")[0]);
    table.removeChild(table.getElementsByTagName("thead")[0]);
    generatePagerDutyKeyTable(table);
    $("#newPagerDutyKeyForm")[0].reset();   
    return true;
}
