class Habit {
    constructor(name, intervalTime, targetReps) {
        // Validate inputs
        if (!name || name.trim() === '') throw new Error('Name is required');
        if (!intervalTime || intervalTime <= 0) throw new Error('Interval time must be positive');
        if (!targetReps || targetReps <= 0) throw new Error('Target reps must be positive');

        this.name = name.trim();
        this.intervalTime = Math.floor(intervalTime);
        this.targetReps = Math.floor(targetReps);
        this.currentReps = 0;
        this.timer = null;
        this.remainingTime = intervalTime;
        this.isRunning = false;
    }

    startTimer() {
        if (!this.isRunning) {
            this.isRunning = true;
            // Clear any existing timer
            if (this.timer) clearInterval(this.timer);
            
            this.timer = setInterval(() => {
                this.remainingTime--;
                this.updateDisplay();
                
                if (this.remainingTime <= 0) {
                    this.resetTimer();
                    // Play sound or show notification when timer completes
                    this.notifyTimerComplete();
                }
            }, 1000);
        }
    }

    resetTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.remainingTime = this.intervalTime;
        this.isRunning = false;
        this.updateDisplay();
    }

    incrementReps() {
        this.currentReps++;
        // Check if target is reached
        if (this.currentReps >= this.targetReps) {
            this.notifyTargetReached();
        }
        this.updateDisplay();
    }

    notifyTimerComplete() {
        // Add visual feedback
        const habitElement = document.getElementById(`habit-${this.name}`);
        if (habitElement) {
            const timerDisplay = habitElement.querySelector('.timer');
            timerDisplay.style.color = '#ff0000';
            setTimeout(() => {
                timerDisplay.style.color = '';
            }, 1000);
        }
    }

    notifyTargetReached() {
        const habitElement = document.getElementById(`habit-${this.name}`);
        if (habitElement) {
            const repsDisplay = habitElement.querySelector('.rep-counter');
            repsDisplay.style.color = '#00ff00';
            setTimeout(() => {
                repsDisplay.style.color = '';
            }, 1000);
        }
    }

    updateDisplay() {
        const habitElement = document.getElementById(`habit-${this.name}`);
        if (habitElement) {
            const timerDisplay = habitElement.querySelector('.timer');
            const repsDisplay = habitElement.querySelector('.rep-counter');
            
            // Format time as MM:SS
            const minutes = Math.floor(this.remainingTime / 60);
            const seconds = this.remainingTime % 60;
            const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            timerDisplay.textContent = `Time: ${timeStr}`;
            repsDisplay.textContent = `Reps: ${this.currentReps}/${this.targetReps}`;
        }
    }
}

const habits = new Map();

function addHabit() {
    const nameInput = document.getElementById('habitName');
    const intervalInput = document.getElementById('intervalTime');
    const targetInput = document.getElementById('targetReps');

    const name = nameInput.value;
    const intervalTime = parseInt(intervalInput.value);
    const targetReps = parseInt(targetInput.value);

    try {
        // Check if habit already exists
        if (habits.has(name)) {
            throw new Error('A habit with this name already exists');
        }

        const habit = new Habit(name, intervalTime, targetReps);
        habits.set(name, habit);

        const habitElement = document.createElement('div');
        habitElement.id = `habit-${name}`;
        habitElement.className = 'habit-card';
        habitElement.innerHTML = `
            <h3>${name}</h3>
            <div class="timer">Time: ${Math.floor(intervalTime / 60)}:${(intervalTime % 60).toString().padStart(2, '0')}</div>
            <div class="rep-counter">Reps: 0/${targetReps}</div>
            <div class="button-group">
                <button onclick="habits.get('${name}').startTimer()">Start Timer</button>
                <button onclick="habits.get('${name}').resetTimer()">Reset Timer</button>
                <button onclick="habits.get('${name}').incrementReps()">Add Rep</button>
                <button onclick="deleteHabit('${name}')" class="delete-btn">Delete</button>
            </div>
        `;

        document.getElementById('habitList').appendChild(habitElement);

        // Clear inputs
        nameInput.value = '';
        intervalInput.value = '';
        targetInput.value = '';

    } catch (error) {
        alert(error.message);
    }
}

// Add delete functionality
function deleteHabit(name) {
    const habit = habits.get(name);
    if (habit) {
        // Clear any running timer
        if (habit.timer) {
            clearInterval(habit.timer);
        }
        // Remove from Map
        habits.delete(name);
        // Remove from DOM
        const element = document.getElementById(`habit-${name}`);
        if (element) {
            element.remove();
        }
    }
} 