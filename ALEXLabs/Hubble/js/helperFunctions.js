var changingInt = false; // are we changing the integration time? If so don't allow changing slew speed

var increment = RAPID; // Default Slewing Speed of the telescope is Rapid (variables in constants.js)

var bigInc   = document.getElementById('bigInc');
var smallInc = document.getElementById('smallInc');
var tinyInc  = document.getElementById('tinyInc');

bigInc.onclick = function() {inc(RAPID)};
smallInc.onclick = function() {inc(NOMINAL)};
tinyInc.onclick = function() {inc(SLOW)};

bigInc.style.backgroundColor = "white";
smallInc.style.backgroundColor = "darkgray";
tinyInc.style.backgroundColor = "darkgray";

function inc(newIncrement) {
  newIncrement = parseInt(newIncrement);

  increment = newIncrement;

  if (newIncrement == RAPID) {
    bigInc.style.backgroundColor = 'white';
    smallInc.style.backgroundColor = 'darkgray';
    tinyInc.style.backgroundColor = 'darkgray';
  } else if (newIncrement == NOMINAL) {
    bigInc.style.backgroundColor = 'darkgray';
    smallInc.style.backgroundColor = 'white';
    tinyInc.style.backgroundColor = 'darkgray';
  } else if (newIncrement == SLOW) {
    bigInc.style.backgroundColor = 'darkgray';
    smallInc.style.backgroundColor = 'darkgray';
    tinyInc.style.backgroundColor = 'white';
  }
}

function changeIncrement() {
  var changeSlewButton = document.getElementById("changeSlew");

  changeSlewButton.style.backgroundColor = changeSlewButton.style.backgroundColor === "darkgray" ? 'white':'darkgray'; 

  bigInc.style.display   = bigInc.style.display != 'none'? 'none' : 'block';
  smallInc.style.display = smallInc.style.display != 'none'? 'none' : 'block';
  tinyInc.style.display  = tinyInc.style.display != 'none'? 'none' : 'block';
}

function intToggle() {
  if (changingInt) {
    changingInt = false;
  } else if (!changingInt) {
    changingInt = true;
  }
  var intInput = document.getElementById("intTime");
  intInput.style.display = intInput.style.display != 'none' ? 'none' : 'block';

  var intToggleButton = document.getElementById("intToggleButton");

  if (intToggleButton.style.backgroundColor === 'darkgray') {
    intToggleButton.style.backgroundColor = 'white';
  } else {
    intToggleButton.style.backgroundColor = 'darkgray';
  }
}

function onGalaxyChecker() {
  var extent = allGalExtent[currentField];
  var xmin = extent[0];
  var xmax = extent[1];
  var ymin = extent[2];
  var ymax = extent[3];
  if ((xpos > xmin) && (xpos < xmax) && (ypos > ymin) && (ypos < ymax)) {
    zoomInBool = true;
    document.getElementById("zoomIn").style.backgroundColor  = "white";
  } else {
    zoomInBool = false;
    document.getElementById("zoomIn").style.backgroundColor  = "darkgray";
  }
}

function showAll() {
  var changeFieldButton = document.getElementById("changeField")

  if (changeFieldButton.style.backgroundColor === 'darkgray') {
    changeFieldButton.style.backgroundColor = 'white';
  } else {
    changeFieldButton.style.backgroundColor = 'darkgray';
  }

  field1 = document.getElementById("Field1");
  field1.style.display = field1.style.display != 'none'? 'none' : 'block';
  
  field2 = document.getElementById("Field2");
  field2.style.display = field2.style.display != 'none'? 'none' : 'block';
  
  field3 = document.getElementById("Field3");
  field3.style.display = field3.style.display != 'none'? 'none' : 'block';

  field4 = document.getElementById("Field4");
  field4.style.display = field4.style.display != 'none'? 'none' : 'block';

  field5 = document.getElementById("Field5");
  field5.style.display = field5.style.display != 'none'? 'none' : 'block';
}

function switchImage(which2switch) {
  if ((!move) && (close)) {
    image = document.getElementById(which2switch);
  
    currentField = whichIsWhich[which2switch];
    TRUE_REDSHIFT = TRUE_REDSHIFTS[currentField];
    APP_MAG       = APP_MAGS[currentField];
    DIST          = DISTS[currentField];

    CALCIUM_H_REDSHIFTED = CALCIUM_H + CALCIUM_H * TRUE_REDSHIFT;
    CALCIUM_K_REDSHIFTED = CALCIUM_K + CALCIUM_K * TRUE_REDSHIFT;

    document.getElementById("appMag").innerHTML = APP_MAG;
    document.getElementById("galaxyName").innerHTML = whichZoomIn[currentField];
    document.getElementById("fieldDisplay").innerHTML = 'Target: ' + whichZoomIn[currentField];

    zoomOutBool = false;

    document.getElementById('intTime').value = '';

    imgName = which2switch;
    xpos = 60;
    ypox = 40;
    document.getElementById('domeWarningContainer').style.display = 'none';
    document.getElementById('domeWarning').innerHTML = '';

    cHelp = colorHelper[which2switch]

    document.getElementById(cHelp).style.backgroundColor = 'white';    

    keys = Object.keys(colorHelper);
    for (var i = 0; i < keys.length; ++i) {
      if (keys[i] != which2switch) {
        document.getElementById(colorHelper[keys[i]]).style.backgroundColor = 'darkgray';
      }
    }
    //document.getElementById("fieldDisplay").innerHTML = document.getElementById(cHelp).innerHTML;

  } else {
    document.getElementById('domeWarningContainer').style.display = 'block';
    document.getElementById('domeWarning').innerHTML = 'You must close the dome before you can change fields';
  }
  //telescopeFrame();
}

function autoSwitch(direction) {
  keys = Object.keys(whichIsWhichBackward);

  var currentIndex = keys.indexOf(currentField);
  var nextIndex = -1;  


  if (direction === 'forward') {
    nextIndex = currentIndex + 1;
    if (nextIndex > keys.length - 1) {
      nextIndex = 0;
    }
  } else if (direction = 'backward') {
    nextIndex = currentIndex - 1;
    if (nextIndex < 0) {
      nextIndex = keys.length - 1;
    }
  }

  switchImage(whichIsWhichBackward[keys[nextIndex]]);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function generateGaussian(mean,std){
  var _2PI = Math.PI * 2;
  var u1 = Math.random();
  var u2 = Math.random();
  
  var z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(_2PI * u2);
  var z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(_2PI * u2);

  return z1 * std + mean;
}

function updateClickFromCenter() {
  currentGalaxyCenter = zoomGalaxyCenters[currentField];
  var xcenter = currentGalaxyCenter[0];
  var ycenter = currentGalaxyCenter[1];
  var roughExtent = currentGalaxyCenter[2];

  var distance = ( (xpos - xcenter) ** 2 + (ypos - ycenter) ** 2 ) ** (1/2);

  if (emptyField) {
    CLICK_FROM_CENTER = 0.0;
  } else if (distance < roughExtent) {
    CLICK_FROM_CENTER = 1;
  } else if (distance < roughExtent*1.15) {
    CLICK_FROM_CENTER = 0.25;
  } else if (distance < roughExtent*1.5) {
    CLICK_FROM_CENTER = 0.1;
  } else {
    CLICK_FROM_CENTER = 0.01;
  }
}