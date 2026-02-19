let workTime = 25 * 60;
let shortBreak = 5 * 60;
let longBreak = 15 * 60;

let timeLeft = workTime;
let timer;
let isRunning = false;
let isWork = true;
let sessions = localStorage.getItem("sessions") || 0;

const timeDisplay = document.getElementById("time");
const modeDisplay = document.getElementById("mode");
const sessionDisplay = document.getElementById("sessions");
const progressCircle = document.getElementById("progress");

sessionDisplay.textContent = sessions;

const circumference = 2 * Math.PI * 100;
progressCircle.style.strokeDasharray = circumference;

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timeDisplay.textContent =
        `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;

    let progress = timeLeft / (isWork ? workTime : shortBreak);
    progressCircle.style.strokeDashoffset =
        circumference - progress * circumference;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;

    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timer);
            isRunning = false;

            if (isWork) {
                sessions++;
                localStorage.setItem("sessions", sessions);
                sessionDisplay.textContent = sessions;

                if (sessions % 4 === 0) {
                    timeLeft = longBreak;
                    modeDisplay.textContent = "Long Break";
                } else {
                    timeLeft = shortBreak;
                    modeDisplay.textContent = "Short Break";
                }
            } else {
                timeLeft = workTime;
                modeDisplay.textContent = "Work Time";
            }

            isWork = !isWork;
            updateDisplay();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = workTime;
    isWork = true;
    modeDisplay.textContent = "Work Time";
    updateDisplay();
}

document.getElementById("start").onclick = startTimer;
document.getElementById("pause").onclick = pauseTimer;
document.getElementById("reset").onclick = resetTimer;

updateDisplay();

/* TASKS WITH LOCAL STORAGE */

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.text;
        if (task.completed) li.classList.add("completed");

        li.onclick = () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        };

        const del = document.createElement("button");
        del.textContent = "X";
        del.onclick = (e) => {
            e.stopPropagation();
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        };

        li.appendChild(del);
        taskList.appendChild(li);
    });
}

document.getElementById("addTask").onclick = () => {
    if (taskInput.value.trim() === "") return;
    tasks.push({ text: taskInput.value, completed: false });
    taskInput.value = "";
    saveTasks();
    renderTasks();
};

renderTasks();

/* DARK MODE */

document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
};
