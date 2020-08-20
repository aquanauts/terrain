export default function () {
    let view = template('pagerDutyView');
    const table = view.find('table');
    generatePagerDutyKeyTable(table);
    return view;
}
//TODO use class names instead of ids 
