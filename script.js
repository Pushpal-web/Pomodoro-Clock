const timer = document.querySelector('.timer');
const title = document.querySelector('.title');
const startBtn = document.querySelector('.startBtn');
const pauseBtn = document.querySelector('.pauseBtn');
const resumeBtn = document.querySelector('.resumeBtn');
const resetBtn = document.querySelector('.resetBtn');
const pomoCountsDisplay = document.querySelector('.pomoCountsDisplay');

//Making variables
const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
let timerID = null;
let oneRoundCompleted = false; //One Round =  Work time + Break time
let totalCount = 0;
let paused = false;

//Function to update title
const updateTitle = (msg) =>{
    title.textContent = msg;
}

//Function to save Pomodoro counts to local storage
const saveLocalCounts = () =>{
    let counts = JSON.parse(localStorage.getItem("pomoCounts"));
    counts !==  null ? counts++ : counts = 1;
    localStorage.getItem("pomoCounts", JSON.stringify(counts));
}

//Function to countdown
const countDown = (time) => {
    return () =>{
        const mins = Math.floor(time/60).toString().padStart(2, '0');
        const secs = Math.floor(time % 60).toString().padStart(2, '0');
        // timer.textContent = time;
        timer.textContent = `${mins}:${secs}`;
        time--;
        if(time < 0){
            stopTimer();
            if(!oneRoundCompleted) {
                timerID = startTimer(BREAK_TIME);
                oneRoundCompleted = true;
                updateTitle("It's Break Time!!!");
            }
            else{
                updateTitle("Completed 1 Round of Pomodoro Technique!!!");
                setTimeout(() => updateTitle("Start Timer Again!!!"), 2000);
                totalCount++;
                saveLocalCounts();  
                showPomoCounts();
            }
        }
    }
}

//Arrow Function to start timer
const startTimer = (startTime) => {
    if(timerID !== null){
        stopTimer();
            timerID = startTimer(BREAK_TIME);
    }
    return setInterval(countDown(startTime), 1000);
}

//Arrow Function to stop timer
const stopTimer = () => {
    clearInterval(timerID);
    timerID = null;
}

//Function to get time in seconds
const getTimeInSeconds = (timeString) => {
    const[minutes, seconds] = timeString.split(":");
    return parseInt(minutes * 60) + parseInt(seconds);
}

//Adding Event Listener to Start button
startBtn.addEventListener('click', ()=>{
    timerID = startTimer(WORK_TIME);
    updateTitle("It's Work Time!!!");
});

//Adding Event Listener to Reset button
resetBtn.addEventListener('click', ()=>{
    stopTimer();
    timer.textContent = "25:00";
    updateTitle("Click start to start timer");
});

//Adding Event Listener to Pause button
pauseBtn.addEventListener('click', ()=>{
    stopTimer();
    paused = true;
    updateTitle("Timer Paused");
});

//Adding Event Listener to Resume button
resumeBtn.addEventListener('click', ()=>{
    if(paused){
        const currentTime = getTimeInSeconds(timer.textContent);
        timerID = startTimer(currentTime);
        paused = false;
        (!oneRoundCompleted) ? updateTitle("It's Work Time") : updateTitle("It's Break Time"); 
    }
});

//Function to show completed pomodoros to screen from local storage
const showPomoCounts = () =>{
    const counts = JSON.parse(localStorage.getItem("pomoCounts"));
    if(counts > 0){
        pomoCountsDisplay.style.display = "flex";
    }
    pomoCountsDisplay.firstElementChild.textContent = counts;
}

showPomoCounts();