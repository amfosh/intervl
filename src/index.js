document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.querySelector('#intervl-start');
  const stopButton = document.querySelector('#intervl-stop');

  let isClockRunning = false;
  let isClockStopped = true;
  let workoutSessionDuration = 1500;
  let currentTimeLeftInSession = 1500;
  let breakSessionDuration = 300;
  let type = 'Workout';
  let timeSpentInCurrentSession = 0;
  let currentTaskLabel = document.querySelector('#intervl-clock-task');
  let updatedWorkoutSessionDuration;
  let updatedBreakSessionDuration;
  let workoutDurationInput = document.querySelector('#input-workout-duration');
  let breakDurationInput = document.querySelector('#input-break-duration');

  const progressBar = new ProgressBar.Circle("#intervl-timer", {
    strokeWidth: 2,
    text: {
      value: "25:00"
    },
    trailColor: "#f4f4f4",
    
  });

  startButton.addEventListener('click', () => {
    toggleClock();
  })


  stopButton.addEventListener('click', () => {
    toggleClock(true);
  })


  workoutDurationInput.value = '25';
  breakDurationInput.value = '5';

  workoutDurationInput.addEventListener('input', () => {
    updatedWorkoutSessionDuration = minuteToSeconds(workoutDurationInput.value)
  })
    
  breakDurationInput.addEventListener('input', () => {
    updatedBreakSessionDuration = minuteToSeconds(
        breakDurationInput.value
    )
  })

  const minuteToSeconds = mins => {
    return mins * 60
  }

  const toggleClock = reset => {
    togglePlayPauseIcon(reset);
    if (reset) {
      stopClock();
    } else {
      console.log(isClockStopped);
      if (isClockStopped) {
        setUpdatedTimers();
        isClockStopped = false;
      }
      if (isClockRunning === true) {
        clearInterval(clockTimer);
        isClockRunning = false;
      } else {
        clockTimer = setInterval(() => {
          stepDown();
          displayCurrentTimeLeftInSession();
          progressBar.set(calculateSessionProgress());
        }, 1000);
        isClockRunning = true;
      }
      showStopIcon();
    }
  };

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
      progressBar.text.innerText = result.toString();
  }

  const stopClock = () => {
    setUpdatedTimers();
    displaySessionLog(type);
    clearInterval(clockTimer);
    isClockStopped = true;
    isClockRunning = false;
    currentTimeLeftInSession = workoutSessionDuration;
    displayCurrentTimeLeftInSession();
    type = 'Workout';
    timeSpentInCurrentSession = 0;
  }

  const stepDown = () => {
      if (currentTimeLeftInSession > 0) {
        currentTimeLeftInSession--;
        timeSpentInCurrentSession++;
      } else if (currentTimeLeftInSession === 0) {
          timeSpentInCurrentSession = 0;
          if (type === 'Workout') {
            currentTimeLeftInSession = breakSessionDuration;
            displaySessionLog('Workout');
            type = 'Break';
            setUpdatedTimers();
            currentTaskLabel.value = 'Break';
            currentTaskLabel.disabled = true;
          } else {
            currentTimeLeftInSession = workoutSessionDuration;
            type = 'Workout';
            setUpdatedTimers();
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
      if (type == 'Workout') {
          sessionLabel = currentTaskLabel.value ? currentTaskLabel.value : 'Workout'
          workoutSessionLabel = sessionLabel;
      } else {
          sessionLabel = 'Break';
      }
      let elapsedTime = parseInt(timeSpentInCurrentSession / 60)
      elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1';
    
      const text = document.createTextNode(
        `${sessionLabel} : ${elapsedTime} min`
      )
      li.appendChild(text);
      sessionsList.appendChild(li);
  }

  const setUpdatedTimers = () => {
      if (type === 'Workout') {
        currentTimeLeftInSession = updatedWorkoutSessionDuration
          ? updatedWorkoutSessionDuration
          : workoutSessionDuration
        workSessionDuration = currentTimeLeftInSession
      } else {
        currentTimeLeftInSession = updatedBreakSessionDuration
          ? updatedBreakSessionDuration
          : breakSessionDuration
        breakSessionDuration = currentTimeLeftInSession
      }
  }

  const togglePlayPauseIcon = reset => {
    const playIcon = document.querySelector('#play-icon');
    const pauseIcon = document.querySelector('#pause-icon');
    if (reset) {
      if (playIcon.classList.contains('hidden')) {
        playIcon.classList.remove('hidden')
      }
      if (!pauseIcon.classList.contains('hidden')) {
        pauseIcon.classList.add('hidden')
      }
    } else {
      playIcon.classList.toggle('hidden')
      pauseIcon.classList.toggle('hidden')
    }
  }

  const showStopIcon = () => {
    const stopButton = document.querySelector('#intervl-stop')
    stopButton.classList.remove('hidden');
  }

  const calculateSessionProgress = () => {
    // calculate the completion rate of this session
    const sessionDuration =
      type === 'Workout' ? workoutSessionDuration : breakSessionDuration;
    return (timeSpentInCurrentSession / sessionDuration) * 10;
  };

});