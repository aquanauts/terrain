export default function () {
    let view = template('pagerDutyView');
    const table = view.find('#pagerDutyTable');
    generatePagerDutyKeyTable(table);
    const newKeySubmitButton = view.find("#newKeyInfoButton");
    const deleteKeysButton =  view.find("#deleteKeysButton");    
    newKeySubmitButton.attr('onclick', 'submitNewKeyForm()');
    deleteKeysButton.attr('onclick', 'deleteSelectedRows()');
    return view;
}
