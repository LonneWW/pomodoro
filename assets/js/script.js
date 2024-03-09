//creating or selecting timer inputs (inputs are intended as the numbers of the timer)
let inputs_container = document.querySelector(".inputs_container");
let minutes = document.createElement("input");
let seconds = document.createElement("input");


//function that gives timer inputs their "default" attributes and style
let timerInputsStyles = (input) => {
  input.className = "timer";
  input.setAttribute(`value`, `00`);
  input.setAttribute(`type`, `text`);
  input.setAttribute(`onpointerdown`, `return false;`);
}

//giving each timer inputs attributes, styles and than insterting them in the doc
timerInputsStyles(minutes);
inputs_container.prepend(minutes);
timerInputsStyles(seconds);
inputs_container.append(seconds);

//creating or selecting timer buttons (buttons that change the value of the timer or makes it start)
let buttonsContainer = document.querySelector(".btns_container"); //container of the buttons. needed for event delegation
let btnsArray = ["decreaseBtn", "increaseBtn", "startResetBtn"];  //array for iterate the next function
let shiftBtn = document.getElementById("shift");

// function that create a button, gives innerHTML, classes and id. ids are necessary for the handler below (called "timer")
let createTimerButton = function(elem, btnInnerHTML, classesName, id){
  window[elem] = document.createElement("button"); 
  window[elem].innerHTML = btnInnerHTML;
  classesName.forEach(element => {
    window[elem].classList.add(element);
  });
  window[elem].id = id;
  buttonsContainer.append(window[elem]);
}

//giving each timer buttons innerHTMLs, classes (styles), ids and than insterting them in the doc
createTimerButton("decreaseBtn", "-", ["button"], "decreaseBtn");
createTimerButton("startResetBtn", "Start", ["button", "start"], "startResetBtn");
createTimerButton("increaseBtn", "+", ["button"], "increaseBtn");

//selecting the button that mutes the ticking in the timer (the one on the upper right). it is not contained in "buttonsContainer"
let tickingButton = document.getElementById("tickingButton");

//selectiong sound effects and decrease their volumes
let increaseEffect = document.getElementById("increaseEffect");
increaseEffect.volume = 0.5;
let decreaseEffect = document.getElementById("decreaseEffect");
decreaseEffect.volume = 0.8;
let tickingEffect = document.getElementById("tickingEffect");
tickingEffect.volume = 0.1;
let timerSound = document.getElementById("timerSound");
timerSound.volume = 0.8;


//buttons handler (only the ones contained in the "btns container")
buttonsContainer.onclick = function(event) {
  //the multiplier variable indicates if we are going to decrease/increase the tens digits or the single minute
  let multiplier;
  if (event.shiftKey || shiftBtn.classList.contains("active")){ //the multiplier is triggered if the shift key (or button) are pressed (or active)
    multiplier=10;
  } else {
    multiplier=1;
  };
  //calling the function that handles the clicks on the timer buttons (contained in buttonsContainer)
  onTimerButtonsClick(event, multiplier);
};

////calling the function that handles the clicks on the timer buttons (contained in buttonsContainer). based on the id of the pressed button, it change the "multiplier", increase/decrease the value of the timer or it makes it start
let onTimerButtonsClick = function (event, x) {
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

    //if the shift button is pressed, then...
    case shiftBtn.id: 
      //it changes its class (toggle of the "multiplier" for mobile/tablet users) and its background 
      if (shiftBtn.classList.contains("active")) {
        shiftBtn.style.background = "#902121";
        shiftBtn.classList.remove("active");
      } else {
        shiftBtn.style.background = "#F23329";
        shiftBtn.classList.add("active");
      };
      break;

    //if "start/reset" button is pressed, then...    
    case startResetBtn.id:
      onTimerStart(); //function that disables the buttons except for the reset one
      if (startResetBtn.classList.contains("start")){ //if the button cointains the class start, which indicates that the timer has not started yet
        if (Number(minutes.value) == 0 && Number(seconds.value) == 0) {return false;}; // Prevent the start if both minutes and seconds are 0 
        timerStart(); //function that each seconds subtract seconds or minutes to their respective values and, at the end of the timer, changes the class (styles) of the start/reset button, play the jingle and run the alert
        //at the start of the timer, change styles
        startResetBtn.classList.remove("start");
        startResetBtn.innerHTML = "Reset"
        startResetBtn.classList.add("reset");
      } else { 
        //if the button does not cointain the class start, than the timer will reset
        onTimerEnd(); //function that, at the end of the timer, changes the classes of the buttons and the background color to their previous value
        minutes.value = "0"+0; //reset value of both minutes and seconds to stop the timer
        seconds.value = "0"+0;
        startResetBtn.classList.remove("reset"); //change the styles to theirs origins
        startResetBtn.innerHTML = "Start"
        startResetBtn.classList.add("start");
      }
      return;
    };
  if (minutes.value<10 && (event.target.id === increaseBtn.id || event.target.id === decreaseBtn.id)){ //referred to the first two cases, if the value is <10 (and the click is not on the container element), add a 0 to maintain the double digits
    minutes.value = "0" + minutes.value;
  };
};

//function that each seconds subtract seconds or minutes to their respective values and, at the end of the timer, changes the class (styles) of the start/reset button, play the jingle and run the alert
let timerStart = function (){
  if (tickingButton.classList.contains("unmute")) {tickingEffect.play();}; //if the ticking button is not "muted" than plays the ticking effect  
  let handlingTimerSeconds = setInterval(function (){ //setInterval to subtract 1 each second and change button classes
    if (Number(seconds.value) == 0){ //if seconds are 0..
        if (Number(minutes.value) == 0){  //...and also the minutes get to 0
            tickingEffect.pause(); //stop the ticking sound
            startResetBtn.classList.remove("reset"); //change style things
            startResetBtn.innerHTML = "Start"
            startResetBtn.classList.add("start");
            onTimerEnd(); //function that, at the end of the timer, changes the classes of the buttons and the background color to their previous value
            timerSound.play(); //play the end of pomodoro jingle
            setTimeout(function() { //alert starts (with a little delay)
              alert(("Time's up! Great job keeping it up with the hard work!"));
            }, 500);
            clearInterval(handlingTimerSeconds); // clear the timer 
            handlingTimerSeconds = null;  //and stop the countdown
        }else{ //if minutes > 0 then..
            minutes.value--; //subtract 1 to the minutes
            if (minutes.value<10){ //if the value is <10, add a 0 to maintain the double digits
              minutes.value = "0" + minutes.value;
            };
            seconds.value=59; //and get the seconds to "59"
        }
    }else{ //if the seconds are not 0 then..
        seconds.value--; //subtract 1 to the seconds
        if (seconds.value<10){ //if the value is <10, add a 0 to maintain the double digits
          seconds.value = "0" + seconds.value;
        };
    }
  }, 1000);
}

//array containing buttons that should be disabled when the timer is ticking.
btnsArray = [decreaseBtn, increaseBtn, shiftBtn, tickingButton];

//function that, on timer starts, changes the classes of the buttons and the background color
let onTimerStart = function(){
  if (Number(minutes.value) == 0 && Number(seconds.value)==0) {return false}; // prevent the changes of styles if both minutes and seconds are 0 
    btnsArray.forEach(element => {
      element.classList.add("disable");}
    );
  document.body.style.background = "#1D567F";
};

//function that, at the end of the timer, changes the classes of the buttons and the background color to their previous value
let onTimerEnd = function() {
  btnsArray.forEach(element => {
    element.classList.remove("disable");}
  );
  document.body.style.background = "#BA4949";
}

//audio control handler of the ticking button. it changes its class (toggle for the ticking) and its background
tickingButton.onclick = () => {
  if (tickingButton.classList.contains("unmute")) {
    tickingButton.style.background = "#902121";
    tickingButton.classList.remove("unmute");
  } else {
    tickingButton.style.background = "";
    tickingButton.classList.add("unmute");
  }
}

