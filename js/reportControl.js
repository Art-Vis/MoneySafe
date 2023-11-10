import { deleteData, getData } from "./api.js";
import { financeControl } from "./financeControl.js";
import { clearChart, generateChart } from "./generateChart.js";
import { reformatDate } from "./helper.js";

const typesOperation = {
  income: 'Доход',
  expenses: 'Расход',
};

let actualData = [];

const financeReport = document.querySelector('.finance__report');
const reportOperationList = document.querySelector('.report__operation-list');

const report = document.querySelector('.report');
const reportDates = document.querySelector('.report__dates');

const generateChartButton = document.querySelector('#generateChartButton');

const closeReport = ({ target }) => {
  if (target.closest('.report__close') || !target.closest('.report') && target !== financeReport) {
    gsap.to(report, {
      opacity: 0,
      scale: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete() {
        report.style.visibility = 'hidden';
      },
    });
    document.removeEventListener('click', closeReport);
  }
};

const openReport = () => {
  report.style.visibility = 'visible';

  gsap.to(report, {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: 'power2.out',
  });

  document.addEventListener('click', closeReport);
};

const renderReport = (data) => {
  reportOperationList.textContent = '';

  const reportRows = data.map(({ category, amount, description, date, type, id }) => {
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
    class="report__button report__button_table" data-id=${id}>&#10006;</button>
    </td>
    `;

    return reportRow;
  });

  reportOperationList.append(...reportRows);
};

export const reportControl = () => {
  reportOperationList.addEventListener('click', async ({ target }) => {
    const buttonDel = target.closest('.report__button_table');
    const operationId = target.dataset.id;

    if (buttonDel) {
      await deleteData('/finance',operationId);

      const reportRow = buttonDel.closest('.report__row');
      reportRow.remove();
      financeControl();
      clearChart();
    } else {
      return;
    }
  });

  financeReport.addEventListener('click', async () => {
    openReport();

    actualData = await getData('/finance');
    renderReport(actualData);
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
    const url = queryString ? `/finance?${queryString}` : '/finance';

    actualData = await getData(url);
    renderReport(actualData);
    clearChart();
  });
};


generateChartButton.addEventListener('click', () => {
  generateChart(actualData);
});