// https://calc.malam-payroll.com/neto.php

function strToFloat(str) {
    return (str.trim() == '') ? 0 : parseFloat(str.replace(/,/g, ''));
}

function floatFormat(number) {
    return number.toLocaleString("en-US", {maximumFractionDigits: 2});
}

function sum(arr) {
    return parseFloat(arr.reduce((acc, cur) => acc + cur, 0));
}

function createSummaryDivHtml(bankPayment, hishtalmut, socialTotal, taxesTotal, totalCost) {
    return `<div id = "idNewDiv">
            <div style="width : 48%; display:inline-block">
                <table class="mytable" style="width : 50%;">
                    <tbody>
                        <tr><td>נטו</td><td>${floatFormat(bankPayment)}</td></tr>
                        <tr><td>נטו + השתלמות</td><td>${floatFormat(sum([bankPayment, hishtalmut]))}</td></tr>
                        <tr><td style="color: green">נטו + כל הסוציאליות</td><td style="color: green">${floatFormat(sum([bankPayment, socialTotal]))}</td></tr>
                        <tr><td>סוציאליות</td><td>${floatFormat(socialTotal)}</td></tr>
                        <tr><td>מיסים</td><td>${floatFormat(taxesTotal)}</td></tr>
                        <tr><td>עלות מעסיק</td>${floatFormat(totalCost)}</tr>
                    </tbody>
                </table>
            </div>
            </div>`;
}

function createTotalCostTextHtml(totalCost, totalCostVerify) {
    return (totalCostVerify.toFixed(2) == totalCost.toFixed(2)) ?
        `<td style="border: none">${floatFormat(totalCostVerify)}</td>` :
        `<td class="tooltip" style="color: red; border: none">
            ${floatFormat(totalCostVerify)}
            <span class="tooltiptext">סים לב! חישוב עלות המעסיק של התוסף שונה מזה של המחשבון. כנראה טעות בתוסף. נשמח לתקן :) מוזמן לשלוח מייל ל baziliq08@gmail.com</span>
         </td>`;
}

function queryFloat(selector) {
    const elementPsErPensAmt = document.querySelector(selector);
    return elementPsErPensAmt
        ? strToFloat(elementPsErPensAmt.textContent)
        : 0;
}

function injectSummaryHtml(summaryHtml) {
    const resTable = document.querySelector("#paySlip");
    const rightElement = resTable.querySelector(".rightside");
    const ourDiv = document.createElement("div");

    resTable.insertBefore(ourDiv, rightElement);
    ourDiv.outerHTML = summaryHtml;
}

const bankPayment = queryFloat("#EX_NET");

const socialPizuim = queryFloat("#PS_ER_COPMNS_AMT");
const socialGemel = queryFloat("#PS_ER_PENS_AMT");
const socialGemelEmployee = queryFloat("#PS_EE_PENS_AMT");
const socialHishtalmut = queryFloat("#PS_ER_STDY_FND_AMT");
const socialHishtalmutEmployee = queryFloat("#PS_EE_STDY_FND_AMT");

const hishtalmutTotal = sum([socialHishtalmut, socialHishtalmutEmployee])

const socialTotal = sum([
    socialGemel,
    socialHishtalmut,
    socialPizuim,
    socialGemelEmployee,
    socialHishtalmutEmployee,
]);

const taxBetuahLeumi = queryFloat("#PS_EX_ER_CONT_NI");
const taxIncomeEmployee = queryFloat("#EX_TAX_DED");
const taxBetuahLeumiEmployee = queryFloat("#EX_NI_DED");
const taxHealthEmployee = queryFloat("#EX_HI_DED");

const taxTotal = sum([
    taxBetuahLeumi,
    taxIncomeEmployee,
    taxBetuahLeumiEmployee,
    taxHealthEmployee,
]);

const totalCostVerify = sum([bankPayment, socialTotal, taxTotal]);
const totalCost = queryFloat("#PS_EX_COST");

injectSummaryHtml(createSummaryDivHtml(
    bankPayment,
    hishtalmutTotal,
    socialTotal,
    taxTotal,
    createTotalCostTextHtml(totalCost, totalCostVerify)
))
