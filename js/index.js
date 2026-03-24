import { Decimal } from "../libs/decimal.mjs";
import {
  addRadioButtonFunction,
  checkEmptyValues,
  addInputErrorMessageTriggers,
  calculateValues,
  displayAmounts,
  getInputs,
} from "./functions.js";

const defaultValues = {
  bill: "",
  customTip: "",
  population: "",
  tipPerPerson: "0.00",
  totalPerPerson: "0.00",
};

addRadioButtonFunction();
addInputErrorMessageTriggers();
addTipCalculationFunctions();
delegateResetFuntion();
checkEmptyValues();

function addTipCalculationFunctions() {
  const inputElements = document.querySelectorAll(".element-input-number");

  inputElements.forEach((element) => {
    element.addEventListener("blur", () => {
      runDownTipCalculation();
    });
  });

  const buttonElements = document.querySelectorAll(".radiobutton-tip");

  buttonElements.forEach((element) => {
    element.addEventListener("click", () => {
      runDownTipCalculation();
    });
  });
}

function runDownTipCalculation() {
  const inputs = getInputs();

  const calculatedAmounts = calculateValues(inputs);

  displayAmounts(calculatedAmounts);
}

function delegateResetFuntion() {
  const button = document.getElementById("reset-button");

  button.addEventListener("click", () => {
    document.getElementById("input-bill").value = defaultValues.bill;

    const radiogroup = document.getElementById("radiogroup-tip");

    const selectedName = radiogroup.dataset.selected;

    if (selectedName !== "none") {
      document.getElementById(selectedName).classList.remove("selected");

      radiogroup.dataset.selected = "none";
    }

    const divCustomTip = document.getElementById("custom-tip");
    divCustomTip.setAttribute("hidden", "");
    divCustomTip.setAttribute("inert", "");

    document.getElementById("input-custom-tip").value = defaultValues.customTip;

    document.getElementById("input-population").value =
      defaultValues.population;

    document.getElementById("amount-tip").innerHTML =
      defaultValues.tipPerPerson;

    document.getElementById("amount-total").innerHTML =
      defaultValues.totalPerPerson;

    checkEmptyValues();
  });
}
