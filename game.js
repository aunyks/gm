const [CANVAS_WIDTH, CANVAS_HEIGHT] = [320, 320]

function setup() {
  const cnv = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  cnv.parent('sketch-container')
}

const settings = {
  environment: {
    thickness: 80, // px
    edgeThickness: 10
  },
  controls: {
    tapMargin: 60
  }
}

const randBw = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

const createDungeonBg = numPieces =>
  [...(new Array(numPieces)).keys()].map(() => {
    const [y, x, w, h, f, s] = [
      randBw(settings.environment.thickness, CANVAS_HEIGHT - settings.environment.thickness),
      randBw(5, CANVAS_WIDTH),
      randBw(5, 30),
      randBw(5, 20),
      [0, 0, 0],
      [96, 96, 96]
    ]
    return ({
      y: y - h - randBw(3, 5),
      x,
      w,
      h,
      f,
      s
    })
  })

const createGrassBg = numPieces =>
  [...(new Array(numPieces)).keys()].map(() => {
    const [y, x, w, h, f, s] = [
      randBw(settings.environment.thickness, CANVAS_HEIGHT - settings.environment.thickness),
      randBw(5, CANVAS_WIDTH),
      randBw(5, 30),
      randBw(5, 20),
      [0, 160, 0],
      [181, 101, 29]
    ]
    return ({
      y: y - h - randBw(3, 5),
      x,
      w,
      h,
      f,
      s
    })
  })

const gameState = {
  nathan: {
    legUp: false,
    height: 40, // px
    thickness: 10, // px
    skinColor: [135, 97, 39],
    shirtColor: [255, 0, 0],
    pantsColor: [0, 0, 255],
    shoeColor: [0, 0, 0],
    xMovementRate: 0, // px per ms, i think
    distanceTraveled: 0
  },
  environment: {
    world: 'dungeon', // dungeon | grass | beach
    backgroundPieces: createDungeonBg(10)
  }
}

let ctr = 0
function draw() {
  clear()
  const ms = millis()
  const { environment } = settings
  const { xMovementRate } = gameState.nathan
  const { world, backgroundPieces } = gameState.environment
  switch (world) {
    case 'dungeon':
      background(208)
      fill(128)
      stroke(96)
      strokeWeight(10)
      rect(0 - environment.edgeThickness, 0 - environment.edgeThickness, CANVAS_WIDTH + 2 * environment.edgeThickness, environment.thickness)
      rect(0 - environment.edgeThickness, CANVAS_HEIGHT - environment.thickness, CANVAS_WIDTH + 2 * environment.edgeThickness, CANVAS_HEIGHT)
      break;
    case 'grass':
      background(0, 0, 255, 64)
      fill(0, 160, 0)
      stroke(181, 101, 29)
      strokeWeight(10)
      rect(0 - environment.edgeThickness, 0 - environment.edgeThickness, CANVAS_WIDTH + 2 * environment.edgeThickness, environment.thickness)
      rect(0 - environment.edgeThickness, CANVAS_HEIGHT - environment.thickness, CANVAS_WIDTH + 2 * environment.edgeThickness, CANVAS_HEIGHT)
      break;
    case 'beach':
      fill(251, 171, 129)
      stroke(251, 151, 109)
      rect(0 - environment.edgeThickness, 0 - environment.edgeThickness, CANVAS_WIDTH + 2 * environment.edgeThickness, environment.thickness)
      rect(0 - environment.edgeThickness, CANVAS_HEIGHT - environment.thickness, CANVAS_WIDTH + 2 * environment.edgeThickness, CANVAS_HEIGHT)
      break;
    default:
      alert(`Something tried to change the environment to "${world}", which doesn't exist`)
      window.location.reload()
      break;
  }
  backgroundPieces.forEach(p => {
    const { x, y, w, h, f, s } = p
    fill([...f])
    stroke([...s])
    rect(x, y, w, h)
    p.x -= xMovementRate
    if (p.x < 0) {
      p.x = CANVAS_WIDTH
    } else if (p.x > CANVAS_WIDTH) {
      p.x = 0
    } else { }
  })

  // Draw Nathan
  const { nathan } = gameState
  if (xMovementRate !== 0) {
    if (ctr === 29 || ctr === 14) {
      gameState.nathan.legUp = !gameState.nathan.legUp
    }
    ctr = (ctr + 1) % 30
  } else {
    gameState.nathan.legUp = false
  }

  strokeWeight(0)
  // body
  fill(...nathan.skinColor)
  rect(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT - environment.thickness - nathan.height,
    nathan.thickness,
    nathan.height,
    10,
    10,
    0,
    0
  )

  fill(0)
  if (xMovementRate >= 0) {
    circle(
      CANVAS_WIDTH / 2 + 7,
      CANVAS_HEIGHT - environment.thickness - nathan.height + 4,
      2
    )
    rect(
      CANVAS_WIDTH / 2 + 5,
      CANVAS_HEIGHT - environment.thickness - nathan.height + 7,
      nathan.thickness - 5,
      1,
    )
  } else {
    circle(
      CANVAS_WIDTH / 2 + 3,
      CANVAS_HEIGHT - environment.thickness - nathan.height + 4,
      2
    )
    rect(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - environment.thickness - nathan.height + 7,
      nathan.thickness - 5,
      1,
    )
  }

  // shirt
  fill(...nathan.shirtColor)
  rect(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT - environment.thickness - nathan.height * 0.75,
    nathan.thickness,
    nathan.height * 0.25
  )
  // pants
  fill(...nathan.pantsColor)
  rect(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT - environment.thickness - nathan.height * 0.5,
    nathan.thickness,
    nathan.height * 0.35
  )
  // shoes
  fill(...nathan.shoeColor)
  rect(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT - environment.thickness - nathan.height * 0.15,
    nathan.thickness,
    nathan.height * 0.15
  )

  if (nathan.legUp) {
    // at this point in the program, movement rate will only be either positive or negative, not 0
    if (xMovementRate > 0) {
      fill(...nathan.pantsColor)
      rect(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - environment.thickness - nathan.height * 0.5,
        nathan.height * 0.5,
        nathan.thickness
      )
      fill(...nathan.shoeColor)
      rect(
        CANVAS_WIDTH / 2 + 0.35 * nathan.height,
        CANVAS_HEIGHT - environment.thickness - nathan.height * 0.5,
        nathan.height * 0.15,
        nathan.thickness
      )
    } else {
      fill(...nathan.pantsColor)
      rect(
        CANVAS_WIDTH / 2 - nathan.height * 0.5 + nathan.thickness,
        CANVAS_HEIGHT - environment.thickness - nathan.height * 0.5,
        nathan.height * 0.5,
        nathan.thickness
      )
      fill(...nathan.shoeColor)
      rect(
        CANVAS_WIDTH / 2 - nathan.height * 0.35,
        CANVAS_HEIGHT - environment.thickness - nathan.height * 0.5,
        nathan.height * 0.15,
        nathan.thickness
      )
    }
  }
  nathan.distanceTraveled += xMovementRate
}

function touchStarted() {
  if (mouseX < settings.controls.tapMargin) {
    gameState.nathan.xMovementRate = -2
  } else if (mouseX > CANVAS_WIDTH - settings.controls.tapMargin) {
    gameState.nathan.xMovementRate = 2
  } else {
    gameState.nathan.xMovementRate = 0
  }
}