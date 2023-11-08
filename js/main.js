import { getData } from "./api.js";
import { convertStringNumber, reformatDate } from "./helper.js";

const typesOperation = {
  income: 'Доход',
  expenses: 'Расход',
};

const financeForm = document.querySelector('.finance__form');
const financeAmount = document.querySelector('.finance__amount');
const financeReport = document.querySelector('.finance__report');
const reportOperationList = document.querySelector('.report__operation-list');

const report = document.querySelector('.report');
const reportDates = document.querySelector('.report__dates');


let amount = 0;
financeAmount.textContent = amount;

financeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const typeOpeartion = e.submitter.dataset.typeOperation;

  const changeAmount = Math.abs(convertStringNumber(financeForm.amount.value));

  if (typeOpeartion === 'income') {
    amount += changeAmount;
  }

  if (typeOpeartion === 'expenses') {
    amount -= changeAmount;
  }

  financeAmount.textContent = `${amount.toLocaleString()} ₽`;
});

const closeReport = ({ target }) => {
  if (target.closest('.report__close') || !target.closest('.report') && target !== financeReport) {
    report.classList.remove('report__open');
    document.removeEventListener('click', closeReport);
  }
};

const openReport = () => {
  report.classList.add('report__open');
  document.addEventListener('click', closeReport);
};

const renderReport = (data) => {
  reportOperationList.textContent = '';

  const reportRows = data.map(({category,amount,description,date,type}) => {
    const reportRow = document.createElement('tr');
    reportRow.classList.add('report__row');
    reportRow.innerHTML = `
      <td class="report__cell">${category}</td>
      <td class="report__cell" style="text-align:end">${amount.toLocaleString()}&nbsp;₽</td>
      <td class="report__cell">${description}</td>
      <td class="report__cell">${reformatDate(date)}</td>
      <td class="report__cell">${typesOperation[type]}</td>
      <td class="report__action-cell">
        <button
          class="report__button report__button_table">&#10006;</button>
      </td>
    `;
    
    return reportRow;
  });

  reportOperationList.append(...reportRows);
};

financeReport.addEventListener('click', async () => {
  openReport();

  const data = await getData('/test');
  renderReport(data);
});


reportDates.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(reportDates));
  console.log('formData: ', formData);

  const searchParams = new URLSearchParams();

  if (formData.startDate) {
    searchParams.append('startDate', formData.startDate);
  }

  if (formData.endtDate) {
    searchParams.append('endtDate', formData.endDate);
  }

  const queryString = searchParams.toString();
  const url = queryString ? `/test?${queryString}` : '/test';

  const data = await getData(url);
  renderReport(data);
});