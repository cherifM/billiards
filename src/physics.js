import * as THREE from 'three'
import { BALL } from './ball.js'
import { TABLE } from './table.js'
import { audioManager } from './audio.js'
import { gameState } from './gamestate.js'

const g = 9.81
const mu_roll = 0.02
const mu_slide = 0.2
const restitution = 0.92
const cushionRestitution = 0.88
const spinDecay = 0.3

export function rackBalls(balls){
  const r = BALL.radius
  const startZ = 0.7
  let idx = 1
  const tri = 5
  for(let row=0; row<tri; row++){
    const z = startZ + row * r*Math.sqrt(3)
    const count = tri - row
    for(let i=0;i<count;i++){
      const x = (i - (count-1)/2) * 2*r
      const b = balls[idx++]
      if(!b) break
      b.position.set(x, TABLE.height + r, z)
      b.userData.vel.set(0,0,0)
      b.userData.ang.set(0,0,0)
      b.userData.spin.set(0,0,0)
      b.userData.inPocket = false
      b.visible = true
    }
  }
  const cue = balls[0]
  cue.position.set(0, TABLE.height + r, -TABLE.innerZ*0.35)
  cue.userData.vel.set(0,0,0)
  cue.userData.ang.set(0,0,0)
  cue.userData.spin.set(0,0,0)
  cue.userData.inPocket = false
  cue.visible = true
}

export function applyCueImpulse(ball, dir, power, contactOffset){
  const v0 = dir.clone().multiplyScalar(power / BALL.mass)
  ball.userData.vel.add(v0)
  const spin = new THREE.Vector3(-contactOffset.y*dir.z, contactOffset.x*dir.z - contactOffset.z*dir.x, contactOffset.y*dir.x)
  ball.userData.spin.add(spin.multiplyScalar(power * 0.02))
}

function railLimits(){
  const halfX = TABLE.innerX/2 - BALL.radius - TABLE.cushion*0.25
  const halfZ = TABLE.innerZ/2 - BALL.radius - TABLE.cushion*0.25
  return { halfX, halfZ }
}

function handleCushionCollision(b){
  const { halfX, halfZ } = railLimits()
  if(b.userData.inPocket) return
  const speed = Math.hypot(b.userData.vel.x, b.userData.vel.z)
  let collided = false
  
  if(b.position.x < -halfX && b.userData.vel.x < 0){ 
    b.position.x = -halfX; b.userData.vel.x *= -cushionRestitution; b.userData.spin.z *= 0.9; collided = true 
  }
  if(b.position.x >  halfX && b.userData.vel.x > 0){ 
    b.position.x =  halfX; b.userData.vel.x *= -cushionRestitution; b.userData.spin.z *= 0.9; collided = true 
  }
  if(b.position.z < -halfZ && b.userData.vel.z < 0){ 
    b.position.z = -halfZ; b.userData.vel.z *= -cushionRestitution; b.userData.spin.x *= 0.9; collided = true 
  }
  if(b.position.z >  halfZ && b.userData.vel.z > 0){ 
    b.position.z =  halfZ; b.userData.vel.z *= -cushionRestitution; b.userData.spin.x *= 0.9; collided = true 
  }
  
  if(collided && speed > 0.5) {
    audioManager.play('cushionHit', Math.min(speed / 5, 1))
  }
}

function pocketCenters(){
  const cx = TABLE.innerX/2 + TABLE.cushion*0.5
  const cz = TABLE.innerZ/2 + TABLE.cushion*0.5
  return [
    new THREE.Vector3(-cx, TABLE.height, -cz), new THREE.Vector3(0, TABLE.height, -cz), new THREE.Vector3(cx, TABLE.height, -cz),
    new THREE.Vector3(-cx, TABLE.height, cz), new THREE.Vector3(0, TABLE.height, cz), new THREE.Vector3(cx, TABLE.height, cz),
  ]
}

function checkPockets(b){
  for(const c of pocketCenters()){
    const d = new THREE.Vector3().subVectors(b.position, c)
    if(d.length() < TABLE.pocketR*0.75){
      b.userData.inPocket = true
      b.visible = false
      b.userData.vel.set(0,0,0)
      b.userData.spin.set(0,0,0)
      audioManager.play('pocket', 0.8)
      
      gameState.ballsPocketed.push(b)
      if(b.userData.number === 0) {
        gameState.cueBallPocketed = true
      } else if(b.userData.number === 8) {
        gameState.eightBallPocketed = true
      }
      return
    }
  }
}

function ballBallCollision(a,b){
  if(a.userData.inPocket || b.userData.inPocket) return
  const n = new THREE.Vector3().subVectors(b.position, a.position)
  const dist = n.length()
  const minDist = 2*BALL.radius
  if(dist < minDist && dist > 1e-6){
    n.multiplyScalar(1/dist)
    
    const overlap = minDist - dist
    const separationForce = overlap * 0.5
    a.position.addScaledVector(n, -separationForce)
    b.position.addScaledVector(n, separationForce)

    const va = a.userData.vel, vb = b.userData.vel
    const relativeVel = new THREE.Vector3().subVectors(va, vb)
    const velAlongNormal = relativeVel.dot(n)
    
    if(velAlongNormal > 0) return
    
    const e = restitution
    let j = -(1 + e) * velAlongNormal
    j /= 2
    
    const impulse = n.clone().multiplyScalar(j)
    va.add(impulse)
    vb.sub(impulse)
    
    relativeVel.subVectors(va, vb)
    const tangent = relativeVel.clone().sub(n.clone().multiplyScalar(relativeVel.dot(n)))
    if(tangent.length() < 1e-6) return
    
    tangent.normalize()
    const jt = -relativeVel.dot(tangent) / 2
    
    const frictionImpulse = tangent.clone().multiplyScalar(Math.min(Math.abs(jt), j * mu_slide))
    va.add(frictionImpulse)
    vb.sub(frictionImpulse)
    
    const spinTransfer = 0.2
    const spinImpulse = tangent.clone().multiplyScalar(jt * spinTransfer)
    a.userData.spin.add(spinImpulse)
    b.userData.spin.sub(spinImpulse)
    
    const collisionSpeed = Math.abs(velAlongNormal)
    if(collisionSpeed > 0.3) {
      audioManager.play('ballHit', Math.min(collisionSpeed / 3, 1))
    }
    
    if(!gameState.firstBallHit && (a.userData.number === 0 || b.userData.number === 0)) {
      gameState.firstBallHit = a.userData.number === 0 ? b : a
    }
  }
}

function integrateBall(b, dt){
  if(b.userData.inPocket) return
  const v = b.userData.vel
  const w = b.userData.spin

  const speed = Math.hypot(v.x, v.z)
  if(speed > 1e-4){
    const dir = new THREE.Vector3(v.x,0,v.z).normalize()
    const Fn = BALL.mass * g
    const Froll = mu_roll * Fn
    const decel = Froll / BALL.mass
    const ds = Math.min(speed, decel*dt)
    v.x -= dir.x * ds
    v.z -= dir.z * ds

    const rollSpin = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(ds / BALL.radius)
    w.add(rollSpin.multiplyScalar(0.3))
  }

  w.multiplyScalar(Math.max(0, 1 - spinDecay*dt))

  b.position.x += v.x * dt
  b.position.y = TABLE.height + BALL.radius
  b.position.z += v.z * dt

  checkPockets(b)
  handleCushionCollision(b)
}

export function stepPhysics(balls, dt){
  for(let i=0;i<balls.length;i++) for(let j=i+1;j<balls.length;j++) ballBallCollision(balls[i], balls[j])
  for(const b of balls) integrateBall(b, dt)
}

export function isAnyMoving(balls){
  return balls.some(b=>!b.userData.inPocket && (Math.hypot(b.userData.vel.x, b.userData.vel.z) > 0.02))
}
