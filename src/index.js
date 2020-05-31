const intervlTimer = document.querySelector('#intervl-timer');
const startButton = document.querySelector('#intervl-start')
const pauseButton = document.querySelector('#intervl-pause')
const stopButton = document.querySelector('#intervl-stop')

startButton.addEventListener('click', () => {
    toggleClock();
})

pauseButton.addEventListener('click', () => {
    toggleClock();
})

stopButton.addEventListener('click', () => {
    toggleClock();
})

let isClockRunning = false;
let workoutSessionDuration = 1500;
let currentTimeLeftInSession = 1500;
let breakSessionDuration = 300;
let type = 'Work';
let timeSpentInCurrentSession = 0;
let currentTaskLabel = document.querySelector('#intervl-clock-task');
let updatedWorkoutSessionDuration;
let updatedBreakSessionDuration;
let workoutDurationInput = document.querySelector('#input-workout-duration');
let breakDurationInput = document.querySelector('#input-break-duration');

workDurationInput.value = '25';
breakDurationInput.value = '5';

const toggleClock = (reset) => {
    if (reset) {
        stopClock();
    } else {
        if (isClockRunning === true) {
            clearInterval(clockTimer)
            isClockRunning = false;
        } else {
            isClockRunning = true;
            clockTimer = setInterval(() => {
                stepDown();
                displayCurrentTimeLeftInSession();
            }, 1000)
         }
    }
}

const displayCurrentTimeLeftInSession = () => {
    const secondsLeft = currentTimeLeftInSession;
    let result = '';
    const seconds = secondsLeft % 60;
    const minutes = parseInt(secondsLeft / 60) % 60;
    let hours = parseInt(secondsLeft / 3600);
    function addLeadingZeroes(time) {
      return time < 10 ? `0${time}` : time
    }
    if (hours > 0) result += `${hours}:`
    result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`
    intervlTimer.innerText = result.toString();
}

const stopClock = () => {
    displaySessionLog(type);
    clearInterval(clockTimer);
    isClockRunning = false;
    currentTimeLeftInSession = workoutSessionDuration;
    displayCurrentTimeLeftInSession();
    type = 'Work';
}

const stepDown = () => {
    if (currentTimeLeftInSession > 0) {
      currentTimeLeftInSession--;
      timeSpentInCurrentSession++;
    } else if (currentTimeLeftInSession === 0) {
        timeSpentInCurrentSession = 0;
        if (type === 'Work') {
          currentTimeLeftInSession = breakSessionDuration;
          displaySessionLog('Work');
          type = 'Break';
          currentTaskLabel.value = 'Break';
          currentTaskLabel.disabled = true;
        } else {
          currentTimeLeftInSession = workoutSessionDuration;
          type = 'Work';
          if (currentTaskLabel.value === 'Break') {
            currentTaskLabel.value = workoutSessionLabel;
          }
          currentTaskLabel.disabled = false;
          displaySessionLog('Break');
        }
    }
    displayCurrentTimeLeftInSession();
}

const displaySessionLog = (type) => {
    const sessionsList = document.querySelector('#intervl-sessions');
    const li = document.createElement('li');
    if (type == 'Work') {
        sessionLabel = currentTaskLabel.value ?
        currentTaskLabel.value 
        : 'Work'
        workoutSessionLabel = sessionLabel 
    } else {
        sessionLabel = 'Break'
    }
    let elapsedTime = parseInt(timeSpentInCurrentSession / 60)
    elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1';
  
    const text = document.createTextNode(
      `${sessionLabel} : ${elapsedTime} min`
    )
    li.appendChild(text);
    sessionsList.appendChild(li);
  }
  