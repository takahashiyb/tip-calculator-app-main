addRadioButtonFunction();
addInputErrorMessageTriggers();

function addRadioButtonFunction() {
  const radiogroup = document.getElementById("radiogroup-tip");
  const radiobuttons = document.querySelectorAll(".radiobutton-tip");

  radiobuttons.forEach((radiobutton) => {
    radiobutton.addEventListener("click", function () {
      const previous = radiogroup.dataset.selected;
      this.classList.add("selected");
      radiogroup.dataset.selected = this.id;

      if (previous !== "none") {
        const elementPrevious = document.getElementById(previous);
        elementPrevious.classList.remove("selected");
      }

      if (this.id === "radio6") {
        const inputCustomTip = document.getElementById("custom-tip");
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
