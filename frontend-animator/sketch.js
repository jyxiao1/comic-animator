
let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 20;
let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 20;

let panels = [
  {
    imageUrl: "https://1.bp.blogspot.com/-lU1Rt8aiz_Q/TjigCH36HdI/AAAAAAAACRA/t97PyzdFg_c/s640/MangaPanelTears.png",
    animations: [
      {
        type: "shake",
        order: 0,
        duration: 6000 // ms
      },
    ],
    transitionInType: "",
    transitionOutType: ""
  },
  {
    imageUrl: "https://2.bp.blogspot.com/-4SQSXJqyzOw/TjihymjBf_I/AAAAAAAACSA/2zN8dwb-xTY/s640/MangaPanelRun.jpg",
    animations: [
      {
        type: "shake",
        order: 0,
        duration: 6000 // ms
      },
    ],
    transitionInType: "",
    transitionOutType: ""
  }
];

let currentPanelIndex = 0;
let imgPosX = 0;
let imgPosY = 0;
let imgSize = 100; // percent

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

function transformPositions(animationConfig) {
  switch (animationConfig.type) {
    case "shake":
      if (typeof animationConfig.hasSetCenter === 'undefined') {
        animationConfig.centerX = imgPosX;
        animationConfig.centerY = imgPosY;
        animationConfig.hasSetCenter = true;
      }
      let diff = min(viewportHeight * 0.04, 20)
      imgPosX = animationConfig.centerX + random(-1 * diff, diff);
      imgPosY = animationConfig.centerY + random(-1 * diff, diff);
      break;
    default:
      throw new Error("err, this animation type is not supported");
  }
}

function setup() {
  background(255, 255, 255);
  createCanvas(viewportWidth, viewportHeight);
  frameRate(30);
  
  panels = panels.map((panel => ({
    imagePanel: loadImage(panel.imageUrl), // convert imageUrl to image, make sure CORS are setup
    animations: panel.animations,
    transitionInType: panel.transitionInType,
    transitionOutType: panel.transitionOutType
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
  for (let i = 0; i < currAnimations.length; i++) {
    transformPositions(currAnimations[i]);
    currAnimations[i].duration -= (newTime - startFrameTime);
  }

  background(255, 255, 255);
  // draw image in specific configurations
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
