let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 20;
let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 20;

let canvasWidth = viewportWidth / 2;
let canvasHeight = viewportHeight / 2;
let transitionInDuration = 900; // ms
let transitionOutDuration = 100; // ms
let infreq = 100; // infrequency of shake.

let panels = [
  {
    imageUrl: "https://1.bp.blogspot.com/-lU1Rt8aiz_Q/TjigCH36HdI/AAAAAAAACRA/t97PyzdFg_c/s640/MangaPanelTears.png",
    animations: [
      {
        type: "shake",
        order: 0,
        duration: 2000, // ms
        frequency: 0.9,
      },
    ],
    transitionInType: "fadeIn",
    transitionOutType: "fadeOut"
  },
  {
    imageUrl: "https://2.bp.blogspot.com/-4SQSXJqyzOw/TjihymjBf_I/AAAAAAAACSA/2zN8dwb-xTY/s640/MangaPanelRun.jpg",
    animations: [
      // {
      //   type: "shake",
      //   order: 0,
      //   duration: 3000 // ms
      // },
      {
        type: "panLeft",
        order: 0,
        duration: 2000 // ms
      },
    ],
    transitionInType: "fadeIn",
    transitionOutType: "fadeOut"
  },
  {
    imageUrl: "https://3.bp.blogspot.com/-XiKy9wDmOKc/TjihzEKQ2JI/AAAAAAAACSY/RNcoCuQJP5Q/s640/MangaPanelHand.jpg",
    animations: [
      {
        type: "zoomOut",
        order: 0,
        fromX: 655,
        fromY: 100,
        duration: 2500 // ms
      },
      {
        type: "shake",
        order: 1,
        duration: 2000 // ms
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
let imgSize = 1; // 100%
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
        animationConfig.frequency = animationConfig.frequency || 0.5;
        console.log(animationConfig.frequency);
      }
      if (infreq_occ < infreq && animationConfig.frequency !== 1) {
        infreq_occ += animationConfig.frequency * 100
        break;
      }
      let diff = min(canvasHeight * 0.02, 10)
      imgPosX = animationConfig.centerX + random(-1 * diff, diff);
      imgPosY = animationConfig.centerY + random(-1 * diff, diff);
      infreq_occ = (infreq_occ + (animationConfig.frequency * 10)) % infreq;
      break;
    case "fadeIn":
      opacity = min((transitionInDuration - animationConfig.duration) / transitionInDuration * 255, 255);
      break;
    case "fadeOut":
      opacity = max((animationConfig.duration / transitionOutDuration) * 255, 0);
      break;
    case "panLeft":
      if (typeof animationConfig.hasStarted === 'undefined') {
        animationConfig.hasStarted = true;
        imgSize = canvasHeight / panels[currentPanelIndex].imagePanel.height;
        animationConfig.distance = Math.abs((panels[currentPanelIndex].imagePanel.width * imgSize) - canvasWidth);
        console.log(`imageWidth: ${panels[currentPanelIndex].imagePanel.width}, canvasWidth: ${canvasWidth}`);
        animationConfig.initialDuration = animationConfig.duration;
      }
      imgPosX = - (Math.max(animationConfig.duration, 0) / animationConfig.initialDuration) * animationConfig.distance
      break;
    case "zoomOut":
      if (typeof animationConfig.hasStarted === 'undefined') {
        animationConfig.hasStarted = true;
        animationConfig.magnification = animationConfig.magnification || 3;
        animationConfig.initialDuration = animationConfig.duration;
        animationConfig.finalImgSize = min(canvasWidth / panels[currentPanelIndex].imagePanel.width, canvasHeight / panels[currentPanelIndex].imagePanel.height);

      }
      let initialDuration = animationConfig.initialDuration;
      let durr_min_zero = Math.max(animationConfig.duration, 0);
      imgSize = (animationConfig.magnification - 1) * (durr_min_zero / initialDuration) + animationConfig.finalImgSize;
      imgPosX = - (imgSize * animationConfig.fromX - (canvasWidth / 2)) * (durr_min_zero / initialDuration);
      imgPosY = - (imgSize * animationConfig.fromY - (canvasHeight / 2)) * (durr_min_zero / initialDuration);
      break;
    default:
      throw new Error(`This animation type is not supported: ${animationConfig.type}`);
  }
}

function preload() {
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
        order: panel.animations[panel.animations.length - 1].order,
        duration: transitionOutDuration, // ms
      },
    ],
  })));
  
}

function setup() {
  background(255, 255, 255);
  createCanvas(canvasWidth, canvasHeight);
  frameRate(30);

  imgSize = min(canvasWidth / panels[0].imagePanel.width, canvasHeight / panels[0].imagePanel.height);

  startFrameTime = millis();
}

function draw() {
  if (currentPanelIndex >= panels.length) {
    clear();
    return;
  }
  let currAnimations = getCurrentAnimations(panels[currentPanelIndex].animations);
  let newTime = millis();
  if (currentPanelIndex === 2) {
    // console.log(currAnimations);
    // console.log(panels[currentPanelIndex].animations);
    // debugger;
  }
  for (let i = 0; i < currAnimations.length; i++) { // deliberate minus one in for loop conditional.
    let lastIndex = currAnimations.length - 1;
    if (i === lastIndex 
      && currAnimations[i].type === 'fadeOut'
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
  let currImage = panels[currentPanelIndex].imagePanel;
  image(currImage, imgPosX, imgPosY, imgSize * currImage.width, imgSize * currImage.height); // zoom not implemented yet
  
  // update array/currentPanelIndex if necessary.
  for (let i = 0; i < currAnimations.length; i++) {
    if (currAnimations[i].duration < 0) {
      panels[currentPanelIndex].animations.shift();
    }
  }

  let noMoreAnimationsForPanel = panels[currentPanelIndex].animations.length === 0;
  if (noMoreAnimationsForPanel) {
    currentPanelIndex += 1;
  }
  if (noMoreAnimationsForPanel && currentPanelIndex < panels.length) {
    imgSize = min(canvasWidth / panels[currentPanelIndex].imagePanel.width, canvasHeight / panels[currentPanelIndex].imagePanel.height);
  }
  startFrameTime = millis();
}
