
sm = new StateMachine(this, { debug: false });


sm.state('sitting', {
  enter: function () { console.log('sitting enter'); },
  update: function () { console.log('sitting update'); },
  exit: function () { console.log('sitting exit'); }
});

sm.state('walking', {
  enter: function () { console.log('walking enter'); },
  update: function () { console.log('walking update'); },
  exit: function () { console.log('walking exit'); }
});

sm.state('laying', {
  enter: function () { console.log('laying enter'); },
  update: function () { console.log('laying update'); },
  exit: function () { console.log('laying exit'); }
});

sm.state('sleeping', {
  enter: function () { console.log('sleeping enter'); },
  update: function () { console.log('sleeping update'); },
  exit: function () { console.log('sleeping exit'); }
});

//
// state machine transitions
//

// walking
sm.transition('walking_to_sitting', 'walking', 'sitting', function () {
  return !key && (new Date() - sm.timer > 1000);
});

sm.transition('sitting_to_walking', 'sitting', 'walking', function () {
  return key && (new Date() - sm.timer > 1000);
});

// sitting
sm.transition('sitting_to_laying', 'sitting', 'laying', function () {
  return (new Date() - sm.timer > 1000);
});

// laying
sm.transition('laying_to_sitting', 'laying', 'sitting', function () {
  return key && (new Date() - sm.timer > 1000);
});

sm.transition('laying_to_sleeping', 'laying', 'sleeping', function () {
  return (new Date() - sm.timer > 1000);
});

// sleeping
sm.transition('sleeping_to_laying', 'sleeping', 'laying', function () {
  return key && (new Date() - sm.timer > 1000);
});



var key = false;
window.onload = function () {
  // key logs
  var input = document.querySelector('input');
  var state = document.getElementById('state');
  input.onkeypress = logKey;
  function logKey(e) {
    key = true;
  }

  input.onkeyup = function() {
    key = false;
  }
  // updater
  setInterval(function () {
    sm.update();
    state.innerHTML = "state: " + sm.currentState;
  }, 200);
}