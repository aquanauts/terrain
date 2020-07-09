export default function(no) { 
    let view = template('extraInfoView');
    const table = view.find(".extraInfoTable").get(0);
    $.get("/get_error?id=" + no).then((errorInfo) => {  
        //$(container).append("Entry number: "+ no.toString())
        for(var key in errorInfo){
            const infoRow = $('<tr>');
            infoRow.append($('<td>').text(key));
            infoRow.append($('<td>').text(errorInfo[key]));
            $(table).append(infoRow)
        }
    });

    return view;
}

