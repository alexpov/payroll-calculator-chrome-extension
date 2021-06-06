function StringToNumber(str) {
    return (str.trim() == '') ? 0 : Number.parseFloat(str.replace(/,/g, ''));
}

function NumberToString(number) {
    return number.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function CreateSummaryDivHtml(bankPayment, social, taxes, totalCost) {
    return '<div id = "idNewDiv">' +
        '<div style="width : 50%; display:inline-block"> ' +
        '<table style="width : 40%; border: none;"><tbody>' +
        '<tr><td style="border: none;">בבנק</td><td style="border: none;">' + bankPayment + '</td></tr>' +
        '<tr><td style="border: none;">סוציאליות</td><td style="border: none;">' + social + '</td></tr>' +
        '<tr><td style="border: none;">מיסים</td><td style="border: none;">' + taxes + '</td></tr>' +
        '<tr><td style="border: none;">סה"כ עלות מעסיק</td>' + totalCost + ' </tr>' +
        '</tbody></table>' +
        '</div>' +
        '<div style="width : 50%; display:inline-block; vertical-align: top; text-align: left;">מוצג על ידי תוסף הרחבה' +
        '<img style="float: left; margin-left: 20px; margin-right: 20px;" src="' + chrome.extension.getURL('assets/icons/icon_32.png') + '">' +
        '</div>' +
        '</div>';
}

function CreateTotalCostTextHtml(totalCost, totalCostVerify) {
    return (totalCostVerify == totalCost) ?
        '<td style="border: none; color: green;">' + NumberToString(totalCostVerify) + '</td>' :
        '<td class="tooltip" style="border: none; color: red;">' + NumberToString(totalCostVerify) + '<span class="tooltiptext">סים לב! סכום כולל של מיסים, הפרשות סוציאליות ונטו, אינו תואם את עלות המעסיק</span></td>';
}

function GetElemValue(selector) {
    const elementPsErPensAmt = document.querySelector(selector);
    return (elementPsErPensAmt) ? StringToNumber(elementPsErPensAmt.textContent) : 0;
}

const bankPayment = GetElemValue('#EX_NET');

const socialGemel = GetElemValue('#PS_ER_PENS_AMT');
const socialHishtalmut = GetElemValue('#PS_ER_STDY_FND_AMT');
const socialPizuim = GetElemValue('#PS_ER_COPMNS_AMT');
const socialGemelEmployee = GetElemValue('#PS_EE_PENS_AMT');
const socialHishtalmutEmployee = GetElemValue('#PS_EE_STDY_FND_AMT');
const socialTotal = socialGemel + socialHishtalmut + socialPizuim + socialGemelEmployee + socialHishtalmutEmployee;

const taxBetuahLeumi = GetElemValue('#PS_EX_ER_CONT_NI');
const taxIncomeEmployee = GetElemValue('#EX_TAX_DED');
const taxBetuahLeumiEmployee = GetElemValue('#EX_NI_DED');
const taxHealthEmployee = GetElemValue('#EX_HI_DED');
const taxTotal = taxBetuahLeumi + taxIncomeEmployee + taxBetuahLeumiEmployee + taxHealthEmployee;

const totalCostVerify = (bankPayment + socialTotal + taxTotal).toFixed(2);
const totalCost = GetElemValue('#PS_EX_COST').toFixed(2);

const totalCostTextHtml = CreateTotalCostTextHtml(totalCost, totalCostVerify);
const resTable = document.querySelector('#paySlip');
const rightElement = resTable.querySelector('.rightside');
const ourDiv = document.createElement('div');

resTable.insertBefore(ourDiv, rightElement);
ourDiv.outerHTML = CreateSummaryDivHtml(NumberToString(bankPayment), NumberToString(socialTotal), NumberToString(taxTotal), totalCostTextHtml);
