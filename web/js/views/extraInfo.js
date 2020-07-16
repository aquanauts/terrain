export default function(no) { 
    let view = template('extraInfoView');
    const table = view.find(".extraInfoTable").get(0);

    $(table).prepend($("<h1>").text(`Log Entry ${no} Error Details`));
    
    $.get("/get_error?id=" + no).then((errorInfo) => {  
        for(var key in errorInfo){
            const infoRow = $('<tr>');
            infoRow.append($('<td>').text(key));
            infoRow.append($('<td>').text(errorInfo[key]));
            $(table).append(infoRow)
        }
    });

    return view;
}

