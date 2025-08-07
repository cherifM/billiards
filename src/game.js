import * as THREE from 'three'
import { createTable, TABLE } from './table.js'
import { createSet, BALL } from './ball.js'
import { createCue, updateCue } from './cue.js'
import { rackBalls, applyCueImpulse, stepPhysics, isAnyMoving } from './physics.js'
import { audioManager } from './audio.js'
import { gameState } from './gamestate.js'

export function createGame(scene){
  const { group: table } = createTable()
  scene.add(table)

  const balls = createSet()
  balls.forEach(b=>{ b.position.y = TABLE.height + BALL.radius; scene.add(b) })
  rackBalls(balls)
  
  window.gameBalls = balls

  const cue = createCue()
  scene.add(cue)

  const state = { balls, cue, cueBall: balls[0], aiming: true, power: 0, aimDir: new THREE.Vector3(0,0,1) }
  gameState.reset()
  return state
}

export function rerack(state){
  rackBalls(state.balls)
  gameState.reset()
}

export function updateGame(state, camera, input, dt){
  const cb = state.cueBall
  const ballsMoving = isAnyMoving(state.balls)
  
  if(!ballsMoving){
    if(state.shotInProgress) {
      gameState.assignGroups(state.balls)
      gameState.checkLegalShot()
      gameState.endTurn()
      state.shotInProgress = false
    }
    
    const aimYaw = input.yaw
    state.aimDir.set(Math.sin(aimYaw), 0, Math.cos(aimYaw))
    state.power = input.power
    updateCue(state.cue, cb, state.aimDir, state.power)
  } else {
    state.power = 0
  }

  const target = cb.position.clone().add(new THREE.Vector3(-state.aimDir.x, 0.4, -state.aimDir.z).multiplyScalar(2.5))
  camera.position.lerp(target, 1 - Math.exp(-8*dt))
  camera.lookAt(cb.position)

  const wasAiming = state.aiming
  if(wasAiming && !input.aiming && state.power>0 && !ballsMoving){
    gameState.startShot()
    const offset = new THREE.Vector3(0, 0.01 + (Math.random()*0.01), 0)
    applyCueImpulse(cb, state.aimDir, 6 + state.power*30, offset)
    audioManager.play('cueShot', Math.min(state.power + 0.3, 1))
    state.shotInProgress = true
  }
  state.aiming = input.aiming

  stepPhysics(state.balls, dt)
}
