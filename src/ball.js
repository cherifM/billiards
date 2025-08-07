import * as THREE from 'three'

export const BALL = {
  radius: 0.05715/2,
  mass: 0.17
}

export function createBall(color, number, isStripe = false){
  const geom = new THREE.SphereGeometry(BALL.radius, 48, 32)
  const mat = new THREE.MeshStandardMaterial({ color, roughness:0.4, metalness:0.0 })
  const mesh = new THREE.Mesh(geom, mat)
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.userData.vel = new THREE.Vector3()
  mesh.userData.ang = new THREE.Vector3()
  mesh.userData.spin = new THREE.Vector3()
  mesh.userData.inPocket = false
  mesh.userData.number = number
  mesh.userData.isStripe = isStripe
  mesh.userData.isSolid = !isStripe && number !== 0 && number !== 8

  if (number > 0) {
    addBallNumber(mesh, number, isStripe)
  }
  
  return mesh
}

function addBallNumber(ball, number, isStripe) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 128
  canvas.height = 128
  
  ctx.fillStyle = isStripe ? '#ffffff' : (number === 8 ? '#ffffff' : '#000000')
  ctx.fillRect(0, 0, 128, 128)
  
  if (isStripe) {
    ctx.fillStyle = ball.material.color.getStyle()
    ctx.fillRect(0, 40, 128, 48)
  }
  
  ctx.fillStyle = isStripe || number === 8 ? '#000000' : '#ffffff'
  ctx.font = 'bold 60px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(number.toString(), 64, 64)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  
  const numberMat = new THREE.MeshStandardMaterial({ 
    map: texture, 
    roughness: 0.4, 
    metalness: 0.0 
  })
  
  const numberGeom = new THREE.SphereGeometry(BALL.radius + 0.001, 32, 16)
  const numberMesh = new THREE.Mesh(numberGeom, numberMat)
  ball.add(numberMesh)
}

export function createSet(){
  const ballData = [
    { color: 0xffffff, number: 0, isStripe: false },
    { color: 0xffeb3b, number: 1, isStripe: false },
    { color: 0x2196f3, number: 2, isStripe: false },
    { color: 0xf44336, number: 3, isStripe: false },
    { color: 0x9c27b0, number: 4, isStripe: false },
    { color: 0xff9800, number: 5, isStripe: false },
    { color: 0x4caf50, number: 6, isStripe: false },
    { color: 0x795548, number: 7, isStripe: false },
    { color: 0x000000, number: 8, isStripe: false },
    { color: 0xffeb3b, number: 9, isStripe: true },
    { color: 0x2196f3, number: 10, isStripe: true },
    { color: 0xf44336, number: 11, isStripe: true },
    { color: 0x9c27b0, number: 12, isStripe: true },
    { color: 0xff9800, number: 13, isStripe: true },
    { color: 0x4caf50, number: 14, isStripe: true },
    { color: 0x795548, number: 15, isStripe: true }
  ]
  
  const balls = ballData.map(data => createBall(data.color, data.number, data.isStripe))
  return balls
}
