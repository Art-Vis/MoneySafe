import { convertStringNumber } from "./convertStringNumber.js";

const financeForm = document.querySelector('.finance__form');
const financeAmount = document.querySelector('.finance__amount');
const financeReport = document.querySelector('.finance__report');

const report = document.querySelector('.report');
const reportClose = document.querySelector('.report__close');

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

financeReport.addEventListener('click', () => {
  if (!report.classList.contains('report__open')) {
    report.classList.add('report__open');
  }
});

reportClose.addEventListener('click', () => {
  if (report.classList.contains('report__open')) {
    report.classList.remove('report__open');
  }
});
