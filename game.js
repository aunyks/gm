const [CANVAS_WIDTH, CANVAS_HEIGHT] = [320, 320]

function setup() {
  const cnv = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  cnv.parent('sketch-container')
}

function sleep(miliseconds) {
  const currentTime = new Date().now();
  while (currentTime + miliseconds >= new Date().now()) { }
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
    world: 'dungeon', // dungeon | grass | beach | failure | success
    backgroundPieces: createDungeonBg(10)
  }
}

alert('Welcome to Underworlds!')
alert('To win the game, advance to all of the levels.')
alert('To advance levels, answer the prompts correctly.')
alert('To get prompted, move enough meters in a direction. Good luck!')
alert('Stan:\n\nI\'m Stan, and I\'ve trapped your friend Nathan in my dungeon world.\n\nI think he\'s trying to get out, but every time he moves far enough he\'s prompted with a question that he can\'t answer!\n\nI\'m so smart haha')
let gameRendered = -60
let nathanGreeted = false
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
    case 'failure':
      background(0)
      fill(255)
      text(`You've failed.\n\nIf you want to amount to\nsomething better, refresh the page.`, 20, 140)
      sleep(30 * 60 * 1000)
      break;
    case 'success':
      background(255)
      fill(0)
      text(`You've succeeded!\n\nYour effort is spectacular.`, 20, 140)
      sleep(30 * 60 * 1000)
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

  textSize(18)
  text(`Meters: ${nathan.distanceTraveled}`, 20, 30)

  if (world === 'dungeon' && nathan.distanceTraveled >= 500) {
    if (prompt('How many 1s are in 2?').trim() === '2') {
      gameState.environment.world = 'grass'
      gameState.environment.backgroundPieces = createGrassBg(5)
      nathan.distanceTraveled = 0
      alert(`Stan:\n\nWhat?! That's preposterous? How'd he answer it right?\n\nAh, goodness. It was you wasn't it? Well, good luck getting out of the next few worlds.`)
      alert(`Nathan:\n\nOmg good job! Now it looks like we're in a grassy world. I think I remember my friend saying to go 1000 backward to get prompted..`)
    } else {
      alert('Incorrect')
      gameState.environment.world = 'failure'
    }
  } else if (world === 'grass' && nathan.distanceTraveled <= -1000) {
    if (prompt(`What's 1 + 2?`).trim() === '3') {
      gameState.environment.world = 'beach'
      gameState.environment.backgroundPieces = []
      nathan.distanceTraveled = 0
      alert(`Hm, not bad. Next is the beach world. Travel 2000 meters forward to win the game.`)
    } else {
      alert('Incorrect')
      gameState.environment.world = 'failure'
    }
  } else if (world === 'beach' && nathan.distanceTraveled >= 2000) {
    if (prompt(`What's the first letter of the alphabet?`).trim().toUpperCase() === 'A') {
      gameState.environment.world = 'beach'
      gameState.environment.backgroundPieces = []
      nathan.distanceTraveled = 0
      alert(`Spectacular.`)
      gameState.environment.world = 'success'
    } else {
      alert('Incorrect')
      gameState.environment.world = 'failure'
    }
  } else { }
  if (gameRendered > 1 && !nathanGreeted) {
    alert(`Nathan:\n\nHey! HEY! You there! Help me!\n\nI'm trapped in this weird dungeon but every time I look for an exit I get hit with a tough question.\n\nAnd then when I answer it wrong some Stan guy laughs and says "I'm so smart" and does this ugly laugh thing. Please help me answer them so I can leave!`)
    alert('Nathan:\n\nI remember getting prompted last time I moved 500 meters forward. Let\'s try that again..')
    nathanGreeted = true
  } else {
    gameRendered += 1
  }
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