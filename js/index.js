import { Decimal } from "../node_modules/decimal.mjs";

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

function addRadioButtonFunction() {
  const radiogroup = document.getElementById("radiogroup-tip");
  const radiobuttons = document.querySelectorAll(".radiobutton-tip");

  radiobuttons.forEach((radiobutton) => {
    radiobutton.addEventListener("click", function () {
      const previous = radiogroup.dataset.selected;

      if (this.id === previous) {
        return;
      }

      this.classList.add("selected");
      radiogroup.dataset.selected = this.id;

      if (previous !== "none") {
        const elementPrevious = document.getElementById(previous);
        elementPrevious.classList.remove("selected");
      }

      const inputCustomTip = document.getElementById("custom-tip");

      if (previous === "radio6") {
        inputCustomTip.setAttribute("hidden", "");
        inputCustomTip.setAttribute("inert", "");
      }

      if (this.id === "radio6") {
        inputCustomTip.removeAttribute("hidden");
        inputCustomTip.removeAttribute("inert");
      }

      checkEmptyValues();
    });
  });
}

function addInputErrorMessageTriggers() {
  const inputRequired = document.querySelectorAll(".input-required");

  inputRequired.forEach((input) => {
    input.addEventListener("blur", function () {
      const errorMessageName = this.getAttribute("aria-errormessage");
      const errorMessage = document.getElementById(errorMessageName);
      if (!this.value || this.value === "0") {
        errorMessage.removeAttribute("hidden");
        errorMessage.removeAttribute("inert");
        this.setAttribute("aria-invalid", "true");
      } else {
        errorMessage.setAttribute("hidden", "");
        errorMessage.setAttribute("inert", "");
        this.setAttribute("aria-invalid", "false");
      }
      checkEmptyValues();
    });
  });
}

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

function getInputs() {
  const bill = document.getElementById("input-bill").value;

  const elementSelectedTipId =
    document.getElementById("radiogroup-tip").dataset.selected;
  let tip = 0;

  if (elementSelectedTipId === "none") {
  } else if (elementSelectedTipId === "radio6") {
    tip = document.getElementById("input-custom-tip").value / 100;
  } else {
    tip = document.getElementById(elementSelectedTipId).dataset.tip / 100;
  }

  const population = document.getElementById("input-population").value;

  if (
    !bill ||
    !tip ||
    !population ||
    bill === "0" ||
    tip === "0" ||
    population === "0"
  ) {
    return "error";
  } else {
    return {
      bill: new Decimal(bill),
      tip: new Decimal(tip),
      population: new Decimal(population),
    };
  }
}

function calculateValues(inputs) {
  if (inputs === "error") {
    return "error";
  }

  const bill = inputs.bill;
  const tip = inputs.tip;
  const population = inputs.population;

  const amountTotalTip = bill.mul(tip);

  const amountPerTip = amountTotalTip
    .div(population)
    .toDecimalPlaces(2, Decimal.ROUND_FLOOR);
  const amountTotalTotal = bill.add(amountTotalTip);

  const amountPerTotal = amountTotalTotal.div(population).toDecimalPlaces(2);

  return {
    tip: amountPerTip,
    total: amountPerTotal,
  };
}

function displayAmounts(objectValues) {
  const elementAmountTip = document.getElementById("amount-tip");

  const elementAmountTotal = document.getElementById("amount-total");

  if (objectValues === "error") {
    const zero = new Decimal("0");
    elementAmountTip.innerHTML = zero.toFixed(2);
    elementAmountTotal.innerHTML = zero.toFixed(2);
    return;
  }

  const tip = objectValues.tip;
  const total = objectValues.total;

  elementAmountTip.innerHTML = tip.toFixed(2);
  elementAmountTotal.innerHTML = total.toFixed(2);
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

function checkEmptyValues() {
  let noValues = true;

  const input = document.querySelectorAll(".input-required");

  input.forEach((element) => {
    if (element.value !== "") {
      noValues = false;
    }
  });

  const radiogroup = document.getElementById("radiogroup-tip");

  if (radiogroup.dataset.selected !== "none") {
    noValues = false;
  }

  const button = document.getElementById("reset-button");

  if (noValues === false) {
    button.removeAttribute("inert");
  } else {
    button.setAttribute("inert", "");
  }
}

document.getElementById("input-bill").value = 142.55;
document.getElementById("input-population").value = 5;
document.getElementById("radio3").dispatchEvent(new Event("click"));
