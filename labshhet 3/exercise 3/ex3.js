// 1️⃣ Question Structure
const questions = [
  {
    id: "q1",
    text: "Enter your name",
    type: "text",
    required: true,
    maxLength: 20
  },
  {
    id: "q2",
    text: "Select your gender",
    type: "radio",
    options: ["Male", "Female"],
    required: true
  },
  {
    id: "q3",
    text: "Select your skills (minimum 1)",
    type: "checkbox",
    options: ["Java", "Python", "JavaScript"],
    minSelect: 1
  }
];

// 2️⃣ Dynamic Form Generation
const container = document.getElementById("surveyContainer");

questions.forEach(q => {
  let div = document.createElement("div");
  div.className = "question";
  div.id = q.id;

  let label = document.createElement("label");
  label.innerText = q.text;
  div.appendChild(label);
  div.appendChild(document.createElement("br"));

  if (q.type === "text") {
    let input = document.createElement("input");
    input.type = "text";
    input.id = q.id + "_input";
    div.appendChild(input);
  }

  if (q.type === "radio") {
    q.options.forEach(opt => {
      let input = document.createElement("input");
      input.type = "radio";
      input.name = q.id;
      input.value = opt;

      div.appendChild(input);
      div.appendChild(document.createTextNode(opt));
      div.appendChild(document.createElement("br"));
    });
  }

  if (q.type === "checkbox") {
    q.options.forEach(opt => {
      let input = document.createElement("input");
      input.type = "checkbox";
      input.name = q.id;
      input.value = opt;

      div.appendChild(input);
      div.appendChild(document.createTextNode(opt));
      div.appendChild(document.createElement("br"));
    });
  }

  let error = document.createElement("div");
  error.className = "error";
  error.id = q.id + "_error";
  div.appendChild(error);

  container.appendChild(div);
});

// 3️⃣ Validation Function
function validateForm() {
  let isValid = true;

  questions.forEach(q => {
    let errorDiv = document.getElementById(q.id + "_error");
    errorDiv.innerText = "";

    if (q.type === "text") {
      let value = document.getElementById(q.id + "_input").value.trim();

      if (q.required && value === "") {
        errorDiv.innerText = "This field is required";
        isValid = false;
      } else if (value.length > q.maxLength) {
        errorDiv.innerText = "Maximum " + q.maxLength + " characters allowed";
        isValid = false;
      }
    }

    if (q.type === "radio") {
      let selected = document.querySelector(`input[name="${q.id}"]:checked`);
      if (q.required && !selected) {
        errorDiv.innerText = "Please select an option";
        isValid = false;
      }
    }

    if (q.type === "checkbox") {
      let checked = document.querySelectorAll(`input[name="${q.id}"]:checked`);
      if (checked.length < q.minSelect) {
        errorDiv.innerText = "Select at least " + q.minSelect + " option";
        isValid = false;
      }
    }
  });

  return isValid;
}

// 4️⃣ Prevent Submission Until Valid
document.getElementById("surveyForm").addEventListener("submit", function (e) {
  if (!validateForm()) {
    e.preventDefault();
  } else {
    alert("Survey submitted successfully!");
  }
});
