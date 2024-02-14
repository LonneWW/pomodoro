//timer 
let minutes = document.getElementById("minutes");
let seconds = document.getElementById("seconds");

//changing value on the click of buttons
let decreaseBtn = document.getElementById("decrease_btn");
let increaseBtn = document.getElementById("increase_btn");
let startResetBtn = document.getElementById("startReset_btn");
let buttonsContainer = document.querySelector(".btns_container"); //container of the buttons. needed for event delegation


buttonsContainer.onclick = function(event) {
  //the multiplier variable rappresent if we are going to decrease/increase the tens digits or the single minute
  let multiplier;
  if (event.shiftKey){
    multiplier=10;
  } else {
    multiplier=1;
  };
  //calling the decreasing/increasing function
  timer(event, multiplier);
};

let timer = function (event, x) {
  let targetId = event.target.id;
  let value = Number(minutes.value); //changing the value from string to number to better operate
  switch (targetId){
    //if the "-" button is pressed, then...
    case decreaseBtn.getAttribute(`id`): 
      if (minutes.value == 0) {minutes.value = 0; break;}; //prevent negative numbers
      if (minutes.value<=10 && x==10) {minutes.value = 0; break;}; //prevent negative numbers
      minutes.value=value-x; //decrease by the correct multiplier
      break;
    
    //if the "+" button is pressed, then...
    case increaseBtn.getAttribute(`id`):
      minutes.value=value+x; //increase by the correct multiplier
      if (minutes.value>=60) {minutes.value = 60;}; //cap to 60 minutes
      break;

    //if "start/reset" button is pressed, then...    
    case startResetBtn.getAttribute(`id`):
      //start option
      afterStart();
      if (startResetBtn.classList.contains("start")){
        if (Number(minutes.value) == 0 && Number(seconds.value)==0) {return false}; // prevent the start if both minutes and seconds are 0 
        let handlingTimerSeconds = setInterval(function (){ //setInterval to subtract 1 each second and change "toggle" classes
          switch (Number(seconds.value)){
            case 0: //if seconds get to 0...
              switch (Number(minutes.value)){ 
                case 0: //...and also the minutes get to 0
                  startResetBtn.classList.remove("reset"); //change style things
                  startResetBtn.innerHTML = "Start"
                  startResetBtn.classList.add("start");
                  timesOff();
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
  if (minutes.value<10 && event.target.id){ //if the value is <10 (and the click is not on the container element), add a 0 to maintain the double digits
    minutes.value = "0" + minutes.value;
  };
};

//functions to change the styles of the buttons on the click of start/reset
let afterStart = function(){
  if (Number(minutes.value) == 0 && Number(seconds.value)==0) {return false}; // prevent the changes of styles if both minutes and seconds are 0 
  decreaseBtn.classList.add("disable");
  increaseBtn.classList.add("disable");
  document.body.style.background = "#1D567F";
};

let timesOff = function() {
  decreaseBtn.classList.remove("disable");
  increaseBtn.classList.remove("disable");
  document.body.style.background = "#BA4949";
}




