//timer inputs
let inputs_container = document.querySelector(".inputs_container");
let minutes = document.createElement("input");
let seconds = document.createElement("input");


//timer inputs' styles function
let timerInputsStyles = (input) => {
  input.className = "timer";
  input.setAttribute(`value`, `00`);
  input.setAttribute(`type`, `text`);
  input.setAttribute(`onpointerdown`, `return false;`);
}

//giving each timer inputs styles and insterting them in the doc
timerInputsStyles(minutes);
inputs_container.prepend(minutes);

timerInputsStyles(seconds);
inputs_container.append(seconds);

//timer buttons
let buttonsContainer = document.querySelector(".btns_container"); //container of the buttons. needed for event delegation
let decreaseBtn = document.createElement("button");
let increaseBtn = document.createElement("button");
let startResetBtn = document.createElement("button");
let shiftBtn = document.getElementById("shift");

//giving each timer buttons styles, ids and than insterting them in the doc. ids are necessary for the handler below
decreaseBtn.innerHTML = "-";
decreaseBtn.className = "button";
decreaseBtn.id = "decreaseBtn";
buttonsContainer.append(decreaseBtn);

startResetBtn.innerHTML = "Start";
startResetBtn.classList.add("button");
startResetBtn.classList.add("start");
startResetBtn.id = "startResetBtn"
buttonsContainer.append(startResetBtn);

increaseBtn.innerHTML = "+";
increaseBtn.className = "button";
increaseBtn.id = "increaseBtn";
buttonsContainer.append(increaseBtn);

//sound effects
let increaseEffect = document.getElementById("increaseEffect");
increaseEffect.volume = 0.5;
let decreaseEffect = document.getElementById("decreaseEffect");
decreaseEffect.volume = 0.8;
let tickingEffect = document.getElementById("tickingEffect");
tickingEffect.volume = 0.1;
let timerSound = document.getElementById("timerSound");
timerSound.volume = 0.8;

//audio control
let muteButton = document.getElementById("muteButton");

//timer handler
buttonsContainer.onclick = function(event) {
  //the multiplier variable rappresent if we are going to decrease/increase the tens digits or the single minute
  let multiplier;
  if (event.shiftKey || shiftBtn.classList.contains("active")){
    multiplier=10;
  } else {
    multiplier=1;
  };
  //calling the decreasing/increasing function
  timer(event, multiplier);
};

//timer function
let timer = function (event, x) {
  let targetId = event.target.id;
  let value = Number(minutes.value); //changing the value from string to number to better operate
  switch (targetId){
    //if the "-" button is pressed, then...
    case decreaseBtn.id: 
      if (minutes.value == 0) {minutes.value = 0; break;}; //prevent negative numbers
      if (minutes.value <= 10 && x == 10) {minutes.value = 0; break;}; //prevent negative numbers
      decreaseEffect.play();
      minutes.value=value-x; //decrease by the correct multiplier
      break;
    
    //if the "+" button is pressed, then...
    case increaseBtn.id:
      minutes.value=value+x; //increase by the correct multiplier
      if (minutes.value>=60) {minutes.value = 60;}; //cap to 60 minutes
      if (minutes.value != 60) {increaseEffect.play()};
      break;

    //if "start/reset" button is pressed, then...    
    case startResetBtn.id:
      //start option
      afterStart();
      if (startResetBtn.classList.contains("start")){
        if (Number(minutes.value) == 0 && Number(seconds.value) == 0) {return false;}; // Prevent the start if both minutes and seconds are 0 
        timerStart();
        //at the start of the timer, change styles
        startResetBtn.classList.remove("start");
        startResetBtn.innerHTML = "Reset"
        startResetBtn.classList.add("reset");
      } else { 
        //reset option
        timesOff();
        minutes.value = "0"+0; //reset value of both minutes and seconds to stop the timer
        seconds.value = "0"+0;
        startResetBtn.classList.remove("reset"); //change the styles to theirs origins
        startResetBtn.innerHTML = "Start"
        startResetBtn.classList.add("start");
      }
      return;
    };
  if (minutes.value<10 && (event.target.id === increaseBtn.id || event.target.id === decreaseBtn.id)){ //if the value is <10 (and the click is not on the container element), add a 0 to maintain the double digits
    minutes.value = "0" + minutes.value;
  };
};

//function for timer operation
let timerStart = function (){
  if (muteButton.classList.contains("unmute")) {tickingEffect.play();};
  let handlingTimerSeconds = setInterval(function (){ //setInterval to subtract 1 each second and change button classes
    switch (Number(seconds.value)){
      case 0: //if seconds get to 0...
        switch (Number(minutes.value)){ 
          case 0: //...and also the minutes get to 0
            tickingEffect.pause();
            startResetBtn.classList.remove("reset"); //change style things
            startResetBtn.innerHTML = "Start"
            startResetBtn.classList.add("start");
            timesOff();
            timerSound.play();
            setTimeout(function() { //alert starts (with a little delay)
              alert(("Time's up! Great job keeping it up with the hard work!"));
            }, 500);
            clearInterval(handlingTimerSeconds); // clear the timer 
            handlingTimerSeconds = null;  //and stop the countdown
            return;
          default: //if minutes > 0 then..
            minutes.value--; //subtract 1 to the minutes
            if (minutes.value<10){ //if the value is <10, add a 0 to maintain the double digits
              minutes.value = "0" + minutes.value;
            };
            seconds.value=59; //and get the seconds to "59"
            break;
        }
        break;
      default: //if the seconds are not 0 then..
        seconds.value--; //subtract 1 to the seconds
        if (seconds.value<10){ //if the value is <10, add a 0 to maintain the double digits
          seconds.value = "0" + seconds.value;
        };
        break;
    }
  }, 1000);
}

//functions to change the styles of the buttons on the click of start/reset
let afterStart = function(){
  if (Number(minutes.value) == 0 && Number(seconds.value)==0) {return false}; // prevent the changes of styles if both minutes and seconds are 0 
  decreaseBtn.classList.add("disable");
  increaseBtn.classList.add("disable");
  shiftBtn.classList.add("disable");
  muteButton.classList.add("disable");
  document.body.style.background = "#1D567F";
};

let timesOff = function() {
  decreaseBtn.classList.remove("disable");
  increaseBtn.classList.remove("disable");
  shiftBtn.classList.remove("disable");
  muteButton.classList.remove("disable");
  document.body.style.background = "#BA4949";
}

//audio control handler
muteButton.onclick = () => {
  if (muteButton.classList.contains("unmute")) {
    muteButton.style.background = "#902121";
    muteButton.classList.remove("unmute");
  } else {
    muteButton.style.background = "";
    muteButton.classList.add("unmute");
  }
}

//shift button for mobile/tablet users
shiftBtn.onclick = () => {
  if (shiftBtn.classList.contains("active")) {
    shiftBtn.style.background = "#902121";
    shiftBtn.classList.remove("active");
  } else {
    shiftBtn.style.background = "#F23329";
    shiftBtn.classList.add("active");
  }
}