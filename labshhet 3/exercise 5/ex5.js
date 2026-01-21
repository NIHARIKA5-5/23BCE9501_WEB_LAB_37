let currentStage = 0;
const stages = document.querySelectorAll(".stage");
const progressBar = document.getElementById("progressBar");

/* Temporary storage */
let formData = {
  name: "",
  email: "",
  password: ""
};

/* Show stage */
function showStage(index) {
  stages.forEach(stage => stage.classList.remove("active"));
  stages[index].classList.add("active");
  progressBar.style.width = ((index + 1) / stages.length) * 100 + "%";
}

/* Validation per stage */
function validateStage() {
  let valid = true;

  // Clear errors
  document.querySelectorAll(".error").forEach(e => e.innerText = "");

  if (currentStage === 0) {
    let name = document.getElementById("name").value.trim();
    if (name === "") {
      document.getElementById("nameError").innerText = "Name is required";
      valid = false;
    } else {
      formData.name = name;
    }
  }

  if (currentStage === 1) {
    let email = document.getElementById("email").value.trim();
    if (email === "") {
      document.getElementById("emailError").innerText = "Email is required";
      valid = false;
    } else {
      formData.email = email;
    }
  }

  if (currentStage === 2) {
    let password = document.getElementById("password").value;
    if (password.length < 6) {
      document.getElementById("passwordError").innerText =
        "Password must be at least 6 characters";
      valid = false;
    } else {
      formData.password = password;
    }
  }

  return valid;
}

/* Navigation */
function nextStage() {
  if (validateStage()) {
    currentStage++;

    // If entering review stage, update review data
    if (currentStage === 3) {
      updateReview();
    }

    showStage(currentStage);
  }
}


function prevStage() {
  currentStage--;
  showStage(currentStage);
}

function updateReview() {
  document.getElementById("reviewName").innerText = formData.name;
  document.getElementById("reviewEmail").innerText = formData.email;
  document.getElementById("reviewPassword").innerText =
    "*".repeat(formData.password.length);
}

/* Prevent submit if invalid */
document.getElementById("multiForm").addEventListener("submit", function (e) {
  if (!validateStage()) {
    e.preventDefault();
  } else {
    alert("Form submitted successfully!\n\n" + JSON.stringify(formData, null, 2));
    e.preventDefault(); // remove if backend exists
  }
});


/* Initial load */
showStage(currentStage);
