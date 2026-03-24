import { describe, it, expect } from "vitest";
import { Decimal } from "../libs/decimal.mjs";
import {
  addRadioButtonFunction,
  addInputErrorMessageTriggers,
  calculateValues,
  displayAmounts,
  getInputs,
} from "../js/functions.js";

document.body.innerHTML = `<main>
  <section id="input-section">
    <div id="bill" class="input-wrapper input-number">
      <div>
        <label for="input-bill" class="input-title">Bill</label>
        <span id="error-bill" class="error-message" hidden inert
          >Can't be zero</span
        >
      </div>
      <div>
        <img src="./images/icon-dollar.svg" alt="icon-dollar" />
        <input
          type="number"
          id="input-bill"
          class="input-required element-input-number"
          aria-errormessage="error-bill"
          placeholder="0"
          required
        />
      </div>
    </div>
    <div id="tip-percent" class="input-wrapper">
      <span id="tip-title" class="input-title">Select Tip %</span>
      <div
        id="radiogroup-tip"
        role="radiogroup"
        data-selected="none"
        aria-labelledby="tip-title"
      >
        <button
          id="radio1"
          class="radiobutton-tip"
          aria-checked="false"
          role="radio"
          data-tip="5"
        >
          5%
        </button>
        <button
          id="radio2"
          class="radiobutton-tip"
          aria-checked="false"
          role="radio"
          data-tip="10"
        >
          10%
        </button>
        <button
          id="radio3"
          class="radiobutton-tip"
          aria-checked="false"
          role="radio"
          data-tip="15"
        >
          15%
        </button>
        <button
          id="radio4"
          class="radiobutton-tip"
          aria-checked="false"
          role="radio"
          data-tip="25"
        >
          25%
        </button>
        <button
          id="radio5"
          class="radiobutton-tip"
          aria-checked="false"
          role="radio"
          data-tip="50"
        >
          50%
        </button>
        <button
          id="radio6"
          class="radiobutton-tip"
          aria-checked="false"
          role="radio"
          data-tip="custom"
        >
          Custom
        </button>
      </div>
    </div>
    <div id="custom-tip" class="input-wrapper input-number" hidden inert>
      <label for="input-custom-tip" class="input-title">Custom Tip</label>
      <div>
        <input
          type="number"
          id="input-custom-tip"
          class="element-input-number"
          placeholder="0"
        />
        <span>%</span>
      </div>
    </div>
    <div id="population" class="input-wrapper input-number">
      <div>
        <label for="input-population" class="input-title"
          >Number of People</label
        >
        <span id="error-population" class="error-message" hidden inert
          >Can't be Zero</span
        >
      </div>
      <div>
        <img src="./images/icon-person.svg" alt="icon-person" />
        <input
          type="number"
          id="input-population"
          class="input-required element-input-number"
          aria-errormessage="error-population"
          placeholder="0"
          required
        />
      </div>
    </div>
  </section>
  <section id="output-section">
    <div>
      <div id="tip-amount" class="amount-wrapper">
        <div>
          <span class="amount-title">Tip Amount</span>
          <span class="amount-context">/ person</span>
        </div>
        <span class="amount-amount"
          ><span>$</span><span id="amount-tip">0.00</span></span
        >
      </div>
      <div id="split-amount" class="amount-wrapper">
        <div>
          <span class="amount-title">Total</span>
          <span class="amount-context">/ person</span>
        </div>
        <span class="amount-amount"
          ><span>$</span><span id="amount-total">0.00</span></span
        >
      </div>
    </div>
    <button id="reset-button">RESET</button>
  </section>
</main>`;

describe("tip amount button click", () => {
  addRadioButtonFunction();

  const radiogroup = document.getElementById("radiogroup-tip");
  const radiobuttons = document.querySelectorAll(".radiobutton-tip");

  it("how it should start", () => {
    let selected = 0;

    for (let i = 0; i < radiobuttons.length; i++) {
      const radioButton = radiobuttons[0];

      if (radioButton.classList.contains("selected")) {
        selected++;
      }
    }

    expect(radiogroup.dataset.selected).toBe("none");
    expect(selected).toBe(0);
  });

  it("when button is clicked with none selected before", () => {
    const radiobutton = radiobuttons[0]; // Representative

    radiobutton.click();

    expect(radiobutton.classList.contains("selected")).toBe(true);
    expect(radiobutton.getAttribute("aria-checked")).toBe("true");
    expect(radiogroup.dataset.selected === radiobutton.id).toBe(true);
  });

  it("already selected button does not get selected again", () => {
    const radiobutton = radiobuttons[0]; // Representative

    let clicked = 0;

    radiobutton.addEventListener("click", () => {
      clicked++;
    });

    radiobutton.click();

    radiobutton.click();

    expect(clicked).toBe(2);
    expect(radiobutton.classList.contains("selected")).toBe(true);
    expect(radiobutton.getAttribute("aria-checked")).toBe("true");
    expect(radiogroup.dataset.selected === radiobutton.id).toBe(true);
  });

  it("updates the current selection", () => {
    const previousButton = radiobuttons[0]; // Previous button pressed
    const newButton = radiobuttons[1]; // New button pressed

    previousButton.click();

    newButton.click();

    expect(previousButton.classList.contains("selected")).toBe(false);
    expect(previousButton.getAttribute("aria-checked")).toBe("false");
    expect(radiogroup.dataset.selected === previousButton.id).toBe(false);

    expect(newButton.classList.contains("selected")).toBe(true);
    expect(newButton.getAttribute("aria-checked")).toBe("true");
    expect(radiogroup.dataset.selected === newButton.id).toBe(true);
  });

  it("Custom button opens the Custom Tip input, then when another is clicked", () => {
    const inputCustomTip = document.getElementById("custom-tip");
    const inputCustomButton = document.getElementById("radio6");

    inputCustomButton.click();

    expect(inputCustomTip.hasAttribute("hidden")).toBe(false);
    expect(inputCustomTip.hasAttribute("inert")).toBe(false);

    radiobuttons[0].click();

    expect(inputCustomTip.hasAttribute("hidden")).toBe(true);
    expect(inputCustomTip.hasAttribute("inert")).toBe(true);
  });
});

describe("error messages", () => {
  addInputErrorMessageTriggers();

  function checkErrorDisplay(inputId, errorId) {
    const bill = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    bill.value = "";
    bill.dispatchEvent(new Event("blur"));

    expect(error.hasAttribute("hidden")).toBe(false);
    expect(error.hasAttribute("inert")).toBe(false);
    expect(bill.getAttribute("aria-invalid")).toBe("true");

    bill.value = "1";
    bill.dispatchEvent(new Event("blur"));

    expect(error.hasAttribute("hidden")).toBe(true);
    expect(error.hasAttribute("inert")).toBe(true);
    expect(bill.getAttribute("aria-invalid")).toBe("false");
  }

  it("bill input", () => {
    checkErrorDisplay("input-bill", "error-bill");
  });

  it("population input", () => {
    checkErrorDisplay("input-population", "error-population");
  });
});

describe("tip calculation", () => {
  it.todo("should reject negative numbers");
  it("calculation", () => {
    const bill1 = {
      bill: new Decimal(100),
      tip: new Decimal(0.15),
      population: new Decimal(2),
    };

    expect(Number(calculateValues(bill1).tip)).toBe(7.5);
    expect(Number(calculateValues(bill1).total)).toBe(57.5);

    const bill2 = {
      bill: new Decimal(200),
      tip: new Decimal(0.2),
      population: new Decimal(5),
    };

    expect(Number(calculateValues(bill2).tip)).toBe(8);
    expect(Number(calculateValues(bill2).total)).toBe(48);

    const bill3 = {
      bill: new Decimal(100),
      tip: new Decimal(0.15),
      population: new Decimal(3),
    };

    expect(Number(calculateValues(bill3).tip)).toBe(5);
    expect(Number(calculateValues(bill3).total)).toBe(38.33);
  });

  it("rejects zeroes", () => {
    const zeroBill = {
      bill: new Decimal(0),
      tip: new Decimal(15),
      population: new Decimal(2),
    };

    expect(Number(calculateValues(zeroBill).tip)).toBe(0);
    expect(Number(calculateValues(zeroBill).total)).toBe(0);

    const zeroTip = {
      bill: new Decimal(100),
      tip: new Decimal(0),
      population: new Decimal(2),
    };

    expect(Number(calculateValues(zeroTip).tip)).toBe(0);
    expect(Number(calculateValues(zeroTip).total)).toBe(50);

    const zeroPopulation = {
      bill: new Decimal(100),
      tip: new Decimal(15),
      population: new Decimal(0),
    };

    expect(Number(calculateValues(zeroPopulation).tip)).toBe(Infinity);
    expect(Number(calculateValues(zeroPopulation).total)).toBe(Infinity);
  });
});

describe("displaying amounts", () => {
  it("normal amounts", () => {
    const Tip1 = document.getElementById("amount-tip");
    const Total1 = document.getElementById("amount-total");

    const object1 = {
      tip: 5,
      total: 115,
    };

    displayAmounts(object1);

    expect(Tip1.textContent).toBe("5.00");
    expect(Total1.textContent).toBe("115.00");

    const Tip2 = document.getElementById("amount-tip");
    const Total2 = document.getElementById("amount-total");

    const object2 = {
      tip: 13,
      total: 575.2,
    };

    displayAmounts(object2);

    expect(Tip2.textContent).toBe("13.00");
    expect(Total2.textContent).toBe("575.20");
  });

  it("if error", () => {
    expect(displayAmounts("error")).toBe(undefined);
  });
});

describe("getting inputs", () => {
  it("normal input non-custom tip", () => {
    document.getElementById("input-bill").value = 1000;
    document.getElementById("radiogroup-tip").dataset.selected = "radio3";
    document.getElementById("input-population").value = 3;

    expect(getInputs()).toStrictEqual({
      bill: new Decimal(1000),
      tip: new Decimal(0.15),
      population: new Decimal(3),
    });
  });

  it("normal input non-custom tip", () => {
    document.getElementById("input-bill").value = 1000;
    document.getElementById("radiogroup-tip").dataset.selected = "radio6";
    document.getElementById("input-custom-tip").value = 15;
    document.getElementById("input-population").value = 3;

    expect(getInputs()).toStrictEqual({
      bill: new Decimal(1000),
      tip: new Decimal(0.15),
      population: new Decimal(3),
    });
  });

  it("zero bill", () => {
    document.getElementById("input-bill").value = 0;
    document.getElementById("radiogroup-tip").dataset.selected = "radio3";
    document.getElementById("input-population").value = 3;

    expect(getInputs()).toBe("error");
  });

  it("zero tip custom", () => {
    document.getElementById("input-bill").value = 1000;
    document.getElementById("radiogroup-tip").dataset.selected = "radio6";
    document.getElementById("input-custom-tip").value = 0;
    document.getElementById("input-population").value = 3;

    expect(getInputs()).toBe("error");
  });

  it("zero population", () => {
    document.getElementById("input-bill").value = 1000;
    document.getElementById("radiogroup-tip").dataset.selected = "radio3";
    document.getElementById("input-population").value = 0;

    expect(getInputs()).toBe("error");
  });

  it("empty bill", () => {
    document.getElementById("input-bill").value = "";
    document.getElementById("radiogroup-tip").dataset.selected = "radio3";
    document.getElementById("input-population").value = 3;

    expect(getInputs()).toBe("error");
  });

  it("zero tip custom", () => {
    document.getElementById("input-bill").value = 1000;
    document.getElementById("radiogroup-tip").dataset.selected = "radio6";
    document.getElementById("input-custom-tip").value = "";
    document.getElementById("input-population").value = 3;

    expect(getInputs()).toBe("error");
  });

  it("empty bill", () => {
    document.getElementById("input-bill").value = 1000;
    document.getElementById("radiogroup-tip").dataset.selected = "radio3";
    document.getElementById("input-population").value = "";

    expect(getInputs()).toBe("error");
  });

  it.todo("supposed to reject negative amounts");
});
