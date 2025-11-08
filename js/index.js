import { Decimal } from "../node_modules/decimal.mjs";

addRadioButtonFunction();
addInputErrorMessageTriggers();
addTipCalculationFunctions();

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
      } else {
        errorMessage.setAttribute("hidden", "");
        errorMessage.setAttribute("inert", "");
      }
    });
  });
}

document.getElementById("input-bill").value = 142.55;
document.getElementById("input-population").value = 5;

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
  const bill = new Decimal(document.getElementById("input-bill").value);

  const elementSelectedTipId =
    document.getElementById("radiogroup-tip").dataset.selected;
  let tip = new Decimal("0");

  if (elementSelectedTipId === "none") {
  } else if (elementSelectedTipId === "radio6") {
    tip = new Decimal(document.getElementById("input-custom-tip").value / 100);
  } else {
    tip = new Decimal(
      document.getElementById(elementSelectedTipId).dataset.tip / 100
    );
  }

  const population = new Decimal(
    document.getElementById("input-population").value
  );

  return {
    bill: bill,
    tip: tip,
    population: population,
  };
}

function calculateValues(inputs) {
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
  const tip = objectValues.tip;
  const total = objectValues.total;

  const elementAmountTip = document.getElementById("amount-tip");

  const elementAmountTotal = document.getElementById("amount-total");

  elementAmountTip.innerHTML = tip.toFixed(2);
  elementAmountTotal.innerHTML = total.toFixed(2);
}
