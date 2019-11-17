const [CANVAS_WIDTH, CANVAS_HEIGHT] = [320, 320]

function setup() {
  const cnv = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  cnv.parent('sketch-container')
}

const settings = {
  environment: {
    thickness: 80, // px
    edgeThickness: 10
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
    height: 20, // px
    thickness: 10, // px
    xMovementRate: 1 // px per ms, i think
  },
  environment: {
    world: 'grass', // dungeon | grass | beach
    backgroundPieces: createGrassBg(10)
  }
}

function draw() {
  clear()
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
      window.location.href = 'https://example.com'
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

}