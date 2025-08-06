import * as THREE from 'three'
import { BALL } from './ball.js'
import { TABLE } from './table.js'

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
  if(b.position.x < -halfX && b.userData.vel.x < 0){ b.position.x = -halfX; b.userData.vel.x *= -cushionRestitution; b.userData.spin.z *= 0.9 }
  if(b.position.x >  halfX && b.userData.vel.x > 0){ b.position.x =  halfX; b.userData.vel.x *= -cushionRestitution; b.userData.spin.z *= 0.9 }
  if(b.position.z < -halfZ && b.userData.vel.z < 0){ b.position.z = -halfZ; b.userData.vel.z *= -cushionRestitution; b.userData.spin.x *= 0.9 }
  if(b.position.z >  halfZ && b.userData.vel.z > 0){ b.position.z =  halfZ; b.userData.vel.z *= -cushionRestitution; b.userData.spin.x *= 0.9 }
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
    const penetration = minDist - dist
    const corr = n.clone().multiplyScalar(penetration*0.5)
    a.position.add(n.clone().multiplyScalar(-corr.length()))
    b.position.add(corr)

    const va = a.userData.vel, vb = b.userData.vel
    const rel = new THREE.Vector3().subVectors(vb, va)
    const vn = rel.dot(n)
    if(vn < 0){
      const j = -(1+restitution)*vn / (2)
      const impulse = n.clone().multiplyScalar(j)
      va.add(impulse)
      vb.add(impulse.multiplyScalar(-1))

      const tangent = new THREE.Vector3(rel.x - vn*n.x, 0, rel.z - vn*n.z)
      const tl = tangent.length()
      if(tl>1e-6){
        tangent.multiplyScalar(1/tl)
        const jt = -mu_slide * tl / 2
        const tImp = tangent.clone().multiplyScalar(jt)
        va.add(tImp)
        vb.add(tImp.multiplyScalar(-1))
        const spinImp = tangent.clone().multiplyScalar(0.1*jt)
        a.userData.spin.add(spinImp)
        b.userData.spin.add(spinImp.multiplyScalar(-1))
      }
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
