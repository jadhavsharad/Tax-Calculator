document.addEventListener("DOMContentLoaded", function () {
  // Initialize tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


  const grossIncomeInput = document.querySelector("#gross-income input");
  const extraIncomeInput = document.querySelector("#extra-income input");
  const modal = document.getElementById("calulationModal");
  const totalDeductionsInput = document.querySelector(
    "#total-applicable-deductions input"
  );
  const ageGroupSelect = document.getElementById("age-group");
  const modalBody = document.querySelector(".modal-body");
  const calculateBtn = document.getElementById("calculate-btn");

  const inputs = document.querySelectorAll('.income-form input[type="text"]');

  // Validation for each input for numeric entries
  inputs.forEach((input, index) => {
    const errorIcon = input.nextElementSibling; // Get the icon right next to the input
    input.addEventListener("input", function () {
      if (input.value.trim() !== "" && isNaN(input.value)) {
        errorIcon.classList.remove("invisible");
        errorIcon.classList.add('visible')
      } else {
        errorIcon.classList.add("invisible");
        errorIcon.classList.remove('visible')
      }
    });
  });

  // Validation for the age group select
  ageGroupSelect.addEventListener("change", function () {
    const errorIcon = this.nextElementSibling; // assuming error icon is next to select
    if (!this.value) {
      errorIcon.classList.remove("invisible");
    } else {
      errorIcon.classList.add("invisible");
    }
  });

  // Calculate tax
  calculateBtn.addEventListener("click", function () {
    let isValid = true;
    inputs.forEach((input) => {
      const errorIcon = input.nextElementSibling;
      if (
        isNaN(parseFloat(input.value)) ||
        !errorIcon.classList.contains("invisible")
      ) {
        isValid = false; // Input is not valid
      }
    });

    if (!ageGroupSelect.value) {
      const errorIcon = ageGroupSelect.nextElementSibling;
      errorIcon.classList.remove("invisible");
      isValid = false;
    }

    if (!isValid) {
      alert("Please correct the errors before calculating.");
      return;
    }

    const grossIncome = parseFloat(grossIncomeInput.value) || 0;
    const extraIncome = parseFloat(extraIncomeInput.value) || 0;
    const totalApplicableDeductions =
      parseFloat(totalDeductionsInput.value) || 0;

    const overallIncome = grossIncome + extraIncome - totalApplicableDeductions;
    let taxRate = 0;
    let taxPayable = 0;

    if (overallIncome > 800000) {
      // Income threshold of 8 Lakhs
      switch (ageGroupSelect.value) {
        case "<40":
          taxRate = 0.3;
          break;
        case "40-59":
          taxRate = 0.4;
          break;
        case ">=60":
          taxRate = 0.1;
          break;
      }
      taxPayable = taxRate * (overallIncome - 800000);
    }

    // Inserting results into the modal body
    modalBody.innerHTML = `<p>Total Income: ${overallIncome.toLocaleString()}</p>
                              <p>Tax Payable: ${taxPayable.toLocaleString()}</p>`;

    // Show the modal
    modal.style.display = "block";
    modal.classList.add("show");
  });

  // Close modal logic
  window.onclick = function (event) {
    if (
      event.target == modal ||
      event.target.getAttribute("data-bs-dismiss") === "modal"
    ) {
      modal.style.display = "none";
      modal.classList.remove("show");
    }
  };
});
