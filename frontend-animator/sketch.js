let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 20;
let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 20;

let canvasWidth = viewportWidth / 2;
let canvasHeight = viewportHeight / 2;
let transitionInDuration = 900; // ms
let transitionOutDuration = 900; // ms
let infreq = 3; // infrequency of shake.

let panels = [
  {
    imageUrl: "https://1.bp.blogspot.com/-lU1Rt8aiz_Q/TjigCH36HdI/AAAAAAAACRA/t97PyzdFg_c/s640/MangaPanelTears.png",
    animations: [
      {
        type: "shake",
        order: 0,
        duration: 3000 // ms
      },
    ],
    transitionInType: "fadeIn",
    transitionOutType: "fadeOut"
  },
  {
    imageUrl: "https://2.bp.blogspot.com/-4SQSXJqyzOw/TjihymjBf_I/AAAAAAAACSA/2zN8dwb-xTY/s640/MangaPanelRun.jpg",
    animations: [
      {
        type: "shake",
        order: 0,
        duration: 3000 // ms
      },
    ],
    transitionInType: "fadeIn",
    transitionOutType: "fadeOut"
  }
];

let currentPanelIndex = 0;
let imgPosX = 0;
let imgPosY = 0;
let opacity = 0; // default opaque
let imgSize = 100; // percent
let infreq_occ = 0;
let startFrameTime = 0;


/**
 * @param {object[]} animations
 * Given animations array, return the current animations being played
 */
function getCurrentAnimations(animations) {
  if (animations.length === 0) {
    return [];
  }
  let currentAnimations = [ animations[0] ];
  let currentOrder = animations[0].order;
  let currentIndex = 1;
  while (currentIndex < animations.length && animations[currentIndex].order === currentOrder) {
    currentAnimations.push(animations[currentIndex]);
    currentIndex += 1;
  }
  return currentAnimations;
}

function applyAnimation(animationConfig) {
  switch (animationConfig.type) {
    case "shake":
      if (typeof animationConfig.hasSetCenter === 'undefined') {
        animationConfig.centerX = imgPosX;
        animationConfig.centerY = imgPosY;
        animationConfig.hasSetCenter = true;
      }
      if (infreq_occ !== infreq) {
        infreq_occ += 1
        break;
      }
      let diff = min(canvasHeight * 0.02, 10)
      imgPosX = animationConfig.centerX + random(-1 * diff, diff);
      imgPosY = animationConfig.centerY + random(-1 * diff, diff);
      infreq_occ = (infreq_occ + 1) % infreq;
      break;
    case "fadeIn":
      opacity = min((transitionInDuration - animationConfig.duration) / transitionInDuration * 255, 255);
      break;
    case "fadeOut":
      opacity = max((animationConfig.duration / transitionOutDuration) * 255, 0);
      break;
    case "panLeft":
      break;
    default:
      throw new Error(`This animation type is not supported: ${animationConfig.type}`);
  }
}

function setup() {
  background(255, 255, 255);
  createCanvas(canvasWidth, canvasHeight);
  frameRate(30);
  
  panels = panels.map((panel => ({ // panel animation configuration transformation
    imagePanel: loadImage(panel.imageUrl), // convert imageUrl to image, make sure CORS are setup
    animations: [
      {
        type: panel.transitionInType,
        order: 0,
        duration: transitionInDuration // ms
      },
      ...panel.animations,
      {
        type: panel.transitionOutType,
        order: panel.animations.length - 1,
        duration: transitionOutDuration, // ms
      },
    ],
  })));

  startFrameTime = millis();
}

function draw() {
  if (currentPanelIndex >= panels.length) {
    clear();
    return;
  }
  let currAnimations = getCurrentAnimations(panels[currentPanelIndex].animations);
  let newTime = millis();
  for (let i = 0; i < currAnimations.length; i++) { // deliberate minus one in for loop conditional.
    let lastIndex = currAnimations.length - 1;
    if (i === lastIndex 
      && currAnimations.length > 1
      && !(currAnimations.length === panels[currentPanelIndex].animations.length 
          && currAnimations[lastIndex].duration >= currAnimations[lastIndex - 1].duration)) {
      continue;
    }
    applyAnimation(currAnimations[i]);
    currAnimations[i].duration -= (newTime - startFrameTime);
  }

  background(255, 255, 255);
  // draw image in specific configurations
  tint(255, opacity); 
  image(panels[currentPanelIndex].imagePanel, imgPosX, imgPosY); // zoom not implemented yet
  
  // update array/currentPanelIndex if necessary.
  for (let i = 0; i < currAnimations.length; i++) {
    if (currAnimations[i].duration < 0) {
      panels[currentPanelIndex].animations.shift();
    }
  }

  if (panels[currentPanelIndex].animations.length === 0) {
    currentPanelIndex += 1;
    
  }
  startFrameTime = millis();
}
