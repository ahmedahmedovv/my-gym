class Habit {
    constructor(name, intervalTime, targetReps) {
        this.name = name;
        this.intervalTime = intervalTime;
        this.targetReps = targetReps;
        this.currentReps = 0;
        this.timer = null;
        this.remainingTime = intervalTime;
        this.isRunning = false;
    }

    startTimer() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timer = setInterval(() => {
                this.remainingTime--;
                this.updateDisplay();
                
                if (this.remainingTime <= 0) {
                    this.resetTimer();
                }
            }, 1000);
        }
    }

    resetTimer() {
        clearInterval(this.timer);
        this.remainingTime = this.intervalTime;
        this.isRunning = false;
        this.updateDisplay();
    }

    incrementReps() {
        this.currentReps++;
        this.updateDisplay();
    }

    updateDisplay() {
        const habitElement = document.getElementById(`habit-${this.name}`);
        if (habitElement) {
            const timerDisplay = habitElement.querySelector('.timer');
            const repsDisplay = habitElement.querySelector('.rep-counter');
            
            timerDisplay.textContent = `Time: ${this.remainingTime}s`;
            repsDisplay.textContent = `Reps: ${this.currentReps}/${this.targetReps}`;
        }
    }
}

const habits = new Map();

function addHabit() {
    const name = document.getElementById('habitName').value;
    const intervalTime = parseInt(document.getElementById('intervalTime').value);
    const targetReps = parseInt(document.getElementById('targetReps').value);

    if (!name || !intervalTime || !targetReps) {
        alert('Please fill all fields');
        return;
    }

    const habit = new Habit(name, intervalTime, targetReps);
    habits.set(name, habit);

    const habitElement = document.createElement('div');
    habitElement.id = `habit-${name}`;
    habitElement.className = 'habit-card';
    habitElement.innerHTML = `
        <h3>${name}</h3>
        <div class="timer">Time: ${intervalTime}s</div>
        <div class="rep-counter">Reps: 0/${targetReps}</div>
        <button onclick="habits.get('${name}').startTimer()">Start Timer</button>
        <button onclick="habits.get('${name}').resetTimer()">Reset Timer</button>
        <button onclick="habits.get('${name}').incrementReps()">Add Rep</button>
    `;

    document.getElementById('habitList').appendChild(habitElement);
} 