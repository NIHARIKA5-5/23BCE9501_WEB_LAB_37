let activityLog = [];
let clickCount = 0;
const CLICK_THRESHOLD = 10;

const logList = document.getElementById("activityLog");
const warningDiv = document.getElementById("warning");

/* Add activity to array and DOM */
function addActivity(type, details) {
  const activity = {
    type: type,
    details: details,
    time: new Date().toLocaleTimeString()
  };

  activityLog.push(activity);
  displayActivity(activity);
}

/* Display activity */
function displayActivity(activity) {
  let li = document.createElement("li");
  li.textContent = `[${activity.time}] ${activity.type} - ${activity.details}`;
  logList.appendChild(li);
}

/* CLICK tracking (BUBBLING) */
document.addEventListener(
  "click",
  function (e) {
    clickCount++;
    addActivity("Click", e.target.tagName);

    if (clickCount > CLICK_THRESHOLD) {
      warningDiv.textContent = "⚠ Suspicious Activity: Too many clicks!";
    }
  },
  false
);

/* KEY PRESS tracking (CAPTURING) */
document.addEventListener(
  "keydown",
  function (e) {
    addActivity("Key Press", e.key);
  },
  true
);

/* FOCUS tracking (focusin BUBBLES) */
document.addEventListener("focusin", function (e) {
  addActivity("Focus", e.target.tagName);
});

/* Reset activity log */
function resetLog() {
  activityLog = [];
  clickCount = 0;
  logList.innerHTML = "";
  warningDiv.textContent = "";
}

/* Export activity log */
function exportLog() {
  let output = "User Activity Log\n\n";

  activityLog.forEach((item, index) => {
    output += `${index + 1}. [${item.time}] ${item.type} - ${item.details}\n`;
  });

  alert(output);
}
