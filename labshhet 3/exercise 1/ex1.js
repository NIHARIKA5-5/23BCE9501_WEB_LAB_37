function roleChange() {
    let role = document.getElementById("role").value;
    let skillsField = document.getElementById("skillsField");

    if (role === "teacher") {
        skillsField.style.display = "block";
    } else {
        skillsField.style.display = "none";
    }
}

function validateEmail() {
    let email = document.getElementById("email").value;
    let emailMsg = document.getElementById("emailMsg");

    if (!email.endsWith("@gmail.com")) {
        emailMsg.innerText = "Email must be @gmail.com";
        return false;
    } else {
        emailMsg.innerText = "";
        return true;
    }
}

function validatePassword() {
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;
    let passMsg = document.getElementById("passMsg");

    if (role === "admin") {
        let strongPassword = /(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}/;
        if (!strongPassword.test(password)) {
            passMsg.innerText =
              "Admin password must include uppercase, number & symbol";
            return false;
        }
    } else {
        if (password.length < 6) {
            passMsg.innerText = "Password must be at least 6 characters";
            return false;
        }
    }

    passMsg.innerText = "";
    return true;
}

function validateForm() {
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (!validateEmail() || !validatePassword()) {
        alert("Fix validation errors");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return false;
    }

    alert("Registration Successful!");
    return true;
}
