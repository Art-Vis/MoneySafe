import { getData, postData } from "./api.js";
import { animationNumber, convertStringNumber } from "./helper.js";

const financeForm = document.querySelector('.finance__form');
const financeAmount = document.querySelector('.finance__amount');

let amount = 0;
financeAmount.textContent = amount;

const addNewOperation = async (e) => {
    e.preventDefault();
  
    const typeOpeartion = e.submitter.dataset.typeOperation;

    const financeFormDate = Object.fromEntries(new FormData(financeForm));
    financeFormDate.type = typeOpeartion;

    const newOperation = await postData('/finance', financeFormDate);
    console.log('newOperation: ', newOperation);
  
    const changeAmount = Math.abs(convertStringNumber(newOperation.amount));
  
    if (typeOpeartion === 'income') {
      amount += changeAmount;
    }
  
    if (typeOpeartion === 'expenses') {
      amount -= changeAmount;
    }
  
    animationNumber(financeAmount, amount);
    financeForm.reset();
}

export const financeControl = async () => {
  const operations = await getData('/finance');

  amount = operations.reduce((acc, item) => {
    if (item.type === 'income') {
      acc += convertStringNumber(item.amount);
    }
    if (item.type === 'expenses') {
      acc -= convertStringNumber(item.amount);
    }

    return acc;
  }, 0);

  animationNumber(financeAmount, amount);

  financeForm.addEventListener('submit', addNewOperation);
};